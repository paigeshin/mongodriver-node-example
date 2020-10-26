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
        _db = client.db()
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