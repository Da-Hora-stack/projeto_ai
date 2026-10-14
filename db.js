// MUDANÇA: importado o dotenv para carregar as variáveis do arquivo .env
// antes de qualquer coisa, para que process.env já esteja preenchido
require('dotenv').config();

const mysql = require('mysql2');

// MUDANÇA: as credenciais de conexão agora vêm das variáveis de ambiente
// definidas no arquivo .env, em vez de estar escritas diretamente no código.
// Isso evita expor senhas e dados sensíveis no código-fonte.
const pool = mysql.createPool({
    host:     process.env.DB_HOST,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port:     process.env.DB_PORT
});

// Teste de conexão ao iniciar o servidor: verifica se o pool consegue
// obter uma conexão. Se falhar, o erro é logado no console.
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
    } else {
        console.log('Conexão com o banco de dados estabelecida com sucesso!');
        // MUDANÇA: a conexão é liberada de volta ao pool imediatamente
        // após o teste, para não ocupar uma conexão desnecessariamente.
        connection.release();
    }
});

// Exporta o pool para ser usado nas rotas
module.exports = pool;
