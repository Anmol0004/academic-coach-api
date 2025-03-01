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

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send('Email and password are required');
    }

    const db = client.db('proffesinal_coach2');
    const usersCollection = db.collection('users');
    const user = await usersCollection.findOne({ email, password });

    if (!user) {
      return res.status(401).send('Invalid email or password');
    }

    res.status(200).json({ message: 'Login successful', userId: user._id });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Error during login');
  }
});


//chat routes
app.post('/chat', async (req, res) => {
  try {
    const { chatSessionId, chatName, role, content } = req.body;
    if (!chatSessionId || !role || !content) {
      return res.status(400).send('chatSessionId, role, and content are required');
    }
    const db = client.db('proffesinal_coach2');
    const chatCollection = db.collection('chat');
    const result = await chatCollection.insertOne({ chatSessionId, chatName, role, content });
    res.status(201).json({ message: 'Message stored successfully', messageId: result.insertedId });
  } catch (error) {
    console.error('Error storing message:', error);
    res.status(500).send('Error storing message');
  }
});

app.get('/chat/:chatSessionId', async (req, res) => {
  try {
    const chatSessionId = req.params.chatSessionId;
    const db = client.db('proffesinal_coach2');
    const chatCollection = db.collection('chat');
    const chatMessages = await chatCollection.find({ chatSessionId }).toArray();
    res.status(200).json(chatMessages);
  } catch (error) {
    console.error('Error retrieving chat messages:', error);
    res.status(500).send('Error retrieving chat messages');
  }
});


app.delete('/chat/:chatSessionId', async (req, res) => {
  try {
    const chatSessionId = req.params.chatSessionId;
    const db = client.db('proffesinal_coach2');
    const chatCollection = db.collection('chat');
    const deleteResult = await chatCollection.deleteMany({ chatSessionId });

    if (deleteResult.deletedCount > 0) {
      res.status(200).json({ message: 'All messages with chatSessionId deleted successfully' });
    } else {
      res.status(404).json({ message: 'No messages found with the given chatSessionId' });
    }
  } catch (error) {
    console.error('Error deleting chat messages:', error);
    res.status(500).send('Error deleting chat messages');
  }
});


app.get('/', (req, res) => {
  const name = process.env.NAME || 'World';
  res.send(`Hello ${name}!`);
});
const port = parseInt(process.env.PORT) || 3000;
app.listen(port, () => { console.log(`listening on port ${port}`); });