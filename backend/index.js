require('dotenv').config(); // .env 파일을 읽어서 환경 변수에 등록
const apiKey = process.env.apiKey; // apiKey 환경 변수를 불러옴

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
    origin: 'https://healthcat.pages.dev',
    credentials: true,
};
app.use(cors(corsOptions));

//POST 요청 받을 수 있게 만듬
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// POST method route
app.post('/', async function (req, res) {
    let {userMessages, assistantMessages} = req.body
    let todayDateTime = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
    let messages = [
      {role: "system", content: "이제 너는 고양이 말투로 대답한다. 고양이 말투란 '냥', '냐옹' 으로 말의 끝에 붙인다. 당신은 의사이자 물리치료사로서의 의학적 지식을 가지고 있습니다. 우리 몸의 각 관절 부위별로 수술 후 재활 운동단계에 대해서 설명할 수 있습니다."},
      {role: "user", content: "당신은 의사이자 물리치료사로서의 의학적 지식을 가지고 있습니다. 우리 몸의 각 관절 부위별로 수술 후 재활단계에 대해서 설명할 수 있습니다."},
      // {role: "user", content: "수술후 재활단계에 대해서 물어보면 의학적 지식을 바탕으로 재활단계를 주별로 알려주고 마지막에 유튜브 영상을 추천해줘"},
      {role: "assistant", content: "이제 너는 고양이 말투로 대답한다. 고양이 말투란 '냥', '냐옹' 으로 말의 끝에 붙인다. 수술 후 1주 ~ 4주간 얼음찜질을 이용해 열감을 식혀줍니다. 수술 후 4주차에 얼음찜질과 관절운동, 등척성 운동을 진행합니다. 6주차에도 열감이 느껴지면 얼음찜질을 적용합니다. 그리고 관절운동, 등척성 운동을 적극적으로 합니다. 통증이 심하지 않다면 근수축 운동도 진행합니다. 관절 주변 조직이 잘 풀리도록 움직여주는 것이 중요합니다."},
      {role: "user", content: "무릎 수술후 어떻게 관리해야해?"},
      {role: "assistant", content: "이제 너는 고양이 말투로 대답한다. 고양이 말투란 '냥', '냐옹' 으로 말의 끝에 붙인다. 가장 기본적으로 대퇴사두근와 같은 근육을 운동해줘야 합니다. 그리고 엉덩이 근육과 햄스트링 근육을 운동해주어야 합니다."},
    ]

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

    const maxRetries = 3;
    let retries = 0;
    let completion
    console.log("completion:, ",completion)
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
    let fortune = completion.data.choices[0].message['content']

    res.json({"assistant": fortune});
});

module.exports.handler = serverless(app);

// port=3000
// app.listen(port, () => {
//   console.log(`서버가 http://localhost:${port} 에서 실행 중입니다.`);
// });