const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const {MongoClient} = require('mongodb')

const app = express()
const port = 3000
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}))

const uri = `mongodb+srv://rawatnikhil857:Haruka%402002@cluster0.5lopv10.mongodb.net/SignupDB`;

mongoose.connect(uri)
.then( () => {
    console.log('Connected to the database ')
})
.catch( (err) => {
    console.error(`Error connecting to the database. n${err}`);
})

const signSchema = {
  name: String, 
  phone: String, 
  email: String,
  password: String,
  isStudent: Boolean
}

const signData = mongoose.model("signData", signSchema);
const client = new MongoClient(uri);

app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, '/welcome.html'));
})

app.get('/courses', (req, res)=>{
  res.sendFile(path.join(__dirname, '/courses.html'));
})

app.get('/login', (req, res)=>{
  res.sendFile(path.join(__dirname, '/login.html'));
})



app.post('/login', (req, res) => {
  const client = new MongoClient(uri);
  async function run() {
    try {
      const database = client.db("SignupDB");
      const col = database.collection("signdatas");

      const query =  {email: req.body.ema, password: req.body.password};
      
      const movie = await col.findOne(query);
      // since this method returns the matched document, not a cursor, print it directly
      if(movie == null) res.redirect('/signup')
      else{
        if(movie.isStudent) res.redirect('/studentProfile')
        else res.redirect('/teacherProfile')
      }
    } finally {
      await client.close();
    }
  }
  run().catch(console.dir);
})
app.get('/signup', (req, res)=>{
  res.sendFile(path.join(__dirname, '/signup.html'));
})

app.post('/signup', (req, res)=>{
  let newData = new signData({
    name: req.body.name,
    phone: req.body.number,
    email: req.body.email, 
    password: req.body.password,
    isStudent: true
  })
  newData.save();
  res.redirect('/login');
})
app.get('/discussion', (req, res)=>{
  res.sendFile(path.join(__dirname, '/Discuss.html'));
})

app.get('/signup-teacher', (req, res) => {
  res.sendFile(path.join(__dirname, '/signup-teacher.html'));
})
app.post('/signup-teacher', (req, res)=>{
  let newData = new signData({
    name: req.body.name,
    phone: req.body.number,
    email: req.body.email, 
    password: req.body.password,
    isStudent: false
  })
  newData.save();
  res.redirect('/signup-teacher');
})

app.get('/studentProfile', (req, res) =>{
  res.sendFile(path.join(__dirname, '/studentProfile.html'));
})
app.get('/contact', (req, res) =>{
  res.sendFile(path.join(__dirname, '/contact.html'));
})
// app.get('/teacherProfile', (req, res) =>{
//   res.send("teacher page");
// })
app.listen(port, ()=>{
  console.log('listening');
})