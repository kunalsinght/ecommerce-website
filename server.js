const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = 'your_secret_key';

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/ecommerce', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String
});

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number
});

const cartSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    products: [{ productId: mongoose.Schema.Types.ObjectId, quantity: Number }]
});

const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Cart = mongoose.model('Cart', cartSchema);

app.post('/api/signup', async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    try {
        await user.save();
        res.status(201).send('User created');
    } catch (error) {
        res.status(400).send('Error creating user');
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).send('User not found');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).send('Invalid password');
    }
    const token = jwt.sign({ userId: user._id }, SECRET_KEY);
    res.json({ token });
});

app.get('/api/products', (req, res) => {
    Product.find({}, (err, products) => {
        if (err) return res.status(500).send(err);
        res.json(products);
    });
});

app.post('/api/cart', async (req, res) => {
    const { token, productId, quantity } = req.body;
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const userId = decoded.userId;
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, products: [] });
        }
        const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);
        if (productIndex > -1) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ productId, quantity });
        }
        await cart.save();
        res.send('Product added to cart');
    } catch (error) {
        res.status(400).send('Error adding to cart');
    }
});

app.get('/api/cart', async (req, res) => {
    const { token } = req.query;
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const userId = decoded.userId;
        const cart = await Cart.findOne({ userId }).populate('products.productId');
        res.json(cart);
    } catch (error) {
        res.status(400).send('Error fetching cart');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
