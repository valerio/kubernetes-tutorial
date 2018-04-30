const express = require('express');
const app = express();

app.get('/api', (req, res) => {
    res
        .status(200)
        .json("Hello World");
});

app.use('/', express.static('public'));

app.listen(8080, () => console.log('Hello world app is listening on port 8080.'));