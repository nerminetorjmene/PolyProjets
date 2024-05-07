const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const admin = require('firebase-admin');
const multer = require('multer');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Configuration de MongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@polyprojets.8ujpysd.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
const serviceAccount = require('./firebase-admin-config.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
//Multer est un middleware pour Express et Node.js qui facilite la gestion des données de formulaire multipart/form-data, utilisées principalement pour le téléchargement de fichiers. Lorsque vous créez des applications Web qui incluent des formulaires permettant aux utilisateurs de télécharger des fichiers, multer peut s'avérer extrêmement utile
// Configure multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') 
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

app.post('/upload-cv', upload.single('file'), (req, res) => {
  console.log('Fichier reçu :', req.file);
  console.log('Email reçu :', req.body.email);
  res.json({ message: 'CV téléchargé avec succès !' });
});

// Import Firebase config
const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore } = require('firebase-admin/firestore');


const firebaseAuth = getAuth();
const firestore = getFirestore();

// Middleware pour vérifier le rôle de l'utilisateur
const checkUserRole = (requiredRoles) => async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1]; // Bearer token parsing
  if (!token) {
    return res.status(401).send('Access Denied: No Token Provided!');
  }

  try {
    const decodedToken = await firebaseAuth.verifyIdToken(token);
    const userRoles = decodedToken.role; // Assurez-vous que les rôles sont bien définis dans les claims du token
    const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));

    if (hasRequiredRole) {
      req.user = decodedToken;
      next();
    } else {
      res.status(403).json({ message: "Accès refusé" });
    }
  } catch (error) {
    res.status(403).json({ message: "Invalid token", error: error.message });
  }
};

async function run() {
  try {
    await client.connect();
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
    app.post("/subscribe", async (req, res) => {
      const { email } = req.body;
    
      if (!email) {
        return res.status(400).json({ message: 'L\'email est requis.' });
      }
    
      try {
        // Connexion à la base de données si elle n'est pas déjà établie
        await client.connect();
    
        // Accès à la base de données et à la collection appropriée
        const db = client.db("mernPolyProjets");
        const subscribersCollection = db.collection("subscribers");
    
        // Vérification si l'email existe déjà dans la base de données
        const existingSubscriber = await subscribersCollection.findOne({ email: email });
        if (existingSubscriber) {
          return res.status(409).json({ message: 'Cet email est déjà inscrit à la newsletter.' });
        }
    
        // Insertion du nouvel abonné dans la base de données
        const result = await subscribersCollection.insertOne({ email: email, subscribedAt: new Date() });
        if (result.insertedId) {
          res.status(200).json({ message: 'Inscription réussie à la newsletter !' });
        } else {
          res.status(500).json({ message: 'Erreur lors de l\'enregistrement de l\'abonné.' });
        }
      } catch (error) {
        console.error('Error subscribing:', error);
        res.status(500).json({ message: 'Erreur lors de l\'inscription', error: error.message });
      } finally {
        // Assurez-vous de fermer la connexion à la base de données
        await client.close();
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
      res.send(project);
    });

    // get projects by email 
    app.get("/myProjects/:email", async (req, res) => {
      //console.log(req.params.email);
      const projects = await projetsCollections.find({posterEmail: req.params.email }).toArray();
      res.send(projects);
    });
// delete a project
app.delete("/project/:id", async(req, res) => {
  try {
      const id = req.params.id;
      
      // Supprimez l'élément de la base de données
      const result = await projetsCollections.deleteOne({ _id: new ObjectId(id) });
      
      if (result.deletedCount === 1) {
          // L'élément a été supprimé avec succès
          res.json({ acknowledged: true, message: "L'élément a été supprimé avec succès." });
      } else {
          // Aucun élément n'a été supprimé (peut-être que l'ID n'existe pas)
          res.status(404).json({ acknowledged: false, message: "Aucun élément trouvé avec cet ID." });
      }
  } catch (error) {
      // Erreur lors de la suppression
      res.status(500).json({ acknowledged: false, error: error.message });
  }
});


    // update a project
    app.patch("/update-project/:id", async(req, res) => {
      const id = req.params.id;
      const projectData = req.body;
      const filter = {_id: new ObjectId(id)};
      const options = {upsert: true};
      const updateDoc = {
        $set: {
          ...projectData
        },
      };
      const result = await projetsCollections.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    // route pour l'envoie de candidature 
    app.post("/apply-project/:id", async (req, res) => {
      const id = req.params.id;
      const { applicationUrl } = req.body;

      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ message: 'Invalid ID format' });
      }

      try {
        const filter = { _id: new ObjectId(id) };
        const updateDoc = {
          $push: {
            applications: { url: applicationUrl, createdAt: new Date() }
          }
        };

        const result = await projetsCollections.updateOne(filter, updateDoc);
        
        if (result.modifiedCount === 1) {
          return res.status(200).send({ message: 'Application sent successfully!' });
        } else {
          return res.status(404).send({ message: 'Project not found or could not update' });
        }
      } catch (error) {
        return res.status(500).send({ message: 'Error sending application', error });
      }
    });

    const getUserById = async (userId) => {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        return userSnap.data();
      } else {
        return null;
      }
    };

  } catch (error) {
    console.error("An error occurred:", error);
  }
}

run().catch(console.error);

/*app.get('/', (req, res) => {
  res.send('Hello PolyProjets!');
});*/

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
