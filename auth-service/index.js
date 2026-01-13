
// auth-service/index.js
const express = require('express');
const mongoose = require('mongoose');
const User = require('./user');
const app = express();
app.use(express.json());
const port = 3012;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
//if there is a wrong query parameter, mongoose will ignore it
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
             console.log(`Auth service running on http://localhost:${port}`);
     });})

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
     console.log("password:",password);
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }else {
        bcrypt.hash(password, 10, async (err, hash) => {
             if (err) {
                 return res.status(500).json({ message: 'Error hashing password' });
             }
             let hashedPassword = hash;
             const newUser = new User({ name, email, password: hashedPassword }); 
             newUser.save()
                .then(() => res.status(201).json({ message: 'User registered successfully' , user: newUser}))
                   .catch((error) => res.status(500).json({ message: 'Error registering user', error }));
         });
    }
});
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }
    isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
             return res.status(400).json({ message: 'Invalid email or password' }); }
    const payload= { email,name:user.name };

    jwt.sign(payload,"secret",(err,token)=>{
                    if(err) {
                        return res.status(500).json({ message: 'Error generating token' });}
                    else {
                        res.status(200).json({ message: 'Login successful', token });
                    }
             res.status(200).json({ message: 'Login successful', token });
 });
             }
);


