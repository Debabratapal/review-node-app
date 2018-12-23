const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

const productRoutes = require('./routes/product');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}));

app.use( '/images',express.static(path.join(__dirname, 'images')))

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET POST PATCH PUT DELETE');
        return res.status(200).json({});
    }
    next();
});

app.use('/api', productRoutes)


mongoose
.connect(`mongodb+srv://hobbits:lnZYgSESfKw0mdJZ@cluster0-ufn7r.mongodb.net/hobbits?retryWrites=true`)
.then(result => {
    app.listen(3001, () => {
        console.log("app is up at 3001");
        
    });
})
.catch(err => {
    console.log(err);
})
