# What's Inside This Module?

- How to translate "Shell Commands" to "Driver Commands"
- Connecting to MongoDB Servers
- CRUD Operations

# Splitting Work between Drivers & Shell

### Shell

- Configure Database
- Create Collections
- Create Indexes

### Driver

- CRUD Operations
- Aggregation Pipelines

# Preparing our Project

### Basic Configuration

- IP Whitelist
- Add User

ex) auto-generated password

rEO8dQhigQSCvv7T

### Basic Commands for the project

- start front-end

```bash
npm start
```

- start node-server

```bash
npm run start:server
```

# Installing the Node.js Driver

- [https://docs.mongodb.com/drivers/](https://docs.mongodb.com/drivers/)

⇒ Mongo DB Drivers

```bash
npm i --save mongodb
```

- Get driver connection code

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/16319ea2-b027-4a09-ba6c-1430777ce3ee/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/16319ea2-b027-4a09-ba6c-1430777ce3ee/Untitled.png)

### App.js

```jsx
//Import Mongo Client
const mongodb = require('mongodb').MongoClient;

//Use MongoDB Constant to connect to MongoDB Server
var uri = 'mongodb+srv://developer:rEO8dQhigQSCvv7T@cluster0.zwpei.mongodb.net/shop?retryWrites=true&w=majority'
mongodb
  .connect(uri)
  .then((client) => {
    console.log('Connected');
    client.close();
  })
  .catch(err => {
    console.log(err);
  });

```

# Create & Read

```jsx
const Router = require('express').Router;
//Import Mongo Client
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
/*** import Decimal 128 for correct double values ***/
const Decimal128 = mongodb.Decimal128; //get Decimal128 to save correct double value into MongoDB

const router = Router();

const products = [
  {
    _id: 'fasdlk1j',
    name: 'Stylish Backpack',
    description:
      'A stylish backpack for the modern women or men. It easily fits all your stuff.',
    price: 79.99,
    image: 'http://localhost:3100/images/product-backpack.jpg'
  },
  {
    _id: 'asdgfs1',
    name: 'Lovely Earrings',
    description:
      "How could a man resist these lovely earrings? Right - he couldn't.",
    price: 129.59,
    image: 'http://localhost:3100/images/product-earrings.jpg'
  },
  {
    _id: 'askjll13',
    name: 'Working MacBook',
    description:
      'Yes, you got that right - this MacBook has the old, working keyboard. Time to get it!',
    price: 1799,
    image: 'http://localhost:3100/images/product-macbook.jpg'
  },
  {
    _id: 'sfhjk1lj21',
    name: 'Red Purse',
    description: 'A red purse. What is special about? It is red!',
    price: 159.89,
    image: 'http://localhost:3100/images/product-purse.jpg'
  },
  {
    _id: 'lkljlkk11',
    name: 'A T-Shirt',
    description:
      'Never be naked again! This T-Shirt can soon be yours. If you find that buy button.',
    price: 39.99,
    image: 'http://localhost:3100/images/product-shirt.jpg'
  },
  {
    _id: 'sajlfjal11',
    name: 'Cheap Watch',
    description: 'It actually is not cheap. But a watch!',
    price: 299.99,
    image: 'http://localhost:3100/images/product-watch.jpg'
  }
];

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
  const uri = 'mongodb+srv://developer:rEO8dQhigQSCvv7T@cluster0.zwpei.mongodb.net/shop?retryWrites=true&w=majority'
  MongoClient
    .connect(uri)
    .then((client) => {
      const products = [];
      client
        .db()
        .collection('products')
        .find() //it returns cursor
        .forEach(productDoc => {
          productDoc.price = productDoc.price.toString();
          products.push(productDoc);
        })
        .then(result => {
          client.close();
          res.status(200).json(products)
        })
        .catch(err => {
          console.log(err);
          client.close();
          res.status(500).json({message: 'An error occurred.'});
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({message: 'An error occurred.'});
    });
});

// Get single product
router.get('/:id', (req, res, next) => {
  const product = products.find(p => p._id === req.params.id);
  res.json(product);
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
  const uri = 'mongodb+srv://developer:rEO8dQhigQSCvv7T@cluster0.zwpei.mongodb.net/shop?retryWrites=true&w=majority'
  MongoClient
    .connect(uri)
    .then((client) => {
      //Create Operation
      client
        .db()
        .collection('products') 
        .insertOne(newProduct)
        .then(result => {
          console.log(result);
          client.close();
          res.status(201).json({message: 'Product added', productId: result.insertedId})
        })
        .catch(err => {
          console.log(err);
          client.close();
          res.status(500).json({message: 'An error occurred.'});
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({message: 'An error occurred.'});
    });
});
// Edit existing product
// Requires logged in user
router.patch('/:id', (req, res, next) => {
  const updatedProduct = {
    name: req.body.name,
    description: req.body.description,
    price: parseFloat(req.body.price), // store this as 128bit decimal in MongoDB
    image: req.body.image
  };
  console.log(updatedProduct);
  res.status(200).json({ message: 'Product updated', productId: 'DUMMY' });
});

// Delete a product
// Requires logged in user
router.delete('/:id', (req, res, next) => {
  res.status(200).json({ message: 'Product deleted' });
});

module.exports = router;
```

