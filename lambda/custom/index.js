//TODO: MAKE SURE EVERY SPEECH OBJECT IS SAVED TO THE SESSION, SO THAT THE REPEAT FUNCTION WORKS PROPERLY.
//MAKE SURE TO CONSOLE.LOG EVERY INTENT HANDLER FUNCTION.

const Alexa = require("ask-sdk-core");
const https = require("https");
const Airtable = require("airtable");
const dashbot = require("dashbot")(process.env.dashbot_key).alexa;

var IsFirstVisit = true;

const categories = [
    {"name": "Art & Stage",         "id": "recl0vhIOs1iSyXAu", "speechName": "art and stage",           "referenceName": "art_and_stage",           "productId": "amzn1.adg.product.4d4d4968-1e9f-40a3-a371-fcf2c92332f2"},
    {"name": "Business World",      "id": "recAJm9yEqDRGmjRr", "speechName": "business world",          "referenceName": "business_world",          "productId": "amzn1.adg.product.45090e66-6867-4108-8984-f609e332377d"},
    {"name": "Design",              "id": "recYsOA65RT5dQPlb", "speechName": "design",                  "referenceName": "design",                  "productId": "amzn1.adg.product.47c9a153-bb17-4534-870a-bf9b3ad76057"},
    {"name": "Film",                "id": "recdMJliTRpWYcj41", "speechName": "film",                    "referenceName": "film",                    "productId": "amzn1.adg.product.d795f7b6-375f-4842-a70f-65df1e459b7e"},
    {"name": "Food & Drink",        "id": "reclySZR1cRRl08jz", "speechName": "food and drink",          "referenceName": "food_and_drink",          "productId": "amzn1.adg.product.5d14e49d-8739-4d82-8a65-fa5056b6ff95"},
    {"name": "Geography",           "id": "recXXedb9nOqy1Fkk", "speechName": "geography",               "referenceName": "geography",               "productId": "amzn1.adg.product.a24f1fea-5459-4d6c-bf9a-675e090e8707"},
    {"name": "History",             "id": "rec6fDO7E7lXC2xe3", "speechName": "history",                 "referenceName": "history",                 "productId": "amzn1.adg.product.22492ac4-d912-465d-84ac-d9561622cc1f"},
    {"name": "Language",            "id": "recnhcldrp4o6QwFr", "speechName": "language",                "referenceName": "language",                "productId": "amzn1.adg.product.46448efa-4023-4c35-a765-d9e3e6697a9a"},
    {"name": "Literature",          "id": "recsy6jdhmIig1YSB", "speechName": "literature",              "referenceName": "literature",              "productId": "amzn1.adg.product.c31651fb-c855-4221-93f6-6c48798708af"},
    {"name": "Miscellaneous",       "id": "recTeqmLykygSz9gF", "speechName": "miscellaneous",           "referenceName": "miscellaneous",           "productId": "amzn1.adg.product.a51c00b6-ddd5-4905-995c-0b55d1d10a79"},
    {"name": "Music",               "id": "recdZhe6oq5wn1ksw", "speechName": "music",                   "referenceName": "music",                   "productId": "amzn1.adg.product.6e6a8f5d-1230-4cb5-8757-86b987f2b1a6"},
    {"name": "Nature",              "id": "recSKFke58Sfd9vWi", "speechName": "nature",                  "referenceName": "nature",                  "productId": "amzn1.adg.product.f458868c-9fdb-428b-8820-4ce09367d375"},
    {"name": "People",              "id": "recto6ILGOAYkOl8a", "speechName": "people",                  "referenceName": "people",                  "productId": "amzn1.adg.product.1835f3db-ddbf-445f-b713-a5a075e6afe3"},
    {"name": "Politics",            "id": "rechKWhUV28LSeiRW", "speechName": "politics",                "referenceName": "politics",                "productId": "amzn1.adg.product.004b5d30-8b05-4bd9-b26f-bc8e782897dc"},
    {"name": "Sports & Games",      "id": "recr8BC0GYJVwjt1k", "speechName": "sports and games",        "referenceName": "sports_and_games",        "productId": "amzn1.adg.product.d486d675-e562-494d-b6a1-e373aa6d974f"},
    {"name": "Science",             "id": "recKqrOdwpk5hezpL", "speechName": "science",                 "referenceName": "science",                 "productId": "amzn1.adg.product.2213f263-9e0d-401c-ae40-c34924f900fd"},
    {"name": "Technology",          "id": "recG6oDVjpFNGrnO2", "speechName": "technology",              "referenceName": "technology",              "productId": "amzn1.adg.product.d1743574-c4fe-4ec6-a968-c89ecc38a37e"},
    {"name": "United States",       "id": "recRiC3PAYQHmMEvC", "speechName": "united states",           "referenceName": "united_states",           "productId": "amzn1.adg.product.2c40e45f-9525-45ba-bcac-9d004ee39bd2"},
    {"name": "Tradition & Beliefs", "id": "recKh6vjk2KQLGEm7", "speechName": "tradition and beliefs",   "referenceName": "tradition_and_beliefs",   "productId": "amzn1.adg.product.c701e08e-e54e-412b-bdc9-63a38731315d"},
    {"name": "TV & Radio",          "id": "recab6u8fMDf63S3k", "speechName": "tv and radio",            "referenceName": "tv_and_radio",            "productId": "amzn1.adg.product.76cd6f01-c886-4415-8411-7343a9ea091d"}
];

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        console.log("CANHANDLE - LaunchRequestHandler");
        return Alexa.getRequestType(handlerInput.requestEnvelope) === "LaunchRequest";
    },
    async handle(handlerInput) {
        console.log("HANDLED - LaunchRequestHandler");
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        var speakText = "";

        var locale = handlerInput.requestEnvelope.request.locale;
        var welcome = await getRandomResponse("Welcome", locale);

        //IF THIS IS THEIR FIRST TIME USING THE SKILL, START THEM WITH A QUESTION.
        if (IsFirstVisit) {
            sessionAttributes.currentState = "LAUNCHREQUEST - FIRSTVISIT";
            //speakText = welcome.fields.VoiceResponse + " Before we get started, what is your first name?";
            speakText = "<audio src='soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_bridge_02'/>" + welcome.fields.VoiceReponse;
            var category = getRandomCategory();
            var question = await getRandomQuestion(category);
            sessionAttributes.currentQuestion = question.fields;
            return await askTriviaQuestion(handlerInput, category, question, 1, speakText);
        }
        else
        {
            sessionAttributes.currentState = "LAUNCHREQUEST - SUBSEQUENTVISIT";
            var query = await getRandomResponse("ActionQuery", locale);
            speakText = "<audio src='soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_bridge_02'/>" + welcome.fields.VoiceResponse + "<break time='.5s'/>" + query.fields.VoiceResponse;
        }
        
        //TODO: IF THEY WERE IN THE MIDDLE OF A GAME, RESUME THE GAME.

        sessionAttributes.currentSpeak = speakText;
        sessionAttributes.currentReprompt = query.fields.VoiceResponse;

        //const { deviceId } = handlerInput.requestEnvelope.context.System.device;
        //const deviceAddressServiceClient = handlerInput.serviceClientFactory.getDeviceAddressServiceClient();
        //const address = await deviceAddressServiceClient.getCountryAndPostalCode(deviceId);
        //console.log("ADDRESS:" + JSON.stringify(address));
        
        return handlerInput.responseBuilder
            .speak(speakText)
            .reprompt(query.fields.VoiceResponse)
            //.withAskForPermissionsConsentCard(["read::alexa:device:all:address:country_and_postal_code"])
            .getResponse();
    }
};
/*
const FirstNameIntentHandler = {
    canHandle(handlerInput) {
        console.log("CANHANDLE - FirstNameIntentHandler");
        return Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest"
            && Alexa.getIntentName(handlerInput.requestEnvelope) === "FirstNameIntent";
    },
    async handle(handlerInput) {
        console.log("HANDLED - FirstNameIntentHandler");
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const locale = handlerInput.requestEnvelope.request.locale;

        var firstname = getSpokenValue(handlerInput, "firstname");
        var speakText = "";

        if (firstname != undefined) {

            var base = new Airtable({apiKey: process.env.airtable_key}).base(process.env.airtable_base_data);

            base('User').update(sessionAttributes.user.RecordId, {"FirstName": firstname}, function(err, record) {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log(record.get('UserId'));
            });

            //TODO: SAVE USER'S NAME TO DATA TABLE.
            if (sessionAttributes.currentState.includes("FIRSTVISIT")) {
                var category = getRandomCategory();
                var question = await getRandomQuestion(category);
                sessionAttributes.currentQuestion = question.fields;
                return await askTriviaQuestion(handlerInput, category, question, 1, "OK, " + firstname + ". ");
            }
            else {
                var query = await getRandomResponse("ActionQuery", locale);
                speakText = "OK, " + firstname + ".  Thanks for that. " + query.fields.VoiceResponse;
            }
        }
        else {
            speakText = "I'm sorry.  I didn't catch that.  What is your first name?";
        }

        sessionAttributes.currentSpeak = speakText;
        sessionAttributes.currentReprompt = speakText;

        return handlerInput.responseBuilder
            .speak(speakText)
            .reprompt(speakText)
            .getResponse();
    }
};
*/
const AnswerIntentHandler = {
    canHandle(handlerInput) {
        console.log("CANHANDLE - AnswerIntentHandler");
        return Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest"
            && Alexa.getIntentName(handlerInput.requestEnvelope) === "AnswerIntent";
    },
    async handle(handlerInput) {
        console.log("HANDLED - AnswerIntentHandler");
        var sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        var locale = handlerInput.requestEnvelope.request.locale;
        var airtable = await new Airtable({apiKey: process.env.airtable_key}).base(process.env.airtable_base_data);
        var speakText = "This is the Answer Intent.";
        var answerSlotValue = getSpokenValue(handlerInput, "answer");
        var wrongSlotValue = getSpokenValue(handlerInput, "wrong");
        var IsCorrect = false;
        var slotValue;
        if (answerSlotValue != undefined) slotValue = answerSlotValue;
        else if (wrongSlotValue != undefined) slotValue = wrongSlotValue;

        var answerNote = "";
        const ms = handlerInput.serviceClientFactory.getMonetizationServiceClient();
 
        //WE NEED TO DETERMINE IF THEY HAVE A SUBSCRIPTION.
        return ms.getInSkillProducts(locale).then(async function(res) {
            var subscription = res.inSkillProducts.find(record => record.referenceName == "all_categories");
            console.log("SUBSCRIPTION = " + JSON.stringify(subscription));
            

            //TODO: DID WE ASK THE USER A QUESTION?
            if (sessionAttributes.currentQuestion != undefined) {

                //TODO: IF THE USER GOT THE ANSWER CORRECT.
                if (isAnswerCorrect(handlerInput)) {
                    sessionAttributes.currentState = "ANSWERINTENT - CORRECTANSWER";
                    if (sessionAttributes.currentQuestion.VoiceAnswerNote != undefined) answerNote = sessionAttributes.currentQuestion.VoiceAnswerNote;
                    IsCorrect = true;
                    var correct = await getRandomResponse("AnswerCorrect", locale);
                    var actionQuery = await getRandomResponse("ActionQuery", locale);
                    speakText = "<audio src='soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_positive_response_01'/> " + correct.fields.VoiceResponse + " " + answerNote;
                }
                else{
                    sessionAttributes.currentState = "ANSWERINTENT - WRONGANSWER";
                    var wrong = await getRandomResponse("AnswerWrong", locale);
                    var reveal = "";
                    //IF THEY HAVE THE SUBSCRIPTION, WE TELL THEM WHAT THE RIGHT ANSWER IS WHEN THEY GET IT WRONG.
                    if (isEntitled(subscription)) {
                        reveal = await getRandomResponse("AnswerReveal", locale);
                        reveal = reveal.fields.VoiceResponse.replace("XXXXXXXXXX", sessionAttributes.currentQuestion.VoiceAnswer);
                    } 
                    var actionQuery = await getRandomResponse("ActionQuery", locale);
                    speakText = "<audio src='soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_negative_response_01'/> " + wrong.fields.VoiceResponse + " " + reveal;
                }

                //TODO: IF THE USER IS CURRENTLY PLAYING TODAY'S GAME
                    //TODO: IF THEY QUESTION WRONG, THANK THEM FOR PLAYING, AND END THE GAME.
                    //TODO: IF THEY GOT THE QUESTION RIGHT, CONTINUE THE GAME
                        //TODO: IF THAT WASN'T THE LAST QUESTION
                            //TODO: ASK THE USER THEIR NEXT QUESTION
                        //TODO: IF IT WAS THE LAST QUESTION, CONGRATULATE THEM FOR WINNING.

                await airtable("UserAnswer").create({
                    "User": [sessionAttributes.user.RecordId],
                    "Question": [sessionAttributes.currentQuestion.RecordId],
                    "IsCorrect": IsCorrect,
                    "SlotValue": slotValue
                }, async function(err, record) {
                    if (err) {
                    console.error(err);
                    return;
                    }
                    //console.log(record.getId());
                });

                sessionAttributes.currentQuestion = undefined;

                    //TODO: WAS IT A SOLO QUESTION?

                    //TODO: WAS IT PART OF A GAME?

                //TODO: IF THE USER GOT THE ANSWER INCORRECT.

                    //TODO: WAS IT A SOLO QUESTION?

                    //TODO: WAS IT PART OF A GAME?
            }
            //TODO: WE DIDN'T ASK THE USER A QUESTION.  WE SHOULD BE CONFUSED.
            else {
                sessionAttributes.currentState = "ANSWERINTENT - NOQUESTION";
                //TODO: RECORD ALL OF THESE INCORRECT SLOT VALUES AS POTENTIAL IMPROVEMENTS FOR OUR SAMPLE UTTERANCES.
                speakText = "You just said " + slotValue + " to me.  I think you're fishing for the answers to questions, and that's not allowed.  Stop breaking the rules.";

                airtable("UserWrong").create({
                    "User": [sessionAttributes.user.RecordId],
                    "SlotValue": slotValue
                }, function(err, record) {
                    if (err) {
                    console.error(err);
                    return;
                    }
                    //console.log(record.getId());
                });
            }
            
            sessionAttributes.currentSpeak = speakText;
            sessionAttributes.currentReprompt = actionQuery.fields.VoiceResponse;

            return handlerInput.responseBuilder
                .speak(speakText)
                .reprompt(actionQuery.fields.VoiceResponse)
                .getResponse();
            });
    }
};

