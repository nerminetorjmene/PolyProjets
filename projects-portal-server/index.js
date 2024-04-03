const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Configuration de la connexion MongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@polyprojets.8ujpysd.mongodb.net/?retryWrites=true&w=majority&appName=polyprojets`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connexion au client MongoDB
    await client.connect();
    console.log("Successfully connected to MongoDB.");

    const db = client.db("mernPolyProjets");
    const projetsCollections = db.collection("demoProjets");

    // Routes
    app.post("/post-projet", async (req, res) => {
      const body = req.body;
      body.createAt = new Date();
      const result = await projetsCollections.insertOne(body);
      if (result.insertedId) {
        return res.status(200).send(result);
      } else {
        return res.status(404).send({
          message: "Cannot insert! Try again later",
          status: false
        });
      }
    });

    //get all projects
    app.get("/all-projects", async (req, res) => {
      const projets = await projetsCollections.find({}).toArray();
      res.send(projets);
    });
    //get single project using id
    app.get("/all-projects/:id", async(req, res) => {
      const id = req.params.id;
      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ message: 'Invalid ID format' });
      }
      const project = await projetsCollections.findOne({
        _id: new ObjectId(id)
      });
      if (!project) {
        return res.status(404).send({ message: 'Project not found' });
      }
      res.send(project)
    })

    // get projects by email 
    app.get("/myProjects/:email", async (req, res) => {
      //console.log(req.params.email);
      const projects = await projetsCollections.find({posterEmail: req.params.email }).toArray();
      res.send(projects)
    });

    // delete  a project
    app.delete("/project/:id", async(req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)}
      const result = await projetsCollections.deleteOne(filter);
      res.send(result)
    })

    // update a project
    app.patch("/update-project/:id", async(req, res) => {
      const id = req.params.id;
      const projectData = req.body;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert: true};
      const updateDoc = {
        $set: {
          ...projectData
        },
      };
      const result = await projetsCollections.updateOne(filter, updateDoc, options);
      res.send(result)
    })

  } catch (error) {
    console.error("An error occurred:", error);
  }
}

run().catch(console.error);

app.get('/', (req, res) => {
  res.send('Hello PolyProjets!');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
