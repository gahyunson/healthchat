// require("dotenv").config();
// console.log("PORT:",process.env.A);
// var MongoClient = require('mongodb').MongoClient;

// // import dotenv from "dotenv";
// require('dotenv').config();
// var mongoUrl = process.env.ATLAS_URI;

// MongoClient.connect(mongoUrl, function(err, db) {
//   if (err) throw err;
//   console.log("Database created!");
//   db.close();
// });


// app.get('/',(req,res)=>{
//   const newUser = new User();
//   newChat.question = "궁금한거";
//   newChat.answer = "대답한거";
//   newChat.save()
//     .then((user)=>{
//       console.log(user)
//       res.json({message:'User Created Successfully'})
//     })
//     .catch((err)=>{
//       res.json({
//         message:'User was not successfully created'
//       })
//     })
// })