const StartGameIntentHandler = {
    canHandle(handlerInput) {
        console.log("CANHANDLE - StartGameIntentHandler");
        return Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest"
            && Alexa.getIntentName(handlerInput.requestEnvelope) === "StartGameIntent";
    },
    async handle(handlerInput) {
        console.log("HANDLED - StartGameIntentHandler");
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        //TODO: HAS THE USER ALREADY PLAYED THE GAME?
        //TODO: IS THE USER ALREADY PLAYING THE GAME?  MAKE SURE WE KEEP THEM ON THE RIGHT QUESTION.

        var event = await getTodaysEvent();
        sessionAttributes.currentEvent = event.fields;
        var speakText = "Welcome to today's game, on " + event.fields.Title + "! ";

        var eventQuestion = await getEventQuestion(sessionAttributes.currentEvent.EventQuestion[0]);
        var question = await getSpecificQuestion(eventQuestion.fields.Question);
        var category = getSpecificCategory(question.fields.Category[0]);
        sessionAttributes.currentQuestion = question.fields;

        var airtable = await new Airtable({apiKey: process.env.airtable_key}).base(process.env.airtable_base_data);
        airtable('UserEvent').create({
            "User": [sessionAttributes.user.RecordId],
            "Event": [sessionAttributes.currentEvent.RecordId]
          }, function(err, record) {
            if (err) {
              console.error(err);
              return;
            }
            //console.log(record.getId());
          });


        return await askTriviaQuestion(handlerInput, category, question, eventQuestion.fields.Order, speakText);
    }
};

