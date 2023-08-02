const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const PRODUCTS_FILE = './routes/productos.json';

// Middleware para cargar los productos desde el archivo
router.use((req, res, next) => {
  fs.readFile(PRODUCTS_FILE, 'utf-8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Error al cargar los productos' });
    } else {
      req.products = JSON.parse(data);
      next();
    }
  });
});

// Ruta para obtener todos los productos
router.get('/', (req, res) => {
  res.json(req.products);
});

// Ruta para obtener un producto por ID
router.get('/:pid', (req, res) => {
  const productId = req.params.pid;
  const product = req.products.find((product) => product.id === productId);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Producto no encontrado' });
  }
});

// Ruta para agregar un nuevo producto
router.post('/', (req, res) => {
  const { title, description, price, code, stock } = req.body;

  if (!title || !description || !price || !code || !stock) {
    res.status(400).json({ error: 'Todos los campos son obligatorios' });
  } else if (req.products.some((product) => product.code === code)) {
    res.status(409).json({ error: 'El código del producto ya existe' });
  } else {
    const newProduct = {
      id: uuidv4(),
      title,
      description,
      price,
      code,
      stock,
    };

    req.products.push(newProduct);
    saveProductsToFile(req.products);

    res.status(201).json(newProduct);
  }
});

// Función para guardar los productos en el archivo
function saveProductsToFile(products) {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8');
}

module.exports = router;
