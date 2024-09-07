const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, 'forProdData.txt');

function readDataFromFile() {
    if (fs.existsSync(dataFilePath)) {
        const txtData = fs.readFileSync(dataFilePath, 'utf8');
        return txtData.split('\n').filter(line => line).map(line => JSON.parse(line));
    }
    return [];
}

function writeDataToFile(data) {
    const txtData = data.map(item => JSON.stringify(item)).join('\n');
    fs.writeFileSync(dataFilePath, txtData, 'utf8');
}

function getAllForProd() {
    return readDataFromFile();
}

function addForProd(newProd) {
    const data = readDataFromFile();
    data.push(newProd);
    writeDataToFile(data);
}

module.exports = {
    getAllForProd,
    addForProd,
    writeDataToFile
};
