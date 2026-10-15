-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema estoque_db
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `estoque_db` ;

-- -----------------------------------------------------
-- Schema estoque_db
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `estoque_db` DEFAULT CHARACTER SET utf8 ;
USE `estoque_db` ;

-- -----------------------------------------------------
-- Table `estoque_db`.`produtos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `estoque_db`.`produtos` (
  `id_produtos` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(200) NOT NULL,
  `valor` DECIMAL NOT NULL,
  `quantidade` INT NOT NULL,
  `categoria` VARCHAR(200) NOT NULL,
  PRIMARY KEY (`id_produtos`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `estoque_db`.`movientacoes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `estoque_db`.`movimentacoes` (
  `id_movientacoes` INT NOT NULL AUTO_INCREMENT,
  `data` DATE NOT NULL,
  `tipo` VARCHAR(10) NOT NULL,
  `quantidade` INT NOT NULL,
  `produtos_id_produtos` INT NOT NULL,
  PRIMARY KEY (`id_movientacoes`, `produtos_id_produtos`),
  INDEX `fk_movientacoes_produtos_idx` (`produtos_id_produtos` ASC) VISIBLE,
  CONSTRAINT `fk_movientacoes_produtos`
    FOREIGN KEY (`produtos_id_produtos`)
    REFERENCES `estoque_db`.`produtos` (`id_produtos`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
