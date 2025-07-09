import express from 'express';
import cors from 'cors'
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const app = express();
const Port : number = 5000;
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/users/register', async (req, res) => {
    try{
        const userdata : {username : string, email : string , password : string} = req.body;
        const hashedPassword = await bcrypt.hash(userdata.password, 10);
        const newuser = await prisma.user.create({
            data: { ...userdata, password: hashedPassword }
        });
    
        res.status(201).json(newuser);

    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'An error occurred while creating the user.' });
    }
});

app.get('/users', async (req, res) => {
    try {
        prisma.getUsers = await prisma.user.findMany();
        res.status(200).json(prisma.getUsers);
    }
    catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'An error occurred while fetching users.' });
    }
});

app.get('/users/checkuser/:email', async (req, res) => {
    const { email } = req.params;
    prisma.getUser = await prisma.user.findUnique({where: {email: email}});
    if (prisma.getUser) {
        return res.status(200).json({ exists: true });
    } else {
        return res.status(404).json({ exists: false });
    }
});

app.listen(Port, () => {
    console.log(`Server is running on http://localhost:${Port}`);
    console.log(`Press Ctrl+C to stop the server`);
});
