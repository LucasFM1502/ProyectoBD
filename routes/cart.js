const express = require('express');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const CARTS_FILE = './routes/carrito.json';

// Middleware para cargar los carritos desde el archivo
router.use((req, res, next) => {
  fs.readFile(CARTS_FILE, 'utf-8', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Error al cargar los carritos' });
    } else {
      req.carts = JSON.parse(data);
      next();
    }
  });
});

// Ruta para crear un nuevo carrito
router.post('/', (req, res) => {
  const newCart = {
    id: uuidv4(),
    products: [],
  };

  req.carts.push(newCart);
  saveCartsToFile(req.carts);

  res.status(201).json(newCart);
});

// Función para guardar los carritos en el archivo
function saveCartsToFile(carts) {
  fs.writeFileSync(CARTS_FILE, JSON.stringify(carts, null, 2), 'utf-8');
}

// Ruta para obtener los productos de un carrito por ID
router.get('/:cid', (req, res) => {
  const cartId = req.params.cid;
  const cart = req.carts.find((cart) => cart.id === cartId);

  if (cart) {
    res.json(cart.products);
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});

// Ruta para agregar un producto a un carrito por ID
router.post('/:cid/product/:pid', (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;

  const cart = req.carts.find((cart) => cart.id === cartId);
  const product = req.products.find((product) => product.id === productId);

  if (!cart || !product) {
    res.status(404).json({ error: 'Carrito o producto no encontrado' });
  } else {
    const existingProduct = cart.products.find((item) => item.product === productId);

    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      cart.products.push({ product: productId, quantity: 1 });
    }

    saveCartsToFile(req.carts);
    res.status(201).json(cart.products);
  }
});

module.exports = router;
