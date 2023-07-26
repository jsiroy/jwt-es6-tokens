require('dotenv').config();
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

app.use(express.json())

const userAccess = [
    {
        username: 'Kyle',
        role: 'Admin'
    },
    {
        username: 'Jim',
        role: 'Supervisor'
    },
    {
        username: 'Joe',
        role: 'Processor'
    }
]

app.get('/user-access', authenticateToken, (req,res) => {
   res.json(userAccess.filter(user => user.username === req.user.name))
})

app.post('/login',(req,res) => {
   /// authencticate the user 
   const userName = req.body.username;
   const validateUser = userAccess.find( user => user.username === userName );
       console.log(validateUser);
       if(validateUser){
       const user = { name: userName }
       console.log(user);
       const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
       res.json({ accessToken: accessToken })
       }else{ 
        console.log('ACCESS DENIED: User not found');
       return res.sendStatus(401).json({ error: 'User not found' })
       }
})

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token =  authHeader && authHeader.split(' ')[1]
    console.log(token);
    if(token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err)return res.sendStatus(403)
        req.user = user
        next()
    })
}

app.listen(3000)