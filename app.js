require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

//Models
const User = require("./models/User");

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ msg: "bem vindo a nossa API!" });
});
//register user
app.post("/auth/register", async (req, res) => {
  const { name, email, password, confirmpassword } = req.body;
  //validation
  if (!name) {
    return res.status(422).json({ msg: "O nome é obrigatório!" });
  }
  if (!email) {
    return res.status(422).json({ msg: "O email é obrigatório!" });
  }
  if (!password) {
    return res.status(422).json({ msg: "O password é obrigatório!" });
  }
  if (password !== confirmpassword) {
    return res.status(422).json({ msg: "Confirmar o password" });
  }
  //check if user exists
  const userExists = await User.findOne({ email: email });

  if (userExists) {
    return res.status(422).json({ msg: "por favor utilize outro email" });
  }

  //create passoword
  const salt = await bcrypt.genSalt(12);
  const passowordHash = await bcrypt.hash(password, salt);

  //creat user

  const user = new User({
    name,
    email,
    password: passowordHash,
  });

  try {
    await user.save();
    res.status(201).json({ msg: "usuario criado com sucesso" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "aconteceu um erro" });
  }
});

app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  //validations
  if (!email) {
    return res.status(422).json({
      msg: "o email é obrigatorop",
    });
  }
  if (!password) {
    return res.status(422).json({
      msg: "a senha é obrigatoria",
    });
  }
  //check if user exists
  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(422).json({ msg: "usuario nao encontrado" });
  }

  //check if password match
  const checkPassword = await bcrypt.compare(password, user.password)
  if(!checkPassword){
      return res.status(422).json({msg:'senha invalida'})
  }

  try{
     
    const secret = process.env.SECRET
    const token = jwt.sign({
        id: user._id
    },
        secret,
    )

    res.status(200).json({msg: 'autencaçao realizada com sucesso',token})

  }catch(err){
    console.log(error);
    res.status(500).json({ msg: "aconteceu um erro" });
  }


  

});

app.listen(3000);

//tal caso é ultilizado quando a aplicaçao for full orientada ao banco oq nao tem necessidade.

// mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.tc2ip.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`)
// .then(()=>{
//     console.log('conectou')

// }).catch((err)=>console.log(err))

mongoose
  .connect("mongodb://localhost:27017/User")
  .then(() => {
    console.log("conexao estabelecida com sucesso");
  })
  .catch((error) => {
    console.log(`Erro ao estabelecer conexao:${error}`);
  });
