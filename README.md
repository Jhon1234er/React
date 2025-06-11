CREATE DATABASE ap_db;

CREATE TABLE usuarios (
  id_usuario INT PRIMARY KEY,
  usuario VARCHAR(50) NOT NULL,
  nombre VARCHAR(50) NOT NULL,
  apellido VARCHAR(50) NOT NULL,
  correo VARCHAR(100) NOT NULL,
  password VARCHAR(100) NOT NULL,
  id_tipo INT NOT NULL DEFAULT 3
);
