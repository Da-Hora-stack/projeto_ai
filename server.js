const app = require('./app');
const dotenv = require('dotenv');
dotenv.config();

// MUDANÇA: a porta agora lê da variável de ambiente PORT definida no .env.
// O valor 3000 é mantido como fallback caso a variável não esteja definida.
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
