const express = require('express');
require('dotenv').config()
const bodyParser = require('body-parser');
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rcctt.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });
const app = express();

app.use(bodyParser.json());
app.use(cors());
const port = 5000
//
     console.log(process.env.DB_Name + process.env.DB_PASS + process.env.DB_User);

 client.connect(err => {
  const productsCollection = client.db(`${process.env.DB_NAME}`).collection("products");

  const ordersCollection = client.db(`${process.env.DB_NAME}`).collection("orders");
  
  //
    app.post('/addProduct', (req, res) => {
        const products = req.body;
        console.log(products);
        productsCollection.insertOne(products)
        .then(result => {
            res.send(result.insertedCount)
        })
    })
    
//
    app.get('/products', (req, res) => {
        productsCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })
//
    app.get('/product/:key', (req, res) => {
        productsCollection.find({key: req.params.key})
        .toArray((err, documents) => { 
            res.send(documents[0]);
        })
    })
//
//
    app.post('/productByKeys', (req, res) => {
        const productKeys = req.body;
        productsCollection.find({key: {$in: productKeys}})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })
//
  //
  app.post('/addOrder', (req, res) => {
    const order = req.body;
    console.log(order);
    ordersCollection.insertOne(order)
    .then(result => {
        res.send(result.insertedCount > 0)
    })
})
  //

});

//

app.listen(process.env.PORT || port)