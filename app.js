require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const app = express()

const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASSWORD

//Models
const User = require('./models/User')

app.use(express.json())


app.get('/',(req,res)=>{
    res.status(200).json({msg:'bem vindo a nossa API!'})
})
//register user
app.post('/auth/register', async(req,res)=>{
    const {name,email,password,confirmpassword} = req.body
    //validation
    if(!name){
        return res.status(422).json({msg:"O nome é obrigatório!"})
    }
    if(!email){
        return res.status(422).json({msg:"O email é obrigatório!"})
    }
    if(!password){
        return res.status(422).json({msg:"O password é obrigatório!"})
    }
})


//tal caso é ultilizado quando a aplicaçao for full orientada ao banco oq nao tem necessidade.

mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.tc2ip.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`)
.then(()=>{
    console.log('conectou')
    
}).catch((err)=>console.log(err))

app.listen(3000)

