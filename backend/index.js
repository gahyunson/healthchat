const backConfig = require('./config.js');
const apiKey = backConfig.apiKey;
const promptmessage = backConfig.promptmessage;
const serverless = require('serverless-http'); //Express 앱을 AWS Lambda 함수로 변환

const { Configuration, OpenAIApi } = require("openai");
const express = require('express')
var cors = require('cors')
const app = express()

const configuration = new Configuration({
    apiKey: apiKey,
    promptmessage: promptmessage
  });
const openai = new OpenAIApi(configuration);

//CORS 이슈 해결
let corsOptions = {
    // origin: 'https://healthcat.pages.dev',
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
    let messages = promptmessage

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
    //   console.log("while");
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
    // console.log(completion);
    let result = completion.data.choices[0].message.content
    // assistantMessages.push(result);
    console.log("result:",result);
    // console.log("assistantMessages:",assistantMessages);
    res.json({"assistant": result});
});

// module.exports.handler = serverless(app);
// module.exports.handler = async (event, context) => {
//   return await serverless(app)(event, context); //Lambda 함수의 핸들러 함수를 정의
// };
const port = 3000;
app.listen(port, () => {
    console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
});