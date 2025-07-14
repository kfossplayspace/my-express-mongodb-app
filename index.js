// index.js
const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

app.use(express.json());

let db;

async function connectToMongoDB() {
    const uri = "mongodb://localhost:27017"; // Replace with your MongoDB connection string
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    db = client.db('myDatabase'); // Replace 'myDatabase' with your actual database name
    console.log('Connected to MongoDB');
}
connectToMongoDB().catch(console.error);

// Define routes
//http://localhost:3000/
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/items', async (req, res) => {
    try {
        const newItem = req.body;
        const result = await db.collection('items').insertOne(newItem);
        res.status(201).send(result);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/items', async (req, res) => {
    try {
        const items = await db.collection('items').find().toArray();
        res.status(200).json(items);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/items/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const item = await db.collection('items').findOne({ _id: new MongoClient.ObjectID(id) });
        if (item) {
            res.status(200).json(item);
        } else {
            res.status(404).send('Item not found');
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

app.put('/items/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedItem = req.body;
        const result = await db.collection('items').updateOne(
            { _id: new MongoClient.ObjectID(id) },
            { $set: updatedItem }
        );
        if (result.matchedCount > 0) {
            res.status(200).send(result);
        } else {
            res.status(404).send('Item not found');
        }
    } catch (err) {
        res.status(500).send(err);
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});