# Creating a More Realistic Setup

### Create database file to create global instance

- `database.js`

```jsx
const mongodb = require('mongodb')

const MongoClient = mongodb.MongoClient
const mongoDbUrl = 'mongodb+srv://developer:rEO8dQhigQSCvv7T@cluster0.zwpei.mongodb.net/shop?retryWrites=true&w=majority'

let _db

//callback 
//first argument: error
//second argument: _db instance
const initDb = (callback) => {
    if(_db) {
        console.log('Database is already initialized')
        return callback(null, _db)
    }
    MongoClient.connect(mongoDbUrl)
    .then(client => {
        _db = client
        callback(null, _db)
    })
    .catch(err => {
        callback(err)
    })
}

const getDb = () => {
    if(!_db) {
        throw Error('Database not initialized')
    }
    return _db
}

module.exports = {
    initDb, //key is automatically generated
    getDb
}
```

### on App.js instantiate object

```jsx
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

//Import Database Utility
const db = require('./db');

const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');

const app = express();

app.use(bodyParser.json());
app.use('/images', express.static(path.join('backend/images')));

app.use((req, res, next) => {
  // Set CORS headers so that the React SPA is able to communicate with this server
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,POST,PUT,PATCH,DELETE,OPTIONS'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use('/products', productRoutes);
app.use('/', authRoutes);

db.initDb((err, db) => {
    if(err) {
      console.log(err)
    } else {
      app.listen(3100);      
    }
});
```

### Use db instance on product.js

- product.js

⇒ Limit connections. (Only one connection)

```jsx
const Router = require('express').Router;

//replace const MongoClient = mongodb.MongoClient;
const db = require('../db');

//Import Mongo Client
const mongodb = require('mongodb');

/*** import Decimal 128 for correct double values ***/
const Decimal128 = mongodb.Decimal128; //get Decimal128 to save correct double value into MongoDB

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
      db.close()
      res.status(500).json({message: 'An error occurred.'});
    });
})

// Get single product
router.get('/:id', (req, res, next) => {
  const product = products.find(p => p._id === req.params.id);
  res.json(product);
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
    price: parseFloat(req.body.price), // store this as 128bit decimal in MongoDB
    image: req.body.image
  };
  console.log(updatedProduct);
  res.status(200).json({ message: 'Product updated', productId: 'DUMMY' });
});

// Delete a product
// Requires logged in user
router.delete('/:id', (req, res, next) => {
  res.status(200).json({ message: 'Product deleted' });
});

module.exports = router;
```

### Script

I'm using one and the same connection all the time now and this is actually something which you should do because you'll use a concept called connection pooling which is provided by the mongodb driver here by default.

That means it actually established a couple of connections or at least it's ready to quickly establish them and therefore, you can handle multiple incoming requests to your node restAPI

