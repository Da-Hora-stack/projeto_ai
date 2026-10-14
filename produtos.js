// MUDANÇA: arquivo routes/produtos.js estava completamente vazio.
// Criadas todas as rotas CRUD para a tabela `produtos`, conectadas ao banco.

const express = require('express');
const router = express.Router();

// MUDANÇA: importado o pool de conexão do db.js para executar as queries
const pool = require('../db');

// -------------------------------------------------------------------
// GET /produtos
// Retorna todos os produtos cadastrados no banco de dados
// -------------------------------------------------------------------
router.get('/', (req, res) => {
    // MUDANÇA: query conectada ao banco real (antes não existia nenhuma query)
    pool.query('SELECT * FROM produtos', (err, results) => {
        if (err) {
            console.error('Erro ao buscar produtos:', err);
            return res.status(500).json({ erro: 'Erro interno ao buscar produtos' });
        }
        res.json(results);
    });
});

// -------------------------------------------------------------------
// GET /produtos/:id
// Retorna um único produto pelo seu ID
// -------------------------------------------------------------------
router.get('/:id', (req, res) => {
    const { id } = req.params;

    // MUDANÇA: uso de prepared statement (?) para evitar SQL Injection
    pool.query('SELECT * FROM produtos WHERE id_produtos = ?', [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar produto:', err);
            return res.status(500).json({ erro: 'Erro interno ao buscar produto' });
        }

        // Retorna 404 se o produto não for encontrado
        if (results.length === 0) {
            return res.status(404).json({ erro: 'Produto não encontrado' });
        }

        res.json(results[0]);
    });
});

// -------------------------------------------------------------------
// POST /produtos
// Insere um novo produto no banco de dados
// Body esperado: { nome, valor, quantidade, categoria }
// -------------------------------------------------------------------
router.post('/', (req, res) => {
    const { nome, valor, quantidade, categoria } = req.body;

    // Validação básica dos campos obrigatórios
    if (!nome || !valor || !quantidade || !categoria) {
        return res.status(400).json({ erro: 'Todos os campos são obrigatórios: nome, valor, quantidade, categoria' });
    }

    // MUDANÇA: prepared statement para inserção segura no banco
    const sql = 'INSERT INTO produtos (nome, valor, quantidade, categoria) VALUES (?, ?, ?, ?)';
    pool.query(sql, [nome, valor, quantidade, categoria], (err, result) => {
        if (err) {
            console.error('Erro ao inserir produto:', err);
            return res.status(500).json({ erro: 'Erro interno ao inserir produto' });
        }

        // Retorna 201 Created com o ID gerado pelo banco
        res.status(201).json({ mensagem: 'Produto criado com sucesso', id: result.insertId });
    });
});

// -------------------------------------------------------------------
// PUT /produtos/:id
// Atualiza um produto existente pelo ID
// Body esperado: { nome, valor, quantidade, categoria }
// -------------------------------------------------------------------
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { nome, valor, quantidade, categoria } = req.body;

    // Validação básica dos campos obrigatórios
    if (!nome || !valor || !quantidade || !categoria) {
        return res.status(400).json({ erro: 'Todos os campos são obrigatórios: nome, valor, quantidade, categoria' });
    }

    // MUDANÇA: prepared statement para atualização segura no banco
    const sql = 'UPDATE produtos SET nome = ?, valor = ?, quantidade = ?, categoria = ? WHERE id_produtos = ?';
    pool.query(sql, [nome, valor, quantidade, categoria, id], (err, result) => {
        if (err) {
            console.error('Erro ao atualizar produto:', err);
            return res.status(500).json({ erro: 'Erro interno ao atualizar produto' });
        }

        // Retorna 404 se nenhuma linha foi afetada (produto não existe)
        if (result.affectedRows === 0) {
            return res.status(404).json({ erro: 'Produto não encontrado' });
        }

        res.json({ mensagem: 'Produto atualizado com sucesso' });
    });
});

// -------------------------------------------------------------------
// DELETE /produtos/:id
// Remove um produto do banco de dados pelo ID
// -------------------------------------------------------------------
router.delete('/:id', (req, res) => {
    const { id } = req.params;

    // MUDANÇA: prepared statement para exclusão segura no banco
    pool.query('DELETE FROM produtos WHERE id_produtos = ?', [id], (err, result) => {
        if (err) {
            console.error('Erro ao deletar produto:', err);
            return res.status(500).json({ erro: 'Erro interno ao deletar produto' });
        }

        // Retorna 404 se nenhuma linha foi afetada (produto não existe)
        if (result.affectedRows === 0) {
            return res.status(404).json({ erro: 'Produto não encontrado' });
        }

        res.json({ mensagem: 'Produto deletado com sucesso' });
    });
});

module.exports = router;
