//Schema för ärenden
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//DB-Schema
var errandsSchema = new Schema({
    description: String,
    status: String,
    date: String,
    id: Number
});

//Exportera schema
module.exports = mongoose.model('errands', errandsSchema);