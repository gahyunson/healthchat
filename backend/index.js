// chat gpt api 
// import
const { Configuration, OpenAIApi } = require("openai"); 
// web server 구축 
const express = require('express')
var cors = require('cors')
const app = express()

const configuration = new Configuration({
  apiKey: "sk-", //gitignore 사용 
});
const openai = new OpenAIApi(configuration);

async function apiCall(){
    const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    max_tokens : 250, 
    temperature : 0.5, 
    messages: [
        {role: "system", content: "당신은 의사이자 물리치료사로서의 의학적 지식을 가지고 있습니다. 우리 몸의 각 관절 부위별로 수술 후 재활단계에 대해서 설명할 수 있습니다."},
        {role: "user", content: "당신은 의사이자 물리치료사로서의 의학적 지식을 가지고 있습니다. 우리 몸의 각 관절 부위별로 수술 후 재활단계에 대해서 설명할 수 있습니다."},
        // {role: "user", content: "수술후 재활단계에 대해서 물어보면 의학적 지식을 바탕으로 재활단계를 주별로 알려주고 마지막에 유튜브 영상을 추천해줘"},
        {role: "assistant", content: "수술 후 1주 ~ 4주간 얼음찜질을 이용해 열감을 식혀줍니다. 수술 후 4주차에 얼음찜질과 관절운동, 등척성 운동을 진행합니다. 6주차에도 열감이 느껴지면 얼음찜질을 적용합니다. 그리고 관절운동, 등척성 운동을 적극적으로 합니다. 통증이 심하지 않다면 근수축 운동도 진행합니다. 관절 주변 조직이 잘 풀리도록 움직여주는 것이 중요합니다."},
        {role: "user", content: "무릎 수술후 어떻게 관리해야해?"},
],
});
// console.log(completion.data.choices[0].message);
console.log(completion.data.choices[0].message['content']);
}
apiCall()




// cors 아무데서나 요청오는 것을 방지. 어디서 요청온지 확인해준다.
//cors issue 해결 
let corsOptions = {
    origin: 'https://www.domain.com',
    credentials: true
}

app.use(cors(corsOptions));

// post 요청을 받을 수 있는 부분 
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// POST method route
app.post('/', function (req, res) {
    res.send('POST request to the homepage');
  });

app.listen(3000)