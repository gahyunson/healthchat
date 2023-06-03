require("dotenv").config();
const mongoUrl = process.env.ATLAS_URI;
const apiKey = process.env.apiKey; 

const { Configuration, OpenAIApi } = require("openai");

const express = require('express')
const app = express()

var cors = require('cors')
const configuration = new Configuration({
    apiKey: apiKey,
  });
const openai = new OpenAIApi(configuration);

//CORS 이슈 해결
let corsOptions = {
    origin: 'https://healthcat.pages.dev',
    // origin: "*",
    credentials: true,
};
app.use(cors(corsOptions));
//POST 요청 받을 수 있게 만듬
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

//mongoDB - Node.js library
const User = require('./models/User');
const mongoose = require('mongoose');

const serverless = require('serverless-http'); //Express 앱을 AWS Lambda 함수로 변환

// POST method route
app.post('/', async function (req, res) {
    // mongoDB
    const newChat = new User();

    let {userMessages, assistantMessages} = req.body
    newChat.question = userMessages.slice(-1)[0]

    //let messages = [{role: "system", content: "당신은 재활 전문가입니다. 당신은 사람들이 몸에 통증을 느끼면 마사지 혹은 운동, 스트레칭 방법을 추천해줍니다. 의사나 물리치료사 수준의 의학적 지식을 가지고 있습니다. 우리 몸의 각 관절 부위별로 수술 후 재활단계에 대해서 설명할 수 있습니다. 아픈 부위에 대해서 마사지 부위 혹은 운동 방법을 알려줍니다. 어떤 움직임을 할 때 통증이 있는 부위에 대해 설명해줍니다. 아픈부위 주위의 근육 운동 혹은 스트레칭 방법을 알려줍니다."}]
    let messages = [{role: "system", content: "You are a helpful rehabilitation counselor. You have the medical knowledge of a doctor or physical therapist. With 30 years of experience, when people ask why they are sick, they can explain medical knowledge in an easy-to-understand way for ordinary people. If someone tells you about pain in a particular joint, tell them the cause and guide you on how to reduce the pain. You have to explain how exactly do about massage or exercise. You have to tell people How can they treatment themself."}]
    /* userMessages : 질문글 , messages : 모든 채팅 내용(system 포함), */

    while (userMessages.length != 0 || assistantMessages.length != 0) {
        if (userMessages.length != 0) {
            messages.push(
                JSON.parse('{"role": "user", "content": "'+String(userMessages.shift()).replace(/\n/g,"")+'"}')
            )
        }
        if (assistantMessages.length != 0) {
            messages.push(
                JSON.parse('{"role": "assistant", "content": "'+String(assistantMessages.shift()).replace(/\n/g,"")+'"}')
            )
        }
    }
    const maxRetries = 1;
    let retries = 0;
    let completion;
    while (retries < maxRetries) {
      try {
        completion = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: messages
        });
        break;
      } catch (error) {
          retries++;
          console.log(error);
          console.log(`Error fetching data, retrying (${retries}/${maxRetries})...`);
      }
    }
    let result = completion.data.choices[0].message.content
    // result -> answer
    assistantMessages.push(result);
    res.json({"assistant": result});

    // if (result.includes("")) 정규표현식 이용한 answer filter
    newChat.answer = result
    newChat.save()
    .then(console.log('User saved Successfully'))
    .catch((err)=>{console.log(err)})
});

async function mongoFunc() {
  await mongoose.connect(mongoUrl);
}

// module.exports.handler = serverless(app);
// module.exports.handler = async (event, context) => {
//   return await serverless(app)(event, context); //Lambda 함수의 핸들러 함수를 정의
// };
const port = 3000;
app.listen(port, () => {
    mongoFunc()
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});