//TODO: MAKE SURE EVERY SPEECH OBJECT IS SAVED TO THE SESSION, SO THAT THE REPEAT FUNCTION WORKS PROPERLY.
//MAKE SURE TO CONSOLE.LOG EVERY INTENT HANDLER FUNCTION.

const Alexa = require("ask-sdk-core");
const https = require("https");
const Airtable = require("airtable");
const dashbot = require("dashbot")(process.env.dashbot_key).alexa;

var IsFirstVisit = true;

const categories = [{"name": "Art & Stage", "id": "recl0vhIOs1iSyXAu", "speechName": "art and stage", "referenceName": "art_and_stage"},
                    {"name": "Business World", "id": "recAJm9yEqDRGmjRr", "speechName": "business world", "referenceName": "business_world"},
                    {"name": "Film", "id": "recdMJliTRpWYcj41", "speechName": "film", "referenceName": "film"},
                    {"name": "Food & Drink", "id": "reclySZR1cRRl08jz", "speechName": "food and drink", "referenceName": "food_and_drink"},
                    {"name": "Geography", "id": "recXXedb9nOqy1Fkk", "speechName": "geography", "referenceName": "geography"},
                    {"name": "History", "id": "rec6fDO7E7lXC2xe3", "speechName": "history", "referenceName": "history"},
                    {"name": "Language", "id": "recnhcldrp4o6QwFr", "speechName": "language", "referenceName": "language"},
                    {"name": "Literature", "id": "recsy6jdhmIig1YSB", "speechName": "literature", "referenceName": "literature"},
                    {"name": "Miscellaneous", "id": "recTeqmLykygSz9gF", "speechName": "miscellaneous", "referenceName": "miscellaneous"},
                    {"name": "Music", "id": "recdZhe6oq5wn1ksw", "speechName": "music", "referenceName": "music"},
                    {"name": "Nature", "id": "recSKFke58Sfd9vWi", "speechName": "nature", "referenceName": "nature"},
                    {"name": "People", "id": "recto6ILGOAYkOl8a", "speechName": "people", "referenceName": "people"},
                    {"name": "Politics", "id": "rechKWhUV28LSeiRW", "speechName": "politics", "referenceName": "politics"},
                    {"name": "Sports & Games", "id": "recr8BC0GYJVwjt1k", "speechName": "sports and games", "referenceName": "sports_and_games"},
                    {"name": "Science", "id": "recKqrOdwpk5hezpL", "speechName": "science", "referenceName": "science"},
                    {"name": "Technology", "id": "recG6oDVjpFNGrnO2", "speechName": "technology", "referenceName": "technology"},
                    {"name": "United States", "id": "recRiC3PAYQHmMEvC", "speechName": "united states", "referenceName": "united_states"},
                    {"name": "Tradition & Beliefs", "id": "recKh6vjk2KQLGEm7", "speechName": "tradition and beliefs", "referenceName": "tradition_and_beliefs"},
                    {"name": "TV & Radio", "id": "recab6u8fMDf63S3k", "speechName": "tv and radio", "referenceName": "tv_and_radio"}];

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        console.log("CANHANDLE - LaunchRequestHandler");
        return Alexa.getRequestType(handlerInput.requestEnvelope) === "LaunchRequest";
    },
    async handle(handlerInput) {
        console.log("HANDLED - LaunchRequestHandler");
        console.log("IS FIRST VISIT = " + IsFirstVisit);
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        var speechText = "";

        const locale = handlerInput.requestEnvelope.request.locale;
        var welcome = await getRandomResponse("Welcome", locale);

        //IF THIS IS THEIR FIRST TIME USING THE SKILL, START THEM WITH A QUESTION.
        if (IsFirstVisit) {
            console.log("THIS IS THE USER'S FIRST VISIT TO THE SKILL.  EVER.")
            var category = getRandomCategory();
            var question = await getRandomQuestion(category);
            sessionAttributes.currentQuestion = question.fields;
            return await askTriviaQuestion(handlerInput, category, question, 1, welcome.fields.VoiceResponse);
        }
        else
        {
            speechText = welcome.fields.VoiceResponse + "<break time='.5s'/>You've been here before.";
        }
        
        //TODO: IF THEY HAVE USED THE SKILL BEFORE, ASK THEM WHAT THEY WANT TO DO.

        //TODO: IF THEY WERE IN THE MIDDLE OF A GAME, RESUME THE GAME.

        sessionAttributes.currentSpeak = speechText;
        sessionAttributes.currentReprompt = speechText;
        
        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

const AnswerIntentHandler = {
    canHandle(handlerInput) {
        console.log("CANHANDLE - AnswerIntentHandler");
        return Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest"
            && Alexa.getIntentName(handlerInput.requestEnvelope) === "AnswerIntent";
    },
    handle(handlerInput) {
        console.log("HANDLED - AnswerIntentHandler");
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        var speechText = "This is the Answer Intent.";


        //TODO: DID WE ASK THE USER A QUESTION?
        if (sessionAttributes.currentQuestion != undefined) {

            //TODO: IF THE USER GOT THE ANSWER CORRECT.
            if (isAnswerCorrect(handlerInput)) {
                speechText = "You got that one right!  Woo hoo!";
            }
            else{
                speechText = "You got that wrong.  You're not a good person.";
            }

                //TODO: WAS IT A SOLO QUESTION?

                //TODO: WAS IT PART OF A GAME?

            //TODO: IF THE USER GOT THE ANSWER INCORRECT.

                //TODO: WAS IT A SOLO QUESTION?

                //TODO: WAS IT PART OF A GAME?
        }
        //TODO: WE DIDN'T ASK THE USER A QUESTION.  WE SHOULD BE CONFUSED.
        else {
            speechText = "You just said " + handlerInput.requestEnvelope.request.intent.slots.answer.value + " to me.  I think you're fishing for the answers to questions, and that's not allowed.  Stop breaking the rules.";
        }
        
        sessionAttributes.currentSpeak = speechText;
        sessionAttributes.currentReprompt = speechText;

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

const StartGameIntentHandler = {
    canHandle(handlerInput) {
        console.log("CANHANDLE - StartGameIntentHandler");
        return Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest"
            && Alexa.getIntentName(handlerInput.requestEnvelope) === "StartGameIntent";
    },
    handle(handlerInput) {
        console.log("HANDLED - StartGameIntentHandler");
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        //TODO: IS THE USER IN A GAME?

        var speechText = "This is the Start Game Intent.";

        sessionAttributes.currentSpeak = speechText;
        sessionAttributes.currentReprompt = speechText;

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

const ContinueGameIntentHandler = {
    canHandle(handlerInput) {
        console.log("CANHANDLE - ContinueGameIntentHandler");
        return Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest"
            && Alexa.getIntentName(handlerInput.requestEnvelope) === "ContinueGameIntent";
    },
    handle(handlerInput) {
        console.log("HANDLED - ContinueGameIntentHandler");
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        //TODO: IS THE USER IN A GAME?

        var speechText = "This is the Continue Game Intent.";

        sessionAttributes.currentSpeak = speechText;
        sessionAttributes.currentReprompt = speechText;

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

const QuestionIntentHandler = {
    canHandle(handlerInput) {
        console.log("CANHANDLE - QuestionIntentHandler");
        return Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest"
            && Alexa.getIntentName(handlerInput.requestEnvelope) === "QuestionIntent";
    },
    async handle(handlerInput) {
        console.log("HANDLED - QuestionIntentHandler");
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        //TODO: IS THE USER IN A GAME?
        //TODO: DETERMINE IF THE USER INDICATED A SPECIFIC CATEGORY TO USE.
        var category = getRandomCategory();
        //var question = await getRandomQuestion(category);
        var question = await getSpecificQuestion("recEBGY7blzeW0UAp");
        sessionAttributes.currentQuestion = question.fields;
        return await askTriviaQuestion(handlerInput, category, question);
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        console.log("CANHANDLE - HelpIntentHandler");
        return Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest"
            && Alexa.getIntentName(handlerInput.requestEnvelope) === "AMAZON.HelpIntent";
    },
    handle(handlerInput) {
        console.log("HANDLED - HelpIntentHandler");
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        var speechText = "This is the Help Intent.";

        sessionAttributes.currentSpeak = speechText;
        sessionAttributes.currentReprompt = speechText;

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        console.log("CANHANDLE - CancelAndStopIntentHandler");
        return Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest"
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === "AMAZON.CancelIntent"
                || Alexa.getIntentName(handlerInput.requestEnvelope) === "AMAZON.StopIntent");
    },
    async handle(handlerInput) {
        console.log("HANDLED - CancelAndStopIntentHandler");
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const locale = handlerInput.requestEnvelope.request.locale;
        
        var goodbye = await getRandomResponse("Goodbye", locale);
        var speechText = goodbye.fields.VoiceResponse;

        sessionAttributes.currentSpeak = speechText;

        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};

//TODO: IF A USER IS ASKING TO REPEAT A QUESTION MORE THAN ONCE DURING A GAME, WE REFUSE.
const RepeatIntentHandler = {
    canHandle(handlerInput) {
        console.log("CANHANDLE - RepeatIntentHandler");
        return handlerInput.requestEnvelope.request.type === "IntentRequest" &&
               handlerInput.requestEnvelope.request.intent.name === "AMAZON.RepeatIntent";
    },
    async handle(handlerInput) {
        console.log("HANDLED - RepeatIntentHandler");
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        var speechText = "";
        if (sessionAttributes.currentSpeak != undefined) { speechText = sessionAttributes.currentSpeak; }
        else speechText = "I haven't said anything yet. I can't repeat myself, silly. What do you want to do next?";

        return handlerInput.responseBuilder
               .speak(speechText)
               .reprompt(speechText)
               .getResponse();
    },
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        console.log("CANHANDLE - SessionEndedRequestHandler");
        return Alexa.getRequestType(handlerInput.requestEnvelope) === "SessionEndedRequest";
    },
    handle(handlerInput) {
        console.log("HANDLED - SessionEndedRequestHandler");
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse();
    }
};

// The intent reflector is used for interaction model testing and debugging.
// It will simply repeat the intent the user said. You can create custom handlers
// for your intents by defining them above, then also adding them to the request
// handler chain below.
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest";
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);

        var speechText = "This is the Intent Reflector.  You just triggered " + intentName;

        sessionAttributes.currentSpeak = speechText;
        sessionAttributes.currentReprompt = speechText;

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};

// Generic error handling to capture any syntax or routing errors. If you receive an error
// stating the request handler chain is not found, you have not implemented a handler for
// the intent being invoked or included it in the skill builder below.
const ErrorHandler = {
    canHandle() {
        return true;
    },
    async handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.stack}`);
        const locale = handlerInput.requestEnvelope.request.locale;
        
        var error = await getRandomResponse("Error", locale);
        var speechText = error.fields.VoiceResponse;

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .getResponse();
    }
};


async function askTriviaQuestion(handlerInput, category, question, ordinal = 0, speech = "") {
    console.log("ASKING TRIVIA QUESTION.")
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    const locale = handlerInput.requestEnvelope.request.locale;
    var ordinalSpeech = "";
    if (ordinal > 0) ordinalSpeech = "<say-as interpret-as='ordinal'>" + ordinal + "</say-as> ";

    var speechText = speech + "<break time='.5s'/>Here's your " + ordinalSpeech + "question, from the " + category.speechName + " category.<audio src='https://s3.amazonaws.com/tko-trivia/audio/" + category.referenceName + ".mp3' /><break time='.25s'/>" + question.fields.VoiceQuestion;

    sessionAttributes.currentSpeak = speechText;
    sessionAttributes.currentReprompt = speechText;

    var synonyms = question.fields.Synonyms.split(", ");

    let entityDirective = {
        type: "Dialog.UpdateDynamicEntities",
        updateBehavior: "REPLACE",
        types: [
          {
            name: "Answer",
            values: [
              {
                id: question.fields.RecordId,
                name: {
                  value: question.fields.ScreenAnswer,
                  synonyms: synonyms
                }
              }
            ]
          }
        ]
      };
        
    //TODO: ADD SCREEN DESIGN ELEMENTS FOR DEVICES WITH DISPLAYS
    return handlerInput.responseBuilder
        .speak(speechText)
        .reprompt(speechText)
        .withStandardCard(category.name, question.fields.CardQuestion, "https://tko-trivia.s3.amazonaws.com/art/ISPs/" + category.referenceName + "_108.png", "https://tko-trivia.s3.amazonaws.com/art/ISPs/" + category.referenceName + "_512.png")
        .addDirective(entityDirective)
        .getResponse();
}

async function getRandomQuestion(category) {
    const response = await httpGet(process.env.airtable_base_data, "&filterByFormula=AND(IsDisabled%3DFALSE(),Category%3D%22" + encodeURIComponent(category.name) + "%22)", "Question");
    const question = getRandomItem(response.records);
    console.log("RANDOM QUESTION = " + JSON.stringify(question));
    return question;
}

async function getSpecificQuestion(recordId) {
    const response = await httpGet(process.env.airtable_base_data, "&filterByFormula=AND(IsDisabled%3DFALSE(),RecordId%3D%22" + encodeURIComponent(recordId) + "%22)", "Question");
    const question = getRandomItem(response.records);
    console.log("SPECIFIC QUESTION = " + JSON.stringify(question));
    return question;
}

async function getRandomResponse(type, locale) {
    console.log("GETTING RANDOM RESPONSE TYPE = " + type);
    const result = await httpGet(process.env.airtable_base_speech, "&filterByFormula=AND(IsDisabled%3DFALSE(),Locale%3D%22" + encodeURIComponent(locale) + "%22)", type);
    const response = getRandomItem(result.records);
    console.log("RANDOM RESPONSE (" + type + ") = " + JSON.stringify(response));
    return response;
}

function getRandomCategory() {
	return getRandomItem(categories);
}

function getRandomItem(items) {
    var random = getRandom(0, items.length-1);
    return items[random];
}

function getRandom(min, max){
    return Math.floor(Math.random() * (max-min+1)+min);
}

function isAnswerCorrect(handlerInput){
    if (((handlerInput.requestEnvelope) && (handlerInput.requestEnvelope.session) && (handlerInput.requestEnvelope.session.attributes) && (handlerInput.requestEnvelope.session.attributes.currentQuestion) && (handlerInput.requestEnvelope.session.attributes.currentQuestion.RecordId))
    && ((handlerInput.requestEnvelope.request) && (handlerInput.requestEnvelope.request.intent) && (handlerInput.requestEnvelope.request.intent.slots) && (handlerInput.requestEnvelope.request.intent.slots.answer) && (handlerInput.requestEnvelope.request.intent.slots.answer.resolutions) && (handlerInput.requestEnvelope.request.intent.slots.answer.resolutions.resolutionsPerAuthority[0]) && (handlerInput.requestEnvelope.request.intent.slots.answer.resolutions.resolutionsPerAuthority[0].values[0]) && (handlerInput.requestEnvelope.request.intent.slots.answer.resolutions.resolutionsPerAuthority[0].values[0].value) && (handlerInput.requestEnvelope.request.intent.slots.answer.resolutions.resolutionsPerAuthority[0].values[0].value.id))
    && (handlerInput.requestEnvelope.session.attributes.currentQuestion.RecordId ===  handlerInput.requestEnvelope.request.intent.slots.answer.resolutions.resolutionsPerAuthority[0].values[0].value.id)) return true;

    return false;
}

async function GetUserRecord(userId) {
  console.log("GETTING USER RECORD")
  var filter = "&filterByFormula=%7BUserId%7D%3D%22" + encodeURIComponent(userId) + "%22";
  const userRecord = await httpGet(process.env.airtable_base_data, filter, "User");
  //IF THERE ISN"T A USER RECORD, CREATE ONE.
  if (userRecord.records.length === 0){
    console.log("CREATING NEW USER RECORD");
    IsFirstVisit = true;
    var airtable = await new Airtable({apiKey: process.env.airtable_key}).base(process.env.airtable_base_data);
    return new Promise((resolve, reject) => {
        airtable("User").create({"UserId": userId}, 
                    function(err, record) {
                            console.log("NEW USER RECORD = " + JSON.stringify(record));
                            if (err) { console.error(err); return; }
                            resolve(record);
                        });
                    });
  }
  else{
    console.log("RETURNING FOUND USER RECORD = " + JSON.stringify(userRecord.records[0]));
    IsFirstVisit = false;
    return await userRecord.records[0];
  }
}

function httpGet(base, filter, table = "Data"){
    //console.log("IN HTTP GET");
    //console.log("BASE = " + base);
    //console.log("FILTER = " + filter);
    
    var options = {
        host: "api.airtable.com",
        port: 443,
        path: "/v0/" + base + "/" + table + "?api_key=" + process.env.airtable_key + filter,
        method: "GET",
    };
    
    return new Promise(((resolve, reject) => {
      const request = https.request(options, (response) => {
        response.setEncoding("utf8");
        let returnData = "";
  
        if (response.statusCode < 200 || response.statusCode >= 300) {
          return reject(new Error(`${response.statusCode}: ${response.req.getHeader("host")} ${response.req.path}`));
        }
        console.log("FULL PATH = http://" + options.host + options.path);
        //console.log("HTTPS REQUEST OPTIONS = " + JSON.stringify(options));
  
        response.on("data", (chunk) => {
          returnData += chunk;
        });
  
        response.on("end", () => {
          resolve(JSON.parse(returnData));
        });
  
        response.on("error", (error) => {
          reject(error);
        });
      });
      request.end();
    }));
  }

const RequestLog = {
    async process(handlerInput) {
      console.log("REQUEST ENVELOPE = " + JSON.stringify(handlerInput.requestEnvelope));
      var userRecord = await GetUserRecord(handlerInput.requestEnvelope.session.user.userId);
      await console.log("USER RECORD = " + JSON.stringify(userRecord.fields));
      UserRecord = userRecord.fields;
      if (handlerInput.requestEnvelope.request.type != "SessionEndedRequest") {
        //await IncrementInteractionCount();
        //await IncrementSessionCount(handlerInput);
        //CheckForAchievements(handlerInput);
      }
      return;
    }
  };
  
  const ResponseLog = {
    process(handlerInput) {
      console.log("RESPONSE BUILDER = " + JSON.stringify(handlerInput.responseBuilder.getResponse()));   
    }
  };

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = dashbot.handler(skillBuilder
    .addRequestHandlers(
        LaunchRequestHandler,
        AnswerIntentHandler,
        StartGameIntentHandler,
        ContinueGameIntentHandler,
        QuestionIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        RepeatIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
        ) 
    .addErrorHandlers(ErrorHandler)
    .addRequestInterceptors(RequestLog)
    .addResponseInterceptors(ResponseLog)
    .withApiClient(new Alexa.DefaultApiClient())
    .lambda());
