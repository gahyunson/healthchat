require('dotenv').config(); // .env 파일을 읽어서 환경 변수에 등록
const apiKey = process.env.apiKey; // apiKey 환경 변수를 불러옴
const trainMessage = process.env.trainMessange;
const serverless = require('serverless-http');

const { Configuration, OpenAIApi } = require("openai");
const express = require('express')
var cors = require('cors')
const app = express()

const configuration = new Configuration({
    apiKey: apiKey,
  });
const openai = new OpenAIApi(configuration);

//CORS 이슈 해결
let corsOptions = {
    //origin: 'https://healthcat.pages.dev',
    origin: "*",
    credentials: true,
};
app.use(cors(corsOptions));

//POST 요청 받을 수 있게 만듬
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// POST method route
app.post('/', async function (req, res) {
    let {userMessages, assistantMessages} = req.body
    // let todayDateTime = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
    let messages = trainMessage

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
    // console.log("completion:, ",completion)
    while (retries < maxRetries) {
      console.log("while");
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
    console.log(completion);
    let result = completion.data.choices[0].message['content']

    res.json({"assistant": result});
    // console.log(result)
});

module.exports.handler = serverless(app);
// module.exports.handler = async (event, context) => {
//   return await serverless(app)(event, context);
// };
const port = 3000;
app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});