simultanenuously because you can only send one request per connection to mongodb normally

but since you have a connection pool here of multiple available connections, even if you have multiple incoming connections to nodejs, you can forward them to mongodb thanks to this connection pooling.

# Crud Basic with db instance

```jsx
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
```

# Adding Pagination

```jsx
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
  const queryPage = req.query.page;
  const pageSize = 1;
  
/*** CRUD Operation, Read ***/
//Use MongoDB Constant to connect to MongoDB Server
const products = []

db.getDb()
  .db()
  .collection('products')
  .find() //it returns cursor
  .sort({price: -1})
  .skip((queryPage - 1) * pageSize)
  .limit(pageSize)
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
```

# Adding an Index

- If you sort many times, creating an index is really a great idea.
- You don't create an index on javascript code

```bash
db.products.createIndex({price: 1}) #1일 경우 ascending, -1일 경우 descending
```

# Signing Users Up

```jsx
const Router = require('express').Router;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = require('../db');

const router = Router();

const createToken = () => {
  return jwt.sign({}, 'secret', { expiresIn: '1h' });
};

router.post('/login', (req, res, next) => {
  const email = req.body.email;
  const pw = req.body.password;
  // Check if user login is valid
  // If yes, create token and return it to client
  const token = createToken();
  // res.status(200).json({ token: token, user: { email: 'dummy@dummy.com' } });
  res
    .status(401)
    .json({ message: 'Authentication failed, invalid username or password.' });
});

router.post('/signup', (req, res, next) => {
  const email = req.body.email;
  const pw = req.body.password;
  // Hash password before storing it in database => Encryption at Rest
  bcrypt
    .hash(pw, 12)
    .then(hashedPW => {
      // Store hashedPW in database
      db.getDb()
        .db()
        .collection('users')
        .insertOne({
          email: email,
          password: hashedPW
        })
        .then(result => {
          console.log(result);
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({ message: 'Creating the user failed.' });
        })
      const token = createToken();
      res
        .status(201)
        .json({ token: token, user: { email: 'dummy@dummy.com' } });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Creating the user failed.' });
    });
  // Add user to database
});

module.exports = router;
```

# Adding an Index to Make the Email Unique

```bash
db.users.createIndex({email: 1}, {unique: true})
```

# Adding User Sign In

```jsx
const Router = require('express').Router;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const db = require('../db');

const router = Router();

const createToken = () => {
  return jwt.sign({}, 'secret', { expiresIn: '1h' });
};

router.post('/login', (req, res, next) => {
  const email = req.body.email;
  const pw = req.body.password;
  db.getDb()
    .db()
    .collection('users')
    .findOne({ email: email })
    .then(userDoc => {
      return bcrypt.compare(pw, userDoc.password);
    })
    .then(result => {
      if (!result) {
        throw Error();
      }
      const token = createToken();
      res.status(200).json({
        message: 'Authentication succeeded.',
        token: token
      });
    })
    .catch(err => {
      res.status(401).json({
        message: 'Authentication failed, invalid username or password.'
      });
    });

  // res.status(200).json({ token: token, user: { email: 'dummy@dummy.com' } });
});

router.post('/signup', (req, res, next) => {
  const email = req.body.email;
  const pw = req.body.password;
  // Hash password before storing it in database => Encryption at Rest
  bcrypt
    .hash(pw, 12)
    .then(hashedPW => {
      // Store hashedPW in database
      db.getDb()
        .db()
        .collection('users')
        .insertOne({
          email: email,
          password: hashedPW
        })
        .then(result => {
          console.log(result);
          const token = createToken();
          res.status(201).json({ token: token, user: { email: email } });
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({ message: 'Creating the user failed.' });
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Creating the user failed.' });
    });
  // Add user to database
});

module.exports = router;
```

# Useful Resources & Links

Helpful Articles/ Docs:

- Learn how to build a full RESTful API with Node.js: [https://academind.com/learn/node-js/building-a-restful-api-with/](https://academind.com/learn/node-js/building-a-restful-api-with/)