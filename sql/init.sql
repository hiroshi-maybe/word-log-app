
CREATE DATABASE IF NOT EXISTS `word_log`;
USE `word_log`;

CREATE TABLE IF NOT EXISTS `word` (
       id INT AUTO_INCREMENT PRIMARY KEY,
       word VARCHAR(100),
       INDEX `word_idx` (`word`)
) ENGINE=innodb CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `resource` (
       id INT AUTO_INCREMENT PRIMARY KEY,
       name VARCHAR(255),
       INDEX `res_name_idx` (`name`)
) ENGINE=innodb CHARSET=utf8;

CREATE TABLE IF NOT EXISTS `reference` (
       id INT AUTO_INCREMENT PRIMARY KEY,
       word_id INT NOT NULL,
       resource_id INT NOT NULL,
       snippet VARCHAR(1023),
       practice VARCHAR(1023),
       created timestamp DEFAULT CURRENT_TIMESTAMP,
       INDEX `word_ref_idx` (`word_id`),
       INDEX `res_ref_idx` (`resource_id`),
       INDEX `created_idx` (`created`)
) ENGINE=innodb CHARSET=utf8;