const ContinueGameIntentHandler = {
    canHandle(handlerInput) {
        console.log("CANHANDLE - ContinueGameIntentHandler");
        return Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest"
            && Alexa.getIntentName(handlerInput.requestEnvelope) === "ContinueGameIntent";
    },
    async handle(handlerInput) {
        console.log("HANDLED - ContinueGameIntentHandler");
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        //TODO: IS THE USER IN A GAME?

        var speakText = "This is the Continue Game Intent.";

        sessionAttributes.currentSpeak = speakText;
        sessionAttributes.currentReprompt = speakText;

        return handlerInput.responseBuilder
            .speak(speakText)
            .reprompt(speakText)
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
        const locale = handlerInput.requestEnvelope.request.locale;
        //TODO: IS THE USER IN A GAME?
        var category = getSpecificCategoryFromSlot(handlerInput);
        
        if (category != undefined) {
            const ms = handlerInput.serviceClientFactory.getMonetizationServiceClient();
            return await ms.getInSkillProducts(locale).then(async function checkForProductAccess(result) {
                const subscription = result.inSkillProducts.find(record => record.referenceName === "all_categories");
                const entitlement = result.inSkillProducts.find(record => record.referenceName === category.referenceName);
                //IF THE USER IS NOT ENTITLED TO THIS CATEGORY, OFFER THEM AN UPSELL.
                if (!isEntitled(subscription) && !isEntitled(entitlement)) {    
                    var upsellMessage = await getRandomResponse("Upsell", locale);
                    upsellMessage = upsellMessage.fields.VoiceResponse.replace("XXXXXXXXXX", category.speechName);

                    return handlerInput.responseBuilder
                        .addDirective({
                            type: 'Connections.SendRequest',
                            name: 'Upsell',
                            payload: {
                            InSkillProduct: {
                                productId: entitlement[0].productId,
                            },
                            upsellMessage,
                            },
                            token: 'correlationToken',
                        })
                        .getResponse();
                }
                else {
                    sessionAttributes.currentState = "QUESTIONINTENT - CATEGORY - ENTITLED";
                    var question = await getRandomQuestion(category);
                    sessionAttributes.currentQuestion = question.fields;
                    return await askTriviaQuestion(handlerInput, category, question);
                }
            });
        }
        else {
            sessionAttributes.currentState = "QUESTIONINTENT - RANDOM";
            category = getRandomCategory();
            var question = await getRandomQuestion(category);
            sessionAttributes.currentQuestion = question.fields;
            return await askTriviaQuestion(handlerInput, category, question);
        }
    }
};

