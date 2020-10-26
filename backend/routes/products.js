const Router = require('express').Router;

//replace const MongoClient = mongodb.MongoClient;
const db = require('../db');

//Import Mongo Client
const mongodb = require('mongodb');

/*** import Decimal 128 for correct double values ***/
const Decimal128 = mongodb.Decimal128; //get Decimal128 to save correct double value into MongoDB
const ObjectId = mongodb.ObjectId;

const router = Router();

// Get list of products products
router.get('/', (req, res, next) => {
  // Return a list of dummy products
  // Later, this data will be fetched from MongoDB
  // const queryPage = req.query.page;
  // const pageSize = 5;
  // let resultProducts = [...products];
  // if (queryPage) {
  //   resultProducts = products.slice(
  //     (queryPage - 1) * pageSize,
  //     queryPage * pageSize
  //   );
  // }

/*** CRUD Operation, Read ***/
//Use MongoDB Constant to connect to MongoDB Server
const products = []

db.getDb()
  .db()
  .collection('products')
  .find() //it returns cursor
  .forEach(productDoc => {
    productDoc.price = productDoc.price.toString();
    products.push(productDoc);
  })
  .then(result => {
    res.status(200).json(products)
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({message: 'An error occurred.'});
  });
})


// Get single product
router.get('/:id', (req, res, next) => {
  db.getDb()
  .db()
  .collection('products')
  .findOne({_id: new ObjectId(req.params.id)})
  .then(productDoc => {
    productDoc.price = productDoc.price.toString();
    res.status(200).json(productDoc);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({message: 'An error occurred.'});
  })

});

// Add new product
// Requires logged in user
router.post('', (req, res, next) => {
  const newProduct = {
    name: req.body.name,
    description: req.body.description,
    price: Decimal128.fromString(req.body.price.toString()), // store this as 128bit decimal in MongoDB
    // price: req.body.price,
    image: req.body.image
  };
  console.log(newProduct);
  /*** CRUD Operation, CREATE ***/
  //Use MongoDB Constant to connect to MongoDB Server
    db.getDb()
        .db()
        .collection('products')
        .insertOne(newProduct)
        .then(result => {
          console.log(result);
          res.status(201).json({message: 'Product added', productId: result.insertedId})
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({message: 'An error occurred.'});
        });
    })

// Edit existing product
// Requires logged in user
router.patch('/:id', (req, res, next) => {
  const updatedProduct = {
    name: req.body.name,
    description: req.body.description,
    price: Decimal128.fromString(req.body.price.toString()), // store this as 128bit decimal in MongoDB
    image: req.body.image
  };
  db.getDb()
    .db()
    .collection('products')
    .updateOne({_id: new ObjectId(req.params.id)}, {$set: updatedProduct})
    .then(productDoc => {
      console.log(productDoc);
      res.status(200).json({ message: 'Product updated', productId: productDoc.id });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({message: 'An error occurred.'});
    })

  
});

// Delete a product
// Requires logged in user
router.delete('/:id', (req, res, next) => {
  db.getDb()
    .db()
    .collection('products')
    .deleteOne({_id: new ObjectId(req.params.id)})
    .then(result => {
      console.log(result)
      res.status(200).json({ message: 'Product deleted' })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({message: 'An error occurred.'});
    });
});

module.exports = router;
