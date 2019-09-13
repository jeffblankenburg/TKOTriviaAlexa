const https = require("https");
const AchievementSound = "<audio src='soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_positive_response_02'/>"
var AchievementSpeech = "";
var AchievementCardText = "";  //TODO: WRITE A CARD WHEN THEY GET ANY ACHIEVEMENTS.
var AchievementCount = 0;

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

async function check(handlerInput) {
    console.log("CHECKING FOR ACHIEVEMENTS");
    AchievementSpeech = "";
    AchievementCount = 0;
    CheckSessionAchievements(handlerInput);
    CheckRequestAchievements(handlerInput);
    CheckDeviceAchievements(handlerInput);
    CheckIntentAchievements(handlerInput);
    await CheckCategoryAchievements(handlerInput);
    if (AchievementCount > 5) ReplaceSounds(handlerInput);
}

function CheckSessionAchievements(handlerInput) {
    console.log("CHECKING SESSION ACHIEVEMENTS");
}

function CheckRequestAchievements(handlerInput) {
    console.log("CHECKING REQUEST ACHIEVEMENTS");
}

function CheckDeviceAchievements(handlerInput) {
    console.log("CHECKING DEVICE ACHIEVEMENTS");
}

function CheckIntentAchievements(handlerInput) {
    console.log("CHECKING INTENT ACHIEVEMENTS")
}

async function CheckCategoryAchievements(handlerInput) {
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    const answers = await httpGet(process.env.airtable_base_data, "&filterByFormula=AND(User%3D%22" + encodeURIComponent(sessionAttributes.user.RecordId) + "%22)", "UserAnswer");
    console.log("ANSWERS = " + JSON.stringify(answers));
    var categoryTotals = [];
    var currentCategory = "";
    var currentCategoryCounter = 0;
    answers.records.forEach(function(a) {
        console.log("CHECKING ANSWER " + JSON.stringify(a));
        if (a.fields.Category[0] != currentCategory) {
            if (currentCategory != "") categoryTotals.push({"categoryId": currentCategory, "categoryName": getCategoryName(currentCategory), "count": currentCategoryCounter});
            currentCategoryCounter = 0;
            currentCategory = a.fields.Category[0];
        }
        currentCategoryCounter++;
    });
    if (currentCategoryCounter > 0) categoryTotals.push({"categoryId": currentCategory, "categoryName": getCategoryName(currentCategory), "count": currentCategoryCounter});

    categoryTotals.forEach(function(c) {
        if (c.count >= 10) CreateAchievement(handlerInput, c.categoryName + "10");
        else if (c.count >= 5) CreateAchievement(handlerInput, c.categoryName + "5");
    });


    console.log("CATEGORY COUNT = " + JSON.stringify(categoryTotals));
}

function getCategoryName(categoryId) {
    var category = categories.find(o => o.id === categoryId);
    return category.speechName.toUpperCase().replace(" ", "").replace(" ", "");
}

async function CreateAchievement(handlerInput, achievementId) {
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    if (IsAchievementIncomplete(handlerInput, achievementId)) {
        console.log("USER COMPLETED ACHIEVEMENT " + achievementId);
        //TODO: IF THE USER HASN'T PREVIOUSLY COMPLETED THE ACHIEVEMENT, AWARD THEM, AND RETURN THE SPEECH THAT SHOULD BE SPOKEN.
    }
    else console.log("USER HAS ALREADY COMPLETED ACHIEVEMENT " + achievementId + ".");
}

function IsAchievementIncomplete(handlerInput, achievementId) {
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    if (sessionAttributes.user.userAchievement != undefined) {
        sessionAttributes.user.userAchievement.forEach(function (a) {
            if (a.AchievementId === achievementId) return false;
        });
    }
    return true;
}

module.exports = {
    check
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

    console.log("FULL PATH = http://" + options.host + options.path);
    
    return new Promise(((resolve, reject) => {
      const request = https.request(options, (response) => {
        response.setEncoding("utf8");
        let returnData = "";

  
        if (response.statusCode < 200 || response.statusCode >= 300) {
          return reject(new Error(`${response.statusCode}: ${response.req.getHeader("host")} ${response.req.path}`));
        }
        
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