/**
 * Simion Cristian
 */

const express = require('express');
const path = require('path');

const app = express();


// Load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
    let dumps = [
        {
            id: 1,
            title: "Hello world",
            author: "johnsmith",
            path: "hello_world.c"
        },
        {
            id: 2,
            title: "Sort array",
            author: "Qsorter",
            path: "sort_array.c"
        }
    ];
    res.render('index', {
        title: "My files",
        dumps
    });
});

app.get('/dumps/add', (req, res) => {
    res.render('add_dump', {
        title: 'Add Dump'
    });
});

// Start server
app.listen(3000, () => {
    console.log("Server started on port 3000...");
})