const SpecificQuestionIntentHandler = {
    canHandle(handlerInput) {
        console.log("CANHANDLE - SpecificQuestionIntentHandler");
        return Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest"
            && Alexa.getIntentName(handlerInput.requestEnvelope) === "SpecificQuestionIntent";
    },
    async handle(handlerInput) {
        console.log("HANDLED - SpecificQuestionIntentHandler");
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const locale = handlerInput.requestEnvelope.request.locale;
        //TODO: IS THE USER IN A GAME?
        var category = getSpecificCategoryFromSlot(handlerInput);
        var number = handlerInput.requestEnvelope.request.intent.slots.number.value;
        console.log("CATEGORY = " + JSON.stringify(category));
        console.log("NUMBER = " + JSON.stringify(number));
        
        sessionAttributes.currentState = "SPECIFICQUESTIONINTENT - SPECIFIC";
        var question = await getVerySpecificQuestion(category, number);
        sessionAttributes.currentQuestion = question.fields;
        return await askTriviaQuestion(handlerInput, category, question);
    }
};

//THIS HANDLES A USER'S REQUEST TO BUY THE SUBSCRIPTION.
const BuySubscriptionHandler = {
    canHandle(handlerInput) {
        console.log("CAN HANDLE - BuySubscriptionHandler");
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
               handlerInput.requestEnvelope.request.intent.name === 'BuySubscriptionIntent';
    },
    async handle(handlerInput) {
        console.log("HANDLE - BuySubscriptionHandler");
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const locale = handlerInput.requestEnvelope.request.locale;
        const ms = handlerInput.serviceClientFactory.getMonetizationServiceClient();
 
        return ms.getInSkillProducts(locale).then(async function(res) {
            var product = res.inSkillProducts.find(record => record.referenceName == "all_categories");

            if (product != undefined) {
                sessionAttributes.currentState = "BUYSUBSCRIPTIONINTENT";
                return handlerInput.responseBuilder
                    .addDirective({
                        'type': 'Connections.SendRequest',
                        'name': 'Buy',
                        'payload': {
                            'InSkillProduct': {
                                'productId': product.productId
                            }
                        },
                        'token': 'correlationToken'
                    })
                    .getResponse();
            }
            else {
                sessionAttributes.currentState = "BUYSUBSCRIPTIONINTENT - PRODUCTNOTFOUND";
                var actionQuery = await getRandomResponse("ActionQuery", locale);
                var repromptText = actionQuery.fields.VoiceResponse;
                var speakText = "I'm sorry. The TKO Trivia subscription doesn't appear to be available at this time." + repromptText;

                sessionAttributes.currentSpeak = speakText;
                sessionAttributes.currentReprompt = repromptText;

                return handlerInput.responseBuilder
                    .speak(speakText)
                    .reprompt(repromptText)
                    .getResponse();
            }
        });
    }
}; 

//THIS HANDLES A USER'S REQUEST TO CANCEL OR RETURN A PRODUCT.
const BuyProductHandler = {
    canHandle(handlerInput) {
        console.log("CAN HANDLE - BuyProductHandler");
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
               handlerInput.requestEnvelope.request.intent.name === 'BuyProductIntent';
    },
    async handle(handlerInput) {
        console.log("HANDLE - BuyProductHandler");
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const locale = handlerInput.requestEnvelope.request.locale;
        const ms = handlerInput.serviceClientFactory.getMonetizationServiceClient();
 
        return ms.getInSkillProducts(locale).then(async function(res) {
            var category = getSpecificCategoryFromSlot(handlerInput);

            if (category != undefined) {
                var product = res.inSkillProducts.find(record => record.referenceName == category.referenceName);

                if (product != undefined) {
                    sessionAttributes.currentState = "BUYPRODUCTINTENT - CATEGORY";
                    return handlerInput.responseBuilder
                        .addDirective({
                            'type': 'Connections.SendRequest',
                            'name': 'Buy',
                            'payload': {
                                'InSkillProduct': {
                                    'productId': category.productId
                                }
                            },
                            'token': 'correlationToken'
                        })
                        .getResponse();
                }
                else {
                    sessionAttributes.currentState = "CANCELPRODUCTINTENT - PRODUCTNOTFOUND";
                    var actionQuery = await getRandomResponse("ActionQuery", locale);
                    var repromptText = actionQuery.fields.VoiceResponse;
                    var speakText = "I'm sorry.  TKO Trivia doesn't offer the " + getSpokenValue(handlerInput, "category") + " category." + repromptText;

                    sessionAttributes.currentSpeak = speakText;
                    sessionAttributes.currentReprompt = repromptText;

                    return handlerInput.responseBuilder
                        .speak(speakText)
                        .reprompt(repromptText)
                        .getResponse();
                    }
            }
            else {
                sessionAttributes.currentState = "BUYPRODUCTINTENT - SLOTVALUEEMPTY";
                var actionQuery = await getRandomResponse("ActionQuery", locale);
                var repromptText = actionQuery.fields.VoiceResponse;
                var speakText = "I'm sorry.  I didn't hear which category you were trying to purchase.  Can you try again?";

                sessionAttributes.currentSpeak = speakText;
                sessionAttributes.currentReprompt = repromptText;

                return handlerInput.responseBuilder
                    .speak(speakText)
                    .reprompt(repromptText)
                    .getResponse();
            }
        });
    }
}; 

