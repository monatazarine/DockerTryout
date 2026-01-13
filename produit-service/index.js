
// produit-service/index.js
const express = require('express');
const mongoose = require('mongoose');
const Produit = require('./Produit');
const app = express();
app.use(express.json());
const port = 3013;

mongoose.set('strictQuery', true);
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
             console.log('Connected to MongoDB');
     } catch (error) {
             console.error('Error connecting to MongoDB:', error);
             process.exit(1);
    }
}
app.post('/produits/ajouter', async (req, res) => {
        const { name, description, price } = req.body;
       
        const newProduit = new Produit({ name, description, price });
        console.log("Produit:", newProduit);
        await newProduit.save()
        .then(() => res.status(201).json({ message: 'Produit added successfully' , produit: newProduit }))
        .catch((error) => res.status(500).json({ message: 'Error adding produit', error }));
    });

app.post('/produits/acheter', async (req, res) => {
             const { ids } = req.body;


             const produits = await Produit.find({ _id: { $in: ids } });
             console.log(produits);
             res.status(200).json({ message: 'Produit purchased successfully', produits});
             });
            

connectDB().then(() => {
    app.listen(port, () => {
             console.log(`Produit service running on http://localhost:${port}`);
     });})