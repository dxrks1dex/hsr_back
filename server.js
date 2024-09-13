// server.js
const express = require("express");
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const User = require("./models/userModel");
const Characters = require("./models/charactersModel")
const LightCone = require("./models/lightConeModel")
const PickAndBans = require("./models/pickAndBanModel")
const Timer = require("./models/timerModel")
const ForProd = require('./models/forProdModel')
const forProdFileModel = require('./models/forProdFileModel');
const cors = require("cors");
const http = require("http");
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();

const port = process.env.PORT || 3000
const server = http.createServer(app)

const VALID_ADMIN_NAME = process.env.VALID_ADMIN_NAME;
const VALID_PASSWORD = process.env.VALID_PASSWORD;
const secretKey = process.env.SECRET_KEY

app.use(cors());

// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

app.get("/", (req, res) => {
    res.send("Hello HSR tour API");
});

let clients = [];

const eventsHandler = (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    clients.push(res);

    req.on('close', () => {
        clients = clients.filter(client => client !== res);
    });
};

const sendEventsToAll = (newData) => {
    clients.forEach(client => client.write(`data: ${JSON.stringify(newData)}\n\n`));
};

app.get('/forProd/updates', eventsHandler);

// Маршрут для получения всех записей
app.get('/forProd', async (req, res) => {
    try {
        const forProd = forProdFileModel.getAllForProd();
        res.status(200).json(forProd);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Маршрут для обновления всех записей
app.put('/forProd', async (req, res) => {
    try {
        const updatedParams = req.body;
        let data = forProdFileModel.getAllForProd();

        // Обновляем только те поля, которые были отправлены в запросе
        data = data.map(item => ({
            ...item,
            ...Object.keys(updatedParams).reduce((acc, key) => {
                if (updatedParams[key] !== undefined) {
                    acc[key] = updatedParams[key];
                }
                return acc;
            }, {})
        }));

        forProdFileModel.writeDataToFile(data);
        sendEventsToAll(data);

        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});


// Маршрут для добавления новой записи
app.post("/forProd", async (req, res) => {
    try {
        const pickAndBanData = req.body;
        forProdFileModel.addForProd(pickAndBanData);
        sendEventsToAll(pickAndBanData);
        res.status(201).json(pickAndBanData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Маршрут для удаления всех записей
app.delete("/forProd", async (req, res) => {
    try {
        forProdFileModel.writeDataToFile([]);
        sendEventsToAll({ message: 'All picks and bans deleted' });
        res.status(200).json({ message: 'All picks and bans deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/pickAndBan/updates', eventsHandler);

app.get('/pickAndBan', async (req, res) => {
    try {
        const pickAndBan = await PickAndBans.find({});
        res.status(200).json(pickAndBan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put('/pickAndBan/:player', async (req, res) => {
    try {
        const { player } = req.params;
        const updatedCharacters = req.body;

        const filter = { [player]: updatedCharacters };

        await PickAndBans.updateMany({}, { $set: filter });

        const updatedData = await PickAndBans.findOne(filter);

        // console.log(updatedData)
        sendEventsToAll(updatedData);

        res.status(200).json(filter);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post("/pickAndBan", async (req, res) => {
    try {
        const pickAndBanData = req.body;
        const pickAndBan = new PickAndBans(pickAndBanData);
        await pickAndBan.save();

        sendEventsToAll(pickAndBan);

        res.status(201).json(pickAndBan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.delete("/pickAndBan", async (req, res) => {
    try {
        const pickAndBans = await PickAndBans.deleteMany();
        if (!pickAndBans) {
            return res.status(404).json({ message: `No picks and bans` });
        }

        sendEventsToAll({ message: 'All picks and bans deleted' });

        res.status(200).json(pickAndBans);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.get('/login', async (req, res) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).send('Need auth');
    }

    const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    if (username === VALID_ADMIN_NAME && password === VALID_PASSWORD) {
        const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).send('Incorrect data');
    }
});

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

app.get('/protected', authenticateToken, (req, res) => {
    res.json(req.user);
});

app.get("/users", async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get("/lightcone", async (req, res) => {
    try {
        const lightCones = await LightCone.find({});
        res.status(200).json(lightCones);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get("/users/:uid", async (req, res) => {
    try {
        const { uid } = req.params;
        const user = await User.findOne({ uid });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post("/users", async (req, res) => {
    try {
        const userData = req.body;
        const user = await User.create(userData);
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put("/users/:uid", async (req, res) => {
    try {
        const { uid } = req.params;
        const userData = req.body;
        const user = await User.findOneAndUpdate({ uid: uid }, userData, { new: true });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.delete("/users/:uid", async (req, res) => {
    try {
        const { uid } = req.params;
        const user = await User.findOneAndDelete({uid: uid});
        if (!user) {
            return res.status(404).json({ message: `User not found with ID ${uid}` });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get("/characters", async (req, res) => {
    try {
        const characters = await Characters.find({});
        res.status(200).json(characters);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get("/characters/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const character = await Characters.findOne({ id });
        if (!character) {
            return res.status(404).json({ message: "Character not found" });
        }
        res.status(200).json(character);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post("/characters", async (req, res) => {
    try {
        const characters = req.body;
        const character = await Characters.create(characters);
        res.status(201).json(character);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put("/characters/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const characterData = req.body;
        const character = await Characters.findOneAndUpdate({ id: id }, characterData, { new: true });
        res.status(200).json(character);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put("/characters", async (req, res) => {
    try {
        const updatedCharacters = req.body;

        await Promise.all(updatedCharacters.map(async (character) => {
            await Characters.updateOne({ id: character.id }, { $set: { cost: character.cost, rankCost: character.rankCost } });
        }));

        res.status(200).json({ message: "Cost updated for all characters" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.delete("/characters", async (req, res) => {
    try {
        const characters = await Characters.deleteMany();
        if (!characters) {
            return res.status(404).json({ message: `No characters` });
        }
        res.status(200).json(characters);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get("/lightcones", async (req, res) => {
    try {
        const lightCones = await LightCone.find({});
        res.status(200).json(lightCones);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get("/lightcone/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const lightCone = await LightCone.findOne({ id });
        if (!lightCone) {
            return res.status(404).json({ message: "Cone not found" });
        }
        res.status(200).json(lightCone);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put("/lightcone/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const lightConeData = req.body;
        const lightCone = await LightCone.findOneAndUpdate({ id: id }, lightConeData, { new: true });
        res.status(200).json(lightCone);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post("/lightcones", async (req, res) => {
    try {
        const lightCones = req.body;
        const lightCone = await LightCone.create(lightCones);
        res.status(201).json(lightCone);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put("/lightcones", async (req, res) => {
    try {
        const updatedCones = req.body;

        await Promise.all(updatedCones.map(async (cone) => {
            await LightCone.updateOne({ id: cone.id }, { $set: { cost: cone.cost, rankCost: cone.rankCost } });
        }));

        res.status(200).json({ message: "Cost updated for all cones" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.delete("/lightcones", async (req, res) => {
    try {
        const lightCones = await LightCone.deleteMany();
        if (!lightCones) {
            return res.status(404).json({ message: `All cone deleted` });
        }
        res.status(200).json(lightCones);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/timer', async (req, res) => {
    try {
        const timer = await Timer.findOne();
        if (!timer) {
            return res.status(404).json({ message: 'Timer not exist' });
        }
        res.json(timer);
    } catch (error) {
        res.status(500).json({ error: 'Timer get error' });
    }
});

app.post('/timer/update', async (req, res) => {
    try {
        const { penaltyTimer, mainTimer } = req.body;

        const updatedTimer = await Timer.findOneAndUpdate({}, {
            penaltyTimer,
            mainTimer
        }, { new: true, upsert: true });

        res.json(updatedTimer);
    } catch (error) {
        res.status(500).json({ error: 'Error of update timer' });
    }
});


mongoose.set("strictQuery", false);
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('connected to MongoDB');
        server.listen(port, () => {
            console.log(`Node API app is running on port ${port}`);
        });
    }).catch((error) => {
    console.log(error);
});

