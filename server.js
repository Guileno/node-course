/* jshint esversion: 6 */

// Imports
const express = require('express');
const hbs = require('hbs');
const filesystem = require('fs');

// App configurations
let app = express();
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
hbs.registerPartials(__dirname + '/views/partials');

// Register Middlewares
app.use((req,res,next) => {
    let now = new Date().toString();
    let log = `${now} : ${req.method} ${req.path}`;
    filesystem.appendFile(__dirname + '/server.log', log + '\n', (err) => {
        if (err) console.log('Unable  to access to server.log');
    }); 
    console.log(log);
    next();
});
app.use((req,res,next) => {
    let textfile = filesystem.readFileSync(__dirname + '/server-info.json', 'utf8');
    let serverinfo = JSON.parse(textfile);
    if(serverinfo.maintenance === true) {
        res.render('maintenance.hbs');
    }
    else next();
});
app.use(express.static(__dirname + '/public'));

// App inits
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});
hbs.registerHelper('upperCase', (text) => {
    return text.toUpperCase();
});

app.get('/', (req, res) => {
    res.render('home.hbs', { title: "Homepage Title" });
});

app.get('/about', (req, res) => {
    res.render('about.hbs');    
});


let port = 3000;
app.listen(port, () => {
    console.log("Server is up on port " + port);
});
