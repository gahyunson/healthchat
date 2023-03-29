const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: "sk-",
});
const openai = new OpenAIApi(configuration);

async function apiCall(){
    const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: "Hello world",
      });
    console.log(completion.data.choices[0].text);
}

apiCall()