require('dotenv').config();
var mongoUrl = process.env.ATLAS_URI;
const express = require('express');
const server = express()
const bodyParser = require('body-parser');
server.use(bodyParser.json());

const User = require('./models/User');
const mongoose = require('mongoose');

const users=[
    {
        id:"gahyun",
        question:"무릎이 아파",
        answer:"어떤 활동 후 아프신가요?"
    },
    {
        id:"son",
        question:"밤만 되면 아파",
        answer:"염증이 발생하는 경우 밤에 통증이 심해질 수 있습니다. 차가운 찜질, 마사지, 휴식을 취하는 것을 권장드립니다."
    }
]
// 순서!
server.get('/users',(req,res)=>{
    res.json(users);
    // const newUser = new User();
    // newUser.question="무릎이 아파";
    // newUser.answer="어떤 활동 후 아프신가요?";
    // newUser.save()
    // .then((user)=>{
    //     console.log(user);
    //     res.json({
    //         message:'User Created Successfully!'
    //     })
    // })
    // .catch((err)=>{
    //     res.json({message:err.toString()})
    // })
})

server.get('/users/:id',(req,res)=>{
    const user = users.find((u)=>{ 
        return u.id===req.params.id;
    })
    if(user){
        res.json(user);
    }else{
        res.status(404).json({errorMessage:'User was not found'});
    }
})

server.post('/users',(req,res)=>{
    // console.log(req.body)
    users.push(req.body);
    res.json(users);
})

//Update - put()
server.put('/users/:id',(req,res)=>{
    let foundIndex = users.findIndex(u=>u.id===req.params.id);
    if(foundIndex===-1){ // 발견되지 않으면 -1 return
        res.status(404).json({errorMessage:'User was not found'})
    }else{
        /// body에 req.body 내용으로 업데이트됨 
        users[foundIndex]={...users[foundIndex],...req.body}
        res.json(users[foundIndex]);
    }
})

server.delete('/users/:id',(req,res)=>{
    let foundIndex = users.findIndex(u=>u.id===req.params.id);
    if(foundIndex===-1){
        res.status(404).json({errorMessage:"User was not found"})
    }else{
        let foundUser = users.splice(foundIndex,1) //foundIndex부터 1칸 지운다
        res.json(foundUser[0])
    }
})


async function main() {
    await mongoose.connect(mongoUrl);
  }

server.listen(3000, (err)=>{
    if(err){
        return console.log(err);
    } else {
        main()
        console.log('Connect!');
    }
});