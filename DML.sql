use estoque_db;

INSERT INTO produtos (nome, valor, quantidade, categoria)
VALUES ("banana", 9.99, 20, "frutas"),
("teclado", 103.99, 8, "tecnologia"),
("cadeira gamer", 452.85, 10, "mobilia");

INSERT INTO movimentacoes (data, tipo, quantidade, produtos_id_produtos)
values ("2026-04-11", "entrada", 21, 1),
("2026-04-12", "saida", 21, 1),
("2026-04-13", "entrada", 2, 3);

CREATE VIEW vw_estoque AS
select
    nome, 
    quantidade, 
    valor, 
    categoria,
    (quantidade * valor) 
FROM produtos;

SELECT * FROM movimentacoes;