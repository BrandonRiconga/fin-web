const express = require('express');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/', require('./router'));

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = app;