//THIS HANDLES A USER'S REQUEST TO CANCEL OR RETURN A PRODUCT.
const CancelProductHandler = {
    canHandle(handlerInput) {
        console.log("CAN HANDLE - CancelProductHandler");
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
               handlerInput.requestEnvelope.request.intent.name === 'CancelProductIntent';
    },
    async handle(handlerInput) {
        console.log("HANDLE - CancelProductHandler");
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const locale = handlerInput.requestEnvelope.request.locale;
        const ms = handlerInput.serviceClientFactory.getMonetizationServiceClient();
 
        return ms.getInSkillProducts(locale).then(async function(res) {
            var category = getSpecificCategoryFromSlot(handlerInput);

            if (category != undefined) {
                var product = res.inSkillProducts.find(record => record.referenceName == category.referenceName);

                if (product != undefined) {
                    sessionAttributes.currentState = "CANCELPRODUCTINTENT - CATEGORY";
                    return handlerInput.responseBuilder
                        .addDirective({
                                "type": "Connections.SendRequest",
                                "name": "Cancel",
                                "payload": {
                                    "InSkillProduct": {
                                        "productId": product.productId
                                    }
                                },
                                "token": "correlationToken"
                            })
                            .getResponse();
                }
                else {
                    sessionAttributes.currentState = "CANCELPRODUCTINTENT - PRODUCTNOTFOUND";
                    var actionQuery = await getRandomResponse("ActionQuery", locale);
                    var repromptText = actionQuery.fields.VoiceResponse;
                    var speakText = "I'm sorry.  TKO Trivia doesn't offer the " + getSpokenValue(handlerInput, "category") + " category." + repromptText;

                    sessionAttributes.currentSpeak = speakText;
                    sessionAttributes.currentReprompt = repromptText;

                    return handlerInput.responseBuilder
                        .speak(speakText)
                        .reprompt(repromptText)
                        .getResponse();
                    }
            }
            else {
                sessionAttributes.currentState = "CANCELPRODUCTINTENT - SLOTVALUEEMPTY";
                var actionQuery = await getRandomResponse("ActionQuery", locale);
                var repromptText = actionQuery.fields.VoiceResponse;
                var speakText = "I'm sorry.  TKO Trivia doesn't offer the " + getSpokenValue(handlerInput, "category") + " category." + repromptText;

                sessionAttributes.currentSpeak = speakText;
                sessionAttributes.currentReprompt = repromptText;

                return handlerInput.responseBuilder
                    .speak(speakText)
                    .reprompt(repromptText)
                    .getResponse();
            }
        });
    }
};

//THIS HANDLES A USER'S REQUEST TO CANCEL OR RETURN A PRODUCT.
const CancelSubscriptionHandler = {
    canHandle(handlerInput) {
        console.log("CAN HANDLE - CancelSubscriptionHandler");
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
               handlerInput.requestEnvelope.request.intent.name === 'CancelSubscriptionIntent';
    },
    async handle(handlerInput) {
        console.log("HANDLE - CancelSubscriptionHandler");
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const locale = handlerInput.requestEnvelope.request.locale;
        const ms = handlerInput.serviceClientFactory.getMonetizationServiceClient();
 
        return ms.getInSkillProducts(locale).then(async function(res) {
            var product = res.inSkillProducts.find(record => record.referenceName == "all_categories");

            if (product != undefined) {
                sessionAttributes.currentState = "CANCELSUBSCRIPTIONINTENT";
                return handlerInput.responseBuilder
                    .addDirective({
                            "type": "Connections.SendRequest",
                            "name": "Cancel",
                            "payload": {
                                "InSkillProduct": {
                                    "productId": product.productId
                                }
                            },
                            "token": "correlationToken"
                        })
                        .getResponse();
            }
            else {
                sessionAttributes.currentState = "CANCELSUBSCRIPTIONINTENT - NOTFOUND";
                var actionQuery = await getRandomResponse("ActionQuery", locale);
                var repromptText = actionQuery.fields.VoiceResponse;
                var speakText = "I'm sorry.  The TKO Trivia subscription isn't currently available." + repromptText;

                sessionAttributes.currentSpeak = speakText;
                sessionAttributes.currentReprompt = repromptText;

                return handlerInput.responseBuilder
                    .speak(speakText)
                    .reprompt(repromptText)
                    .getResponse();
            }
        });
    }
}; 

const HelpIntentHandler = {
    canHandle(handlerInput) {
        console.log("CANHANDLE - HelpIntentHandler");
        return Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest"
            && Alexa.getIntentName(handlerInput.requestEnvelope) === "AMAZON.HelpIntent";
    },
    async handle(handlerInput) {
        console.log("HANDLED - HelpIntentHandler");
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        var speakText = "This is the Help Intent.";

        sessionAttributes.currentSpeak = speakText;
        sessionAttributes.currentReprompt = speakText;

        return handlerInput.responseBuilder
            .speak(speakText)
            .reprompt(speakText)
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
        var speakText = goodbye.fields.VoiceResponse;

        sessionAttributes.currentSpeak = speakText;

        return handlerInput.responseBuilder
            .speak(speakText)
            .getResponse();
    }
};

//TODO: IF A USER IS ASKING TO REPEAT A QUESTION MORE THAN ONCE DURING A GAME, WE REFUSE.
const RepeatIntentHandler = {
    canHandle(handlerInput) {
        console.log("CANHANDLE - RepeatIntentHandler");
        return handlerInput.requestEnvelope.request.type === "IntentRequest"
            && handlerInput.requestEnvelope.request.intent.name === "AMAZON.RepeatIntent";
    },
    async handle(handlerInput) {
        console.log("HANDLED - RepeatIntentHandler");
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        var speakText = "";
        if (sessionAttributes.currentSpeak != undefined) { speakText = sessionAttributes.currentSpeak; }
        else speakText = "I haven't said anything yet. I can't repeat myself, silly. What do you want to do next?";

        return handlerInput.responseBuilder
               .speak(speakText)
               .reprompt(speakText)
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
        //TODO: IF I ASKED THE USER A QUESTION, BUT THEY EXIT, MARK THEIR RESPONSE AS INCORRECT.
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

        var speakText = "This is the Intent Reflector.  You just triggered " + intentName;

        sessionAttributes.currentSpeak = speakText;
        sessionAttributes.currentReprompt = speakText;

        return handlerInput.responseBuilder
            .speak(speakText)
            .reprompt(speakText)
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
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        
        var error = await getRandomResponse("Error", locale);
        var speakText = error.fields.VoiceResponse;

        sessionAttributes.currentSpeak = speakText;
        sessionAttributes.currentReprompt = speakText;

        return handlerInput.responseBuilder
            .speak(speakText)
            .reprompt(speakText)
            .getResponse();
    }
};

