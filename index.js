// Suggested code may be subject to a license. Learn more: ~LicenseLog:4046355364.
// Suggested code may be subject to a license. Learn more: ~LicenseLog:2361083615.
// Suggested code may be subject to a license. Learn more: ~LicenseLog:595309245.
// Suggested code may be subject to a license. Learn more: ~LicenseLog:3329504100.
// Suggested code may be subject to a license. Learn more: ~LicenseLog:3204777713.
// Suggested code may be subject to a license. Learn more: ~LicenseLog:2724988342.
import dotenv from 'dotenv';
import express from 'express';
import { MongoClient } from 'mongodb';
import { ObjectId } from 'mongodb';

dotenv.config();

const app = express();

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error('MONGO_URI environment variable not set');
}

const client = new MongoClient(mongoUri);

async function run() {
  await client.connect();
  console.log('Connected successfully to mongodb');
}
run().catch(console.dir);


app.use(express.json());

app.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).send('Name, email, and password are required');
    }
    const db = client.db('proffesinal_coach2');
    const usersCollection = db.collection('users');
    const result = await usersCollection.insertOne({ name, email, password });
    res.status(201).json({message: "User Created Successfully", userId:result.insertedId})
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).send('Error creating user');
  }
});

app.get('/', (req, res) => {
  const name = process.env.NAME || 'World';
  res.send(`Hello ${name}!`);
});
const port = parseInt(process.env.PORT) || 3000;
app.listen(port, () => { console.log(`listening on port ${port}`); });