const express = require('express');
const handlebars = require('express-handlebars');
const http = require('http');
const socketio = require('socket.io');
const productsRouter = require('./routes/products');

const app = express();
const PORT = 8080;

// Configuración de Handlebars como motor de plantillas
app.engine(
  'handlebars',
  handlebars({
    defaultLayout: 'main',
    layoutsDir: `${__dirname}/views/layouts`,
  })
);
app.set('view engine', 'handlebars');

// Rutas para los productos
app.use('/api/products', productsRouter);

// Configurar el servidor HTTP para usar socket.io
const server = http.createServer(app);
const io = socketio(server);

// Manejo de conexiones de socket.io
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado.');

  // Enviar la lista de productos a través del socket
  socket.emit('updateProducts', products);

  // Manejo de eventos cuando se agrega un producto
  socket.on('addProduct', (product) => {
    // Agregar el nuevo producto a la lista de productos
    products.push(product);
    // Emitir la lista actualizada a todos los clientes conectados
    io.emit('updateProducts', products);
  });

  // Manejo de eventos cuando se elimina un producto
  socket.on('deleteProduct', (productId) => {
    // Eliminar el producto de la lista de productos
    products = products.filter((product) => product.id !== productId);
    // Emitir la lista actualizada a todos los clientes conectados
    io.emit('updateProducts', products);
  });
});

// Inicializar el servidor
server.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
