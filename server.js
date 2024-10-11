const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

mongoose.connect('mongodb://localhost:27017/ecommerce', { useNewUrlParser: true, useUnifiedTopology: true });

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number
});

const Product = mongoose.model('Product', productSchema);

app.get('/api/products', (req, res) => {
    Product.find({}, (err, products) => {
        if (err) return res.status(500).send(err);
        res.json(products);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
