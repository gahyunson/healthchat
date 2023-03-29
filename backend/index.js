const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: "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",
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