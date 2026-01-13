// commande-service/index.js
const express = require('express');
const port = 3014;
const mongoose = require('mongoose');
const Commande = require('./commande');
const axios = require('axios');
const isAuthenticated = require('./isAuthenticated');
const app = express();
app.use(express.json());
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
connectDB().then(() => {
    app.listen(port, () => {
             console.log(`Commande service running on http://localhost:${port}`);
     });})
async function totalPrice(produits) {
    let total = 0;

   for (let i = 0; i < produits.length; i++) {
             total += produits[i].price;

             }
             return total;    
}
async function httpRequest(ids) {
       try {
         const url=`${process.env.PRODUIT_SERVICE_URL}/produits/acheter`;
        const response = await axios.post(url, { ids:ids },
         { headers: { 
                'Content-Type': 'application/json' 
             } }  
   );
     return totalPrice(response.data.produits);
    } catch (error) {
         console.error('Error making HTTP request:', error);
         throw error;
    }        
}
app.post('/commandes/ajouter', isAuthenticated, async (req, res) => {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
         return res.status(400).json({ message: 'Invalid ids array' });
     }
    httpRequest(ids).then(async (total) => {
        const newCommande = new Commande({
             produits: ids,
             userEmail: req.user.email,
             totalPrice: total
         });
         console.log("Commande:", newCommande);  
          newCommande.save()
             .then(commande => res.status(201).json({ message: 'Commande created successfully', commande}))
             .catch((error) => res.status(500).json({ message: 'Error creating commande', error }));
     }
             ).catch((error) => res.status(500).json({ message: 'Error processing commande', error }));
});


           