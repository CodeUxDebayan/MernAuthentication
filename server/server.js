const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const Person = require('./Models.js');
const cors = require('cors');
const router = express.Router();
const mongoSanitize = require('mongo-sanitize');
const session = require('express-session');
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Connect to the MongoDB database
mongoose.connect('mongodb://127.0.0.1:27017/authentication', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
},
(err) => {
  if (err) {
  console.log('Error connecting to MongoDB server');
  } else {
  console.log('Successfully connected to MongoDB server');
  }
  });

app.use(cors());
app.use(bodyParser.json());


app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false
}));


// Define the routes
router.post('/signup', async (req, res) => {
  
  const pass = mongoSanitize(req.body.password);
  // Check if the email is already in use
  const user = await Person.findOne({ email: req.body.email });
  if (user) return res.status(400).send({ error: 'Email already in use' });
  console.log("Email in use");

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(pass, salt);

  const name  =  mongoSanitize(req.body.name);
  const email =  mongoSanitize(req.body.email);
  
  req.session.user = user;
  const sessionId = req.session.id;

  // Create a new user
  const newperson = new Person({
    name: name,
    email: email,
    password: hashedPassword,
  });
  await newperson.save();
  
  try{
  const token = jwt.sign({ sessionId }, process.env.JWT_SECRET, { expiresIn: 3600 });
  res.json({ token });
} catch (err) {
  res.status(500).json({ message: err.message });
}
})

  
router.post('/login', async (req, res) => {
   // Find the user by email
   const user = await Person.findOne({ email: req.body.email });
  
   if (!user) return res.status(400).send({ error: 'Email or password is invalid' });
   if (!user){
    console.log("email is invalid");}
    else{console.log("email is correct");}
   // Check if the password is correct
   const isMatch = await bcrypt.compare(req.body.password, user.password);
   
   if (!isMatch) return res.status(400).send({ error: 'Email or password is invalid' });
   if (!isMatch){
   console.log("password is invalid");}
   else{console.log("password is correct");}
 
   // Create a new session
   req.session.user = user;
   // Generate a session ID
   const sessionID = req.session.id;
 
   // Generate a JWT that includes the session ID
   try {
     const token = jwt.sign({ sessionID }, 'secret', { expiresIn: '1h' });
     res.json({ token });
     console.log(token);
   } catch (err) {
     res.status(500).json({ message: err.message });
     console.log("No token");
   }
 });

// const authenticate = (req, res, next) => {
//   try {
//     // Get the token from the headers
//     const token = req.headers.authorization.split(" ")[1];
    
//     // Verify the token
//     const decoded = jwt.verify(token, "secret_key");
//     req.userData = decoded;
//     next();
 
//   } catch (err) {
//     return res.status(401).json({ message: "Auth failed" });
//   }
// };

// router.get("/profile", authenticate, (req, res) => {
//   // The authenticated user's information is available on req.userData
//   res.json({ message: "Profile", user: req.userData });
// });

app.use("/", router);

// Start the server
app.listen(port, () => {
  console.log('Server listening on port' + " " + port);
});