const SuccessfulPurchaseResponseHandler = {
    canHandle(handlerInput) {
        console.log("CANHANDLE - SuccessfulPurchaseResponseHandler");
        return handlerInput.requestEnvelope.request.type === "Connections.Response"
            && (handlerInput.requestEnvelope.request.name === "Buy" || handlerInput.requestEnvelope.request.name === "Upsell")
            && (handlerInput.requestEnvelope.request.payload.purchaseResult == "ACCEPTED" || handlerInput.requestEnvelope.request.payload.purchaseResult == "ALREADY_PURCHASED");
    },
    async handle(handlerInput) {
        console.log("HANDLE - SuccessfulPurchaseResponseHandler");

        const locale = handlerInput.requestEnvelope.request.locale;
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const ms = handlerInput.serviceClientFactory.getMonetizationServiceClient();
        const productId = handlerInput.requestEnvelope.request.payload.productId;

        return ms.getInSkillProducts(locale).then(async function(res) {
            let product = res.inSkillProducts.find(record => record.productId == productId);

            if (product != undefined) {
                if (product.referenceName === "all_categories") {
                    sessionAttributes.currentState = "CONNECTIONS.RESPONSE - " + handlerInput.requestEnvelope.request.name.toUpperCase() + " - SUBSCRIPTION - ACCEPTED";
                    var actionQuery = await getRandomResponse("ActionQuery", locale);
                    var repromptText = actionQuery.fields.VoiceResponse;
                    var speakText = "You have successfully unlocked the TKO Trivia subscription!  You can now ask for questions from any of the categories, and the correct answers will be shown after every question, even if you get it wrong!" + repromptText;

                    sessionAttributes.currentSpeak = speakText;
                    sessionAttributes.currentReprompt = repromptText;

                    return handlerInput.responseBuilder
                        .speak(speakText)
                        .reprompt(repromptText)
                        .getResponse();
                }
                else {
                    sessionAttributes.currentState = "CONNECTIONS.RESPONSE - " + handlerInput.requestEnvelope.request.name.toUpperCase() + " - CATEGORY - ACCEPTED";
                    var category = categories.find(o => o.productId === productId);
                    var speakText = "You can now say things like, ask me a " + category.speechName + " question, any time!";
                    var question = await getRandomQuestion(category);
                    sessionAttributes.currentQuestion = question.fields;
                    return await askTriviaQuestion(handlerInput, category, question, 0, speakText);
                }
            }
            //TODO: DOES THERE NEED TO BE AN ELSE CASE HERE?  IS THIS POSSIBLE?
        });
    }
};

const UnsuccessfulPurchaseResponseHandler = {
    canHandle(handlerInput) {
        console.log("CANHANDLE - UnsuccessfulPurchaseResponseHandler");
        return handlerInput.requestEnvelope.request.type === "Connections.Response"
            && (handlerInput.requestEnvelope.request.name === "Buy" || handlerInput.requestEnvelope.request.name === "Upsell")
            && handlerInput.requestEnvelope.request.payload.purchaseResult == 'DECLINED';
    },
    async handle(handlerInput) {
        console.log("HANDLE - UnsuccessfulPurchaseResponseHandler");

        const locale = handlerInput.requestEnvelope.request.locale;
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const ms = handlerInput.serviceClientFactory.getMonetizationServiceClient();
        const productId = handlerInput.requestEnvelope.request.payload.productId;

        return ms.getInSkillProducts(locale).then(async function(res) {
            let product = res.inSkillProducts.find(record => record.productId == productId);

            if (product != undefined) {
                var speakText = "";
                var actionQuery = await getRandomResponse("ActionQuery", locale);
                var repromptText = actionQuery.fields.VoiceResponse;
                var category = categories.find(o => o.productId === productId);

                if (product.referenceName === "all_categories") {
                    sessionAttributes.currentState = "CONNECTIONS.RESPONSE - " + handlerInput.requestEnvelope.request.name.toUpperCase() + " - SUBSCRIPTION - DECLINED";
                    speakText = repromptText;
                }
                else {
                    sessionAttributes.currentState = "CONNECTIONS.RESPONSE - " + handlerInput.requestEnvelope.request.name.toUpperCase() + " - CATEGORY - DECLINED";
                    speakText = "You can always ask for a random question, but to get questions from a specific category like " + category.speechName + ", you need to purchase that category or the TKO subscription. " + repromptText;
                }

                sessionAttributes.currentSpeak = speakText;
                sessionAttributes.currentReprompt = repromptText;

                return handlerInput.responseBuilder
                .speak(speakText)
                .reprompt(repromptText)
                .getResponse();
            }
            //TODO: DOES THERE NEED TO BE AN ELSE CASE HERE?  IS THIS POSSIBLE?
        });
    }
};

const CancelPurchaseResponseHandler = {
    canHandle(handlerInput) {
        console.log("CANHANDLE - CancelPurchaseResponseHandler");
        return handlerInput.requestEnvelope.request.type === "Connections.Response"
            && handlerInput.requestEnvelope.request.name === "Cancel";
    },
    async handle(handlerInput) {
        console.log("HANDLE - CancelPurchaseResponseHandler");

        const locale = handlerInput.requestEnvelope.request.locale;
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const ms = handlerInput.serviceClientFactory.getMonetizationServiceClient();
        const productId = handlerInput.requestEnvelope.request.payload.productId;

        return ms.getInSkillProducts(locale).then(async function(res) {
            let product = res.inSkillProducts.find(record => record.productId == productId);

            if (product != undefined) {
                var speakText = "";
                var actionQuery = await getRandomResponse("ActionQuery", locale);
                var repromptText = actionQuery.fields.VoiceResponse;
                var category = categories.find(o => o.productId === productId);
/*
                if (product.referenceName === "all_categories" && handlerInput.requestEnvelope.request.payload.purchaseResult == "ACCEPTED") {
                    sessionAttributes.currentState = "CONNECTIONS.RESPONSE - CANCEL - SUBSCRIPTION - ACCEPTED";
                    speakText = repromptText;
                }
                else if (product.referenceName === "all_categories" && handlerInput.requestEnvelope.request.payload.purchaseResult == "NOT_ENTITLED") {
                    sessionAttributes.currentState = "CONNECTIONS.RESPONSE - CANCEL - SUBSCRIPTION - NOT_ENTITLED";
                    speakText = repromptText;
                }
                else if(handlerInput.requestEnvelope.request.payload.purchaseResult == "ACCEPTED") {
                    sessionAttributes.currentState = "CONNECTIONS.RESPONSE - CANCEL - CATEGORY - ACCEPTED";
                    speakText = repromptText;
                }
                else if(handlerInput.requestEnvelope.request.payload.purchaseResult == "NOT_ENTITLED") {
                    sessionAttributes.currentState = "CONNECTIONS.RESPONSE - CANCEL - CATEGORY - NOT_ENTITLED";
                    speakText = repromptText;
                }
                else {
                    sessionAttributes.currentState = "CONNECTIONS.RESPONSE - CANCEL - CATEGORY - JEFFISWEIRD";
                    speakText = repromptText;
                }
*/
                speakText = repromptText;

                sessionAttributes.currentSpeak = speakText;
                sessionAttributes.currentReprompt = repromptText;

                return handlerInput.responseBuilder
                .speak(speakText)
                .reprompt(repromptText)
                .getResponse();
            }
            //TODO: DOES THERE NEED TO BE AN ELSE CASE HERE?  IS THIS POSSIBLE?
        });
    }
};

