const express = require('express');
const path = require('path');
const cors = require('cors');

const produtosRoutes = require('./routes/produtos');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Arquivos estáticos (frontend)
app.use(express.static(path.join(__dirname, 'front')));

// Rotas da API
app.use('/produtos', produtosRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Rodando na porta ${PORT}`);
});