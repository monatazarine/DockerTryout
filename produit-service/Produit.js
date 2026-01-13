const mongoose = require('mongoose');
const produitSchema = new mongoose.Schema({
    name: String, 
     description: String,
     price: Number,
     created_at: { type: Date, default: Date.now(), }
});
module.exports = mongoose.model('Produit', produitSchema);