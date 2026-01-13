const mongoose = require('mongoose');
const commandeSchema = new mongoose.Schema({
    produits:{
        type: [String]},
        userEmail: String,
        totalPrice: Number,
        created_at: { type: Date, default: Date.now(), }
});
module.exports = mongoose.model('Commande', commandeSchema);         