const express = require('express');
const app = express();
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())

/***
 * MongoDB info
 * userName: saifularafat21
 * password: gCjXW8yPWx3OgGQD
*/

const uri = "mongodb+srv://saifularafat21:gCjXW8yPWx3OgGQD@cluster0.guqonkt.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // const database = client.db("usersDB"); //2 line ke ek line a convert 
    // const userCollection = database.collection("users");
    const userCollection = client.db("usersDB").collection('users'); //1. ek line 

    //READ MANY 
    app.get('/users', async(req, res) => {
        const cursor = userCollection.find(); //find() mane holo sob gula data lagbe..
        const result = await cursor.toArray(); //array the convert korce
        res.send(result);
    })

    //Update to client server url create function 
    app.get('/users/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const user = await userCollection.findOne(query);
        res.send(user);
    })

    //update mongodb database server
    app.put('/users/:id', async(req, res) => {
        const id = req.params.id;
        const user = req.body;
        console.log(user);

        const filter = { _id: new ObjectId(id)};
        const options = { upsert: true };
        const updateUser = {
            $set:{
                name: user.name,
                email: user.email,
                password: user.password
            }
        };
        const result = await userCollection.updateOne(filter, updateUser, options);
        res.send(result)
    })

    //mongodb user info added
    app.post('/users', async(req, res) => {
        const user = req.body;
        console.log('new user', user)
        const result = await userCollection.insertOne(user);
        res.send(result)

    })

    //mongodb user delete function
    app.delete('/users/:id', async(req, res) => {
        const id = req.params.id;
        console.log('id delete by database', id)
        const query = {_id:new ObjectId(id)} //_id from mongodb database (_id)
        const result = await userCollection.deleteOne(query);
        res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('Simple Crud MongoDB')
})

app.listen(port, () => {
    console.log(`simple crud server port, ${port}`);
})