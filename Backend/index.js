const express = require('express');
const connectToMongo = require('./db');
var cors = require('cors');

connectToMongo();

const app = express()
const port = 8000

app.use(cors());
app.use(express.json());

//Available routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

app.listen(port, () => {
  console.log(`iNotebook app listening on port at http://localhost:${port}`)
})