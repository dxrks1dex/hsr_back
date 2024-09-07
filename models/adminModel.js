const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
    username: String,
    password: String
});

const AdminModel = mongoose.model('AdminModel', adminSchema)

module.exports = AdminModel