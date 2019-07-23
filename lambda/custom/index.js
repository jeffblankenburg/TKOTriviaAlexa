const Alexa = require('ask-sdk-core');
const https = require('https');
const Airtable = require('airtable');
const dashbot = require('dashbot')(process.env.dashbot_key).alexa;

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        //TODO: IF THIS IS THEIR FIRST TIME USING THE SKILL, START THEM WITH A QUESTION.

        //TODO: IF THEY HAVE USED THE SKILL BEFORE, ASK THEM WHAT THEY WANT TO DO.

        //TODO: IF THEY WERE IN THE MIDDLE OF A GAME, RESUME THE GAME.
        
        const speakOutput = 'This is the Launch Request.';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const AnswerIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AnswerIntent';
    },
    handle(handlerInput) {
        //TODO: DID WE ASK THE USER A QUESTION?
        
            //TODO: IF THE USER GOT THE ANSWER CORRECT.

            //TODO: WAS IT A SOLO QUESTION?

            //TODO: WAS IT PART OF A GAME?

            //TODO: IF THE USER GOT THE ANSWER INCORRECT.

            //TODO: WAS IT A SOLO QUESTION?

            //TODO: WAS IT PART OF A GAME?

        //TODO: WE DIDN'T ASK THE USER A QUESTION.  WE SHOULD BE CONFUSED.

        const speakOutput = 'This is the Answer Intent.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const PointsIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'PointsIntent';
    },
    handle(handlerInput) {
        //TODO: IS THE USER IN A GAME?

            //TODO: HAS THE USER ALREADY USED THIS VALUE IN THE CURRENT ROUND OF THE GAME?

            //TODO: IS THIS VALUE BETWEEN 1 AND 5?  IF NOT, IT'S AN INVALID RESPONSE.

            //TODO: IF THIS POINT VALUE IS VALID, RECORD THEIR CHOICE AND GIVE THEM A QUESTION.

        //TODO: IF THE USER ISN'T IN A GAME, TREAT THEIR RESPONSE AS A WEIRD THING TO DO.

        const speakOutput = 'This is the Points Intent.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const StartGameIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'StartGameIntent';
    },
    handle(handlerInput) {
        //TODO: IS THE USER IN A GAME?

        const speakOutput = 'This is the Start Game Intent.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const ContinueGameIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ContinueGameIntent';
    },
    handle(handlerInput) {
        //TODO: IS THE USER IN A GAME?

        const speakOutput = 'This is the Continue Game Intent.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const QuestionIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'QuestionIntent';
    },
    handle(handlerInput) {
        //TODO: IS THE USER IN A GAME?

        const speakOutput = 'This is the Question Intent.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
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
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
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
    handle(handlerInput, error) {
        console.log(`~~~~ Error handled: ${error.stack}`);
        const speakOutput = `Sorry, I had trouble doing what you asked. Please try again.`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// The SkillBuilder acts as the entry point for your skill, routing all request and response
// payloads to the handlers above. Make sure any new handlers or interceptors you've
// defined are included below. The order matters - they're processed top to bottom.
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        AnswerIntentHandler,
        PointsIntentHandler,
        StartGameIntentHandler,
        ContinueGameIntentHandler,
        QuestionIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler, // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
        ) 
    .addErrorHandlers(
        ErrorHandler,
        )
    .lambda();