const ErrorPurchaseResponseHandler = {
    canHandle(handlerInput) {
        console.log("CANHANDLE - ErrorPurchaseResponseHandler");
        return handlerInput.requestEnvelope.request.type === "Connections.Response"
            && (handlerInput.requestEnvelope.request.name === "Buy" || handlerInput.requestEnvelope.request.name === "Upsell")
            && handlerInput.requestEnvelope.request.payload.purchaseResult == 'ERROR';
    },
    async handle(handlerInput) {
        console.log("HANDLE - ErrorPurchaseResponseHandler");
        var actionQuery = await getRandomResponse("ActionQuery", locale);
        var repromptText = actionQuery.fields.VoiceResponse;
        var speakText = "Something went wrong with your purchase request.  You might want to try using a different device." + repromptText;

        sessionAttributes.currentState = "CONNECTIONS.RESPONSE - " + handlerInput.requestEnvelope.request.name.toUpperCase() + " - ERROR";
        sessionAttributes.currentSpeak = speakText;
        sessionAttributes.currentReprompt = repromptText;

        return handlerInput.responseBuilder
                .speak(speakText)
                .reprompt(repromptText)
                .getResponse();
    }
};

async function askTriviaQuestion(handlerInput, category, question, ordinal = 0, speech = "") {
    console.log("ASKING TRIVIA QUESTION.")
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    sessionAttributes.currentState = "ASKING QUESTION";

    const locale = handlerInput.requestEnvelope.request.locale;
    var ordinalSpeech = "";
    if (ordinal > 0) ordinalSpeech = "<say-as interpret-as='ordinal'>" + ordinal + "</say-as> ";
    var answerPrompt = await getRandomResponse("AnswerPrompt", locale);
    var speakText = speech + "<break time='.5s'/>Here's your " + ordinalSpeech + "question, from the " + category.speechName + " category.<audio src='https://s3.amazonaws.com/tko-trivia/audio/" + category.referenceName + ".mp3' /><break time='.25s'/>" + question.fields.VoiceQuestion + "<audio src='soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_waiting_loop_30s_01'/>" + answerPrompt.fields.VoiceResponse;

    sessionAttributes.currentSpeak = speakText;
    sessionAttributes.currentReprompt = question.fields.VoiceQuestion;

    var synonyms;
    if (question.fields.Synonyms != undefined) {
        synonyms = question.fields.Synonyms.split(", ");
    }
    else synonyms = [question.fields.VoiceAnswer.toLowerCase()];
    

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
                  value: question.fields.VoiceAnswer,
                  synonyms: synonyms
                }
              }
            ]
          }
        ]
      };
        
    //TODO: ADD SCREEN DESIGN ELEMENTS FOR DEVICES WITH DISPLAYS
    return handlerInput.responseBuilder
        .speak(speakText)
        .reprompt(question.fields.VoiceQuestion)
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

async function getVerySpecificQuestion(category, number) {
    const response = await httpGet(process.env.airtable_base_data, "&filterByFormula=AND(IsDisabled%3DFALSE(),Category%3D%22" + encodeURIComponent(category.name) + "%22,Number%3D" + number + ")", "Question");
    const question = response.records[0];
    console.log("SPECIFIC QUESTION = " + JSON.stringify(question));
    return question;
}

async function getTodaysEvent() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + "-" + mm + "-" + dd;//mm + '/' + dd + '/' + yyyy;
    const response = await httpGet(process.env.airtable_base_data, "&filterByFormula=AND(IsDisabled%3DFALSE(),DATESTR(EventDate)%3D%22" + encodeURIComponent(today) + "%22)", "Event");
    var event = response.records[0];
    console.log("TODAY'S EVENT = " + JSON.stringify(event));
    return event;
}

async function getSpecificQuestion(recordId) {
    const response = await httpGet(process.env.airtable_base_data, "&filterByFormula=AND(IsDisabled%3DFALSE(),RecordId%3D%22" + encodeURIComponent(recordId) + "%22)", "Question");
    const question = getRandomItem(response.records);
    console.log("SPECIFIC QUESTION = " + JSON.stringify(question));
    return question;
}

async function getEventQuestion(recordId) {
    const response = await httpGet(process.env.airtable_base_data, "&filterByFormula=AND(IsDisabled%3DFALSE(),RecordId%3D%22" + encodeURIComponent(recordId) + "%22)", "EventQuestion");
    const eventQuestion = getRandomItem(response.records);
    console.log("EVENT QUESTION = " + JSON.stringify(eventQuestion));
    return eventQuestion;
}

async function getRandomResponse(type, locale) {
    console.log("GETTING RANDOM RESPONSE TYPE = " + type);
    const result = await httpGet(process.env.airtable_base_speech, "&filterByFormula=AND(IsDisabled%3DFALSE(),Locale%3D%22" + encodeURIComponent(locale) + "%22)", type);
    const response = getRandomItem(result.records);
    console.log("RANDOM RESPONSE (" + type + ") = " + JSON.stringify(response));
    return response;
}

function getSpecificCategory(record) {
    return categories.find(o => o.id === record);
}

function getSpecificCategoryFromSlot(handlerInput)
{
    console.log("GETTING SPECIFIC CATEGORY")
    if (handlerInput.requestEnvelope
    &&  handlerInput.requestEnvelope.request
    &&  handlerInput.requestEnvelope.request.intent
    &&  handlerInput.requestEnvelope.request.intent.slots
    &&  handlerInput.requestEnvelope.request.intent.slots.category
    &&  handlerInput.requestEnvelope.request.intent.slots.category.resolutions
    &&  handlerInput.requestEnvelope.request.intent.slots.category.resolutions.resolutionsPerAuthority
    &&  handlerInput.requestEnvelope.request.intent.slots.category.resolutions.resolutionsPerAuthority[0]
    &&  handlerInput.requestEnvelope.request.intent.slots.category.resolutions.resolutionsPerAuthority[0].values
    &&  handlerInput.requestEnvelope.request.intent.slots.category.resolutions.resolutionsPerAuthority[0].values[0]
    &&  handlerInput.requestEnvelope.request.intent.slots.category.resolutions.resolutionsPerAuthority[0].values[0].value
    &&  handlerInput.requestEnvelope.request.intent.slots.category.resolutions.resolutionsPerAuthority[0].values[0].value.id) {
        let category = categories.find(o => o.id === handlerInput.requestEnvelope.request.intent.slots.category.resolutions.resolutionsPerAuthority[0].values[0].value.id);
        console.log("FOUND SPECIFIC CATEGORY. " + JSON.stringify(category));
        return category;
    }
    console.log("DID NOT FIND SPECIFIC CATEGORY.");
    return undefined;
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

function isProduct(product) {
    return product && Object.keys(product).length > 0;
}

function isEntitled(product) {
    return isProduct(product) && product.entitled === "ENTITLED";
}

function isAnswerCorrect(handlerInput){
    if (((handlerInput.requestEnvelope)
    && (handlerInput.requestEnvelope.session)
    && (handlerInput.requestEnvelope.session.attributes)
    && (handlerInput.requestEnvelope.session.attributes.currentQuestion)
    && (handlerInput.requestEnvelope.session.attributes.currentQuestion.RecordId))
    && ((handlerInput.requestEnvelope.request)
    && (handlerInput.requestEnvelope.request.intent)
    && (handlerInput.requestEnvelope.request.intent.slots)
    && (handlerInput.requestEnvelope.request.intent.slots.answer)
    && (handlerInput.requestEnvelope.request.intent.slots.answer.resolutions)
    && (handlerInput.requestEnvelope.request.intent.slots.answer.resolutions.resolutionsPerAuthority)
    && (handlerInput.requestEnvelope.request.intent.slots.answer.resolutions.resolutionsPerAuthority[1])
    && (handlerInput.requestEnvelope.request.intent.slots.answer.resolutions.resolutionsPerAuthority[1].values)
    && (handlerInput.requestEnvelope.request.intent.slots.answer.resolutions.resolutionsPerAuthority[1].values[0])
    && (handlerInput.requestEnvelope.request.intent.slots.answer.resolutions.resolutionsPerAuthority[1].values[0].value)
    && (handlerInput.requestEnvelope.request.intent.slots.answer.resolutions.resolutionsPerAuthority[1].values[0].value.id))
    && (handlerInput.requestEnvelope.session.attributes.currentQuestion.RecordId ===  handlerInput.requestEnvelope.request.intent.slots.answer.resolutions.resolutionsPerAuthority[1].values[0].value.id)) {
        console.log("handlerInput.requestEnvelope.session.attributes.currentQuestion.RecordId = " + handlerInput.requestEnvelope.session.attributes.currentQuestion.RecordId);
        console.log("handlerInput.requestEnvelope.request.intent.slots.answer.resolutions.resolutionsPerAuthority[1].values[0].value.id = " + handlerInput.requestEnvelope.request.intent.slots.answer.resolutions.resolutionsPerAuthority[1].values[0].value.id);
        return true;
    } 

    //console.log("handlerInput.requestEnvelope.session.attributes.currentQuestion.RecordId = " + handlerInput.requestEnvelope.session.attributes.currentQuestion.RecordId);
    //console.log("handlerInput.requestEnvelope.request.intent.slots.answer.resolutions.resolutionsPerAuthority[1].values[0].value.id = " + handlerInput.requestEnvelope.request.intent.slots.answer.resolutions.resolutionsPerAuthority[1].values[0].value.id);
    return false;
}

function getSpokenValue(handlerInput, slotName) {
    if ((handlerInput.requestEnvelope) &&
        (handlerInput.requestEnvelope.request) &&
        (handlerInput.requestEnvelope.request.intent) &&
        (handlerInput.requestEnvelope.request.intent.slots) &&
        (handlerInput.requestEnvelope.request.intent.slots[slotName]) &&
        (handlerInput.requestEnvelope.request.intent.slots[slotName].value)) return handlerInput.requestEnvelope.request.intent.slots[slotName].value;
    return undefined;
}

function getResolvedValues(handlerInput, slotName) {
    if ((handlerInput.requestEnvelope) &&
        (handlerInput.requestEnvelope.request) &&
        (handlerInput.requestEnvelope.request.intent) &&
        (handlerInput.requestEnvelope.request.intent.slots) &&
        (handlerInput.requestEnvelope.request.intent.slots[slotName]) &&
        (handlerInput.requestEnvelope.request.intent.slots[slotName].resolutions) &&
        (handlerInput.requestEnvelope.request.intent.slots[slotName].resolutions.resolutionsPerAuthority) &&
        (handlerInput.requestEnvelope.request.intent.slots[slotName].resolutions.resolutionsPerAuthority[0]) &&
        (handlerInput.requestEnvelope.request.intent.slots[slotName].resolutions.resolutionsPerAuthority[0].values)) return handlerInput.requestEnvelope.request.intent.slots[slotName].resolutions.resolutionsPerAuthority[0].values;
    return undefined;
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
      console.log("USER RECORD = " + JSON.stringify(userRecord.fields));
      const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
      sessionAttributes.user = userRecord.fields;
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
        BuyProductHandler,
        BuySubscriptionHandler,
        CancelProductHandler,
        CancelSubscriptionHandler,
        SuccessfulPurchaseResponseHandler,
        UnsuccessfulPurchaseResponseHandler,
        CancelPurchaseResponseHandler,
        ErrorPurchaseResponseHandler,
        SpecificQuestionIntentHandler,
        //FirstNameIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler // make sure IntentReflectorHandler is last so it doesn't override your custom intent handlers
        ) 
    .addErrorHandlers(ErrorHandler)
    .addRequestInterceptors(RequestLog)
    .addResponseInterceptors(ResponseLog)
    .withApiClient(new Alexa.DefaultApiClient())
    .lambda());
