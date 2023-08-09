const express = require('express');
const router = express.Router();
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const PRODUCTS_FILE = 'productos.json';

let products = [];

// Middleware para cargar los productos desde el archivo
router.use((req, res, next) => {
  fs.readFile(PRODUCTS_FILE, 'utf-8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Error al cargar los productos' });
    } else {
      products = JSON.parse(data);
      next();
    }
  });
});

// Ruta para listar todos los productos
router.get('/', (req, res) => {
  res.json(products);
});

// Ruta para traer un producto por ID
router.get('/:pid', (req, res) => {
  const productId = req.params.pid;
  const product = products.find((product) => product.id === productId);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado.' });
  }
});

// Ruta para agregar un nuevo producto
router.post('/', (req, res) => {
  const { title, description, code, price, stock } = req.body;

  if (!title || !description || !code || !price || !stock) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  const newProduct = {
    id: uuidv4(),
    title,
    description,
    code,
    price,
    stock,
  };

  products.push(newProduct);

  fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8', (err) => {
    if (err) {
      res.status(500).json({ error: 'Error al guardar el producto.' });
    } else {
      res.status(201).json(newProduct);
    }
  });
});

module.exports = router;
