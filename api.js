const express = require('express')
const app = express()
const mongoose = require('mongoose')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "lkashfksldjflkj";
const cors = require('cors');
const PORT=3001
//  app.use(express.json())
app.use(cors({
  origin: '*'
})


);

app.use(express.json());



app.listen(PORT, () => {
  console.log("I am listening to port ", PORT);
})


const User = require("./models/User");
const Todo = require("./models/todoModel");


mongoose.connect(
  "mongodb+srv://aayusha:CZIZrAf1e3CV0TTX@cluster0.jditwt3.mongodb.net/MERN?retryWrites=true&w=majority"

)

mongoose.connection.on("connected", () => {
  console.log("connected to mongoose");
});


mongoose.connection.on("error", (error) => {

  console.log(error);

})


const requireLogin = (req, res, next) => {
  const { authorization } = req.headers; //user have to send token in header field
  console.log("auth", authorization, "req", req.headers);
  try {
    if (!authorization) {
      return res.status(401).json({
        error: "you must be logged in",
      });
    }
    //extract(decrypt) the userId from jwt token using the same "JWT_SECRET" key
    const { userId } = jwt.verify(authorization, JWT_SECRET);
    //If the authorization token is correct then only jwt.verify method returns the userId,
    //otherwise error will be handled in the catch block
    req.user = userId;
    next();
  }
   catch (error) {
    return res.status(401).json({
      error: "You must be logged in",
    });
  }
};

// for signup
app.post("/signup", async (req, res) => {  console.log(req.body, "request body")
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(422).json({
        // error: "please enter all the fields",
      });
    }
    const user = await User.findOne({ email });
    console.log(user);
    if (user) {
      return res.status(422).json({
        error: "User already exists with that email",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 12);

    //save to database


    await new User({
      email,
      password: hashedPassword,
    }).save();

    res.status(200).json({
      message: "signup Success",
    });
  } catch (error) {
    console.log(error);
  }
});



//for login or sign in

app.post("/signin", async (req, res) => {
  console.log(req.body)
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(422).json({
        error: "please enter all the fields",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    //checking password

    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ userId: user._id }, JWT_SECRET);
      res.status(201).json({
        token,
        message: "logged in",
      });
    }
    return res.status(401).json({
      message: "invalid password or email",
    });
  } catch (error) {
    console.log(error);
  }
});



app.get('/todo', async (req, res) => {

  try {
    const todoRes = await Todo.find()
    res.status(200).json({
      data: todoRes
    })

  } catch (error) {
    res.status(404).json({
      message: error.message
    })
  }

})


app.post('/todo', async (req, res) => {
  const { title, brief } = req.body

  try {
    const todoRes = await new Todo({
      title,
      brief
    }).save()

    res.status(200).json({
      data: todoRes
    })

  } catch (error) {
    res.status(422).json({
      message: error.message
    })
  }

})






app.put("/update-todo/:id", async (req, res) => {
  await Todo.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true });
  return res.status(201).json({
    message: "updated"
  })
});

app.delete("/delete-todo/:id", async (req, res) => {
  const deletedTodo = await Todo.findOneAndRemove({ _id: req.params.id });
  return res.status(200).json({
    message: deletedTodo,
  });
});


// app.get('/',(req,res)=>{
//     res.send('nepal')

// })


// app.post('endpoint',(req,res)=>{


// })


// app.put('endpoint',(req,res)=>{


// })


// app.delete('endpoint',(req,res)=>{

// })





// //  method:'get','post','put'
// //  FileSystem



// // function SUM(a,b){
// //     console.log(a+b)
// // }


// // SUM(4,5)


// const Todo = require('./models/todoModel')
// cfc-bznx-rih