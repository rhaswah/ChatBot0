// See https://github.com/dialogflow/dialogflow-fulfillment-nodejs
// for Dialogflow fulfillment library docs, samples, and to report issues
'use strict';

//Make sure to add axios to dependencies in package.json, as well
//as listing it here in consts
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const axios = require('axios');


process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));
 
  function welcome(agent) {
    agent.add(`Welcome to my agent!`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }
 
  //Within this function make vars for username, balance
  //Need url outside for other function
  //Extract parameters, prep url 
  var url = 'https://sheetdb.io/api/v1/ol8sgoou1yv5e';
  function rempto(agent) {
    //I already made the entity curbal and params User, Balance
    var username = agent.parameters.User;
    var sum_of_balance = agent.parameters.Balance;
    //need logical statement for if user matches name then 
    //return specific balance.
    //Now call to the api url 
    return readpto(url).then(response =>{
    var bot_response = "You have accumulated" + 
        sum_of_balance + "hours of PTO remaining";
      //we can convert to days later.
    console.log(bot_response);
    agent.add(bot_response);
  });}
 
  //This function calls to actual API
  function readpto(agent)
  { return axios.get(url);
  }

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  // intentMap.set('your intent name here', yourFunctionHandler);
  // intentMap.set('your intent name here', googleAssistantHandler);
  agent.handleRequest(intentMap);
  //First intent to provide users current accumulated pto 
  intentMap.set('RemainingPTO', rempto);
  
});
