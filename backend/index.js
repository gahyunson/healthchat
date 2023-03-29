// chat gpt api 
// import
const { Configuration, OpenAIApi } = require("openai"); 

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

],
});
// console.log(completion.data.choices[0].message);
console.log(completion.data.choices[0].message['content']);
}
apiCall()

// web server 구축 
const express = require('express')
var cors = require('cors')
const app = express()


// cors 아무데서나 요청오는 것을 방지. 어디서 요청온지 확인해준다.
//cors issue 해결 
let corsOptions = {
    origin: 'https://www.domain.com',
    credentials: true
}

app.use(cors(corsOptions));

// post 요청을 받을 수 있는 부분 
app.use(express.json())
app.use(express.urlencoded({ extended: true })) 

// POST method route
app.post('/', function (req, res) {
    res.send('POST request to the homepage');
  });

app.listen(3000)