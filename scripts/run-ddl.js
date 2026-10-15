// scripts/run-ddl.js
// Executa o DDL.sql no banco usando as variáveis de ambiente do Railway
// Uso: railway run node scripts/run-ddl.js

const mysql = require('mysql2');
const fs    = require('fs');
const path  = require('path');

// Railway MySQL injeta variáveis com prefixo MYSQL (ex: MYSQLHOST).
// Aceita também o formato customizado DB_HOST como fallback.
const host     = process.env.MYSQLHOST     || process.env.DB_HOST;
const user     = process.env.MYSQLUSER     || process.env.DB_USER;
const password = process.env.MYSQLPASSWORD || process.env.DB_PASSWORD;
const database = process.env.MYSQLDATABASE || process.env.DB_NAME;
const port     = process.env.MYSQLPORT     || process.env.DB_PORT || 3306;

// Diagnóstico — mostra o que foi encontrado
console.log('🔍 Variáveis detectadas:');
console.log(`   HOST: ${host}`);
console.log(`   USER: ${user}`);
console.log(`   DB:   ${database}`);
console.log(`   PORT: ${port}`);

if (!host || !user || !database) {
  console.error('❌ Variáveis de ambiente do banco não encontradas!');
  console.error('   Execute: npx railway link → selecione o serviço MySQL');
  process.exit(1);
}

const sqlFile = path.join(__dirname, '..', 'db', 'DDL.sql');
const sql     = fs.readFileSync(sqlFile, 'utf8');

const conn = mysql.createConnection({
  host,
  user,
  password,
  database,
  port: parseInt(port),
  multipleStatements: true, // necessário para rodar vários statements de uma vez
});

console.log(`\nConectando em ${host}:${port}...`);

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
