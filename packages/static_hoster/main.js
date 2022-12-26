const express = require('express');
const app = express();
const port = 4200;
const path = require('path');

app.use(express.static(path.join(__dirname, '..', '/frontend')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '/frontend/index.html'));
})

app.listen(port, () => {
    console.log(`You-Need static hoster listening on port: ${port}`)
})