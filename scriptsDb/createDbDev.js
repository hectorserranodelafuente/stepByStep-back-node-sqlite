const sqlite3 = require('sqlite3').verbose();
const path = require('path')

// Crear o abrir la base de datos
let db = new sqlite3.Database(path.join(__dirname,'..','/db/dev/sqlite/dbLoginDev.sqlite'), (err) => {
  if (err) {
    console.error('Error al abrir la base de datos:', err.message);
  } else {
    console.log('Base de datos creada/abierta exitosamente.');
  }
});


// Crear la tabla 'productos'
db.run(` CREATE TABLE users (
    email    TEXT    PRIMARY KEY,
    name     TEXT,
    password TEXT,
    twoFA    INTEGER DEFAULT (0),
    addition TEXT,
    typeTwoFA TEXT,
    phoneNumber TEXT
)`, (err) => {
  if (err) {
    console.error('Error al crear la tabla users:', err.message);
  } else {
    console.log('Tabla "users" creada exitosamente.');
  }
});

// Crear la tabla 'usuarios'
db.run(`CREATE TABLE twoFA (
    tokenTwoFASession TEXT    PRIMARY KEY,
    code              TEXT,
    try               INTEGER,
    finished          INTEGER DEFAULT (0),
    email             TEXT,
    startTiming       INTEGER,
    endTiming         INTEGER,
    confirmed         INTEGER DEFAULT (0),
    finishReason      TEXT
)`, (err) => {
  if (err) {
    console.error('Error al crear la tabla twoFA:', err.message);
  } else {
    console.log('Tabla "usuarios" creada exitosamente.');
  }
});


db.run(`CREATE TABLE session (
  tokenSession       TEXT    PRIMARY KEY,
  email              TEXT,
  startTiming        INTEGER,
  endTiming          INTEGER,
  noRenewSession     INTEGER,
  startTimingRenewal INTEGER,
  endTimingRenewal   INTEGER,
  finished           INTEGER
)`, (err) => {
if (err) {
  console.error('Error al crear la tabla session:', err.message);
} else {
  console.log('Tabla "usuarios" creada exitosamente.');
}
});


db.run(`
  CREATE TABLE preUsers (
  email         TEXT    NOT NULL,
  tokenPreUsers TEXT    NOT NULL,
  name          TEXT    NOT NULL,
  password      TEXT    NOT NULL,
  twoFA         INTEGER NOT NULL
                        DEFAULT (0),
  startTiming   NUMERIC NOT NULL,
  endTiming     NUMERIC NOT NULL,
  confirmed     INTEGER NOT NULL
                        DEFAULT (0),
  addition      TEXT    NOT NULL
                        DEFAULT "",
  finished      INTEGER DEFAULT (0),
  typeTwoFA TEXT,
  phoneNumber TEXT 
)`, (err) => {
if (err) {
  console.error('Error al crear la tabla preUsers:', err.message);
} else {
  console.log('Tabla "usuarios" creada exitosamente.');
}
});


db.run(`CREATE TABLE changePassword (
    tokenChangePasswordSession TEXT    NOT NULL,
    email                      TEXT    REFERENCES users (email) 
                                       NOT NULL,
    startTiming                NUMERIC NOT NULL,
    endTiming                  NUMERIC NOT NULL,
    newPassword                TEXT    NOT NULL,
    confirmed                  INTEGER NOT NULL
                                       DEFAULT (0),
    addition                   TEXT    NOT NULL
                                       DEFAULT "",
    finished                   NUMERIC,
    twoFA                      INTEGER
)`, (err) => {
if (err) {
  console.error('Error al crear la tabla changePassword:', err.message);
} else {
  console.log('Tabla "usuarios" creada exitosamente.');
}
});




// Cerrar la base de datos
db.close((err) => {
  if (err) {
    console.error('Error al cerrar la base de datos:', err.message);
  } else {
    console.log('Base de datos cerrada exitosamente.');
  }
});
