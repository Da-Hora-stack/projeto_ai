-- DDL adaptado para o Railway (banco: railway)
-- Não cria schema novo — usa o banco já configurado pelo Railway

CREATE TABLE IF NOT EXISTS `produtos` (
  `id_produtos` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(200) NOT NULL,
  `valor` DECIMAL(10,2) NOT NULL,
  `quantidade` INT NOT NULL,
  `categoria` VARCHAR(200) NOT NULL,
  PRIMARY KEY (`id_produtos`)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `movimentacoes` (
  `id_movientacoes` INT NOT NULL AUTO_INCREMENT,
  `data` DATE NOT NULL,
  `tipo` VARCHAR(10) NOT NULL,
  `quantidade` INT NOT NULL,
  `produtos_id_produtos` INT NOT NULL,
  PRIMARY KEY (`id_movientacoes`, `produtos_id_produtos`),
  INDEX `fk_movientacoes_produtos_idx` (`produtos_id_produtos` ASC),
  CONSTRAINT `fk_movientacoes_produtos`
    FOREIGN KEY (`produtos_id_produtos`)
    REFERENCES `produtos` (`id_produtos`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE = InnoDB;
