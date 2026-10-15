// scripts/run-ddl.js
// Executa o DDL.sql no banco usando as variáveis de ambiente do Railway
// Uso: railway run node scripts/run-ddl.js

const mysql = require('mysql2');
const fs    = require('fs');
const path  = require('path');

const sqlFile = path.join(__dirname, '..', 'db', 'DDL.sql');
const sql     = fs.readFileSync(sqlFile, 'utf8');

const conn = mysql.createConnection({
  host             : process.env.DB_HOST,
  user             : process.env.DB_USER,
  password         : process.env.DB_PASSWORD,
  port             : process.env.DB_PORT || 3306,
  multipleStatements: true,   // necessário para rodar vários statements de uma vez
});

console.log(`Conectando em ${process.env.DB_HOST}:${process.env.DB_PORT}...`);

conn.connect((err) => {
  if (err) {
    console.error('❌ Erro de conexão:', err.message);
    process.exit(1);
  }

  console.log('✅ Conectado! Executando DDL.sql...');

  conn.query(sql, (err) => {
    if (err) {
      console.error('❌ Erro ao executar DDL:', err.message);
      conn.end();
      process.exit(1);
    }

    console.log('✅ DDL executado com sucesso! Tabelas criadas.');
    conn.end();
  });
});
