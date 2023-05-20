const config = require('./config.js');
const apiKey = config.apiKey;
const promptmessage = config.promptmessage;

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: apiKey,
  promptmessage: promptmessage
});
const openai = new OpenAIApi(configuration);

const messages = [{role:'user',
                   content:'Tell me How can I setting prompt.'}];
                  //  Let me know How I can treatment my knee after surgery.
const doIt = async () => {
  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages
    });
    // console.log("1:",completion.data);
    console.log(completion.data.choices[0].message.content);
 
  } catch (error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
    }
  }
}
 
doIt();

let test;
let i=0;
while(i<3){
  i++;
  test = 1;
}
console.log(test);



// async()=>{
//   const response = await openai.createCompletion({
//     model: "gpt-3.5-turbo",
//     prompt: promptmessage,
//     temperature: 0,
//     max_tokens: 7,
//   });
//   const completion_text = completion.data.choices[0].message;
//   console.log(completion_text);
// }



// async function generateText(input) {
//   try {
//     const response = await openai.createCompletion({
//       model: "text-davinci-003",
//       prompt: promptmessage,
//       temperature: 0.5,
//       max_tokens: 50,
//     });

//     return response;
//   } catch (error) {
//     console.error("Error:", error);
//     throw new Error('Failed to generate text');
//   }
// }

// const inputText = "Tell me how I can treat my knee";
// generateText(inputText)
//   .then((response) => {
//     console.log("Response:", response);
//   })
//   .catch((error) => {
//     console.error("Error:", error);
//   });
