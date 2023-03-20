const express = require('express');
const mysql = require('mysql');
const config = {
  host: 'db',
  user: 'root',
  password: 'root',
  database: 'appdb'
}
async function query(sql) {
  const connection = mysql.createConnection(config);

  const queryPromise = new Promise((resolve, reject) => {
    connection.query(sql, (err, results) => {
      if (err) {
        reject(err);
      } else {
      resolve(results);
      }
    });
    })

  const results = await queryPromise;

  connection.end();

  return results;
}

async function init() {
  const app = express();
  const port = 3000;

  await query(`
  CREATE TABLE IF NOT EXISTS people (
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    PRIMARY KEY(id)
  )
`);

  await query(`DELETE FROM people where 1=1`);
  await query(`INSERT INTO people(name) values('Rafael')`);
  await query(`INSERT INTO people(name) values('Felipe')`);
  await query(`INSERT INTO people(name) values('João')`);

  const people = await query(`SELECT * FROM people`);

  app.get('/', (req, res) => {
    const html = `
      <h1>Full Cycle Rocks!</h1>
      <ul>
        ${people.map(person => `<li>${person.name}</li>`).join('')}
      </ul>
      `;

    res.send(html);
  });

  app.listen(port, () => {
    console.log('Server running on port 3000');
  });
}

init()

