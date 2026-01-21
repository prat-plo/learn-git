const express = require("express");
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

const uri = process.env.MONGO_URI;
const saltRounds = process.env.SALT_ROUNDS;

const port = 3000;

const app = express();

app.use(bodyParser.json());

//register
app.post("/register", async (req, res) => {
    const { username, password } = req.body;   
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const database = client.db('users');
        const users = database.collection('users');
        const existingUser = await users.findOne({ username: username });
        if (existingUser) {
            return res.status(409).json({ message: "Username already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, parseInt(saltRounds));
        await users.insertOne({ 
            username : username, 
            password : hashedPassword 
        });
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error registering user" });
    } finally {
        await client.close();
    }
});

//login
app.post("/login",  async (req, res) => {
    const { username, password } = req.body;
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const database = client.db('users');
        const users = database.collection('users');
        const user = await users.findOne({ username: username });
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ username: username }, process.env.SECRET_KEY, { expiresIn: '1h' });
            res.status(200).json({ message: "Login successful", token: token });
        } else {
            res.status(401).json({ message: "Invalid username or password" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error logging in" });
    } finally {
        await client.close();
    }
});

//verify token
function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: "No token provided" });
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) return res.status(500).json({ message: "Failed to authenticate token" });
        req.username = decoded.username;
        next();
    });
}

//get all users
app.get("/users", verifyToken, async (req, res) => {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const database = client.db('users');
        const users = database.collection('users');
        const allUsers = await users.find({ }, { projection: { _id: 0, username: 1 } }).toArray();
        res.status(200).json({ message: "Users fetched successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error fetching users" });
    } finally {
        await client.close();
    }
});

app.listen(port, () =>
  console.log(`Server is running on port http://localhost:${port}`));
