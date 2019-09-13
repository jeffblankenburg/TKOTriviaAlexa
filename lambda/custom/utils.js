function getSmallCategoryImage(referenceName) {
    return "https://tko-trivia.s3.amazonaws.com/art/icons/" + referenceName + "_108.png"
}

function getLargeCategoryImage(referenceName) {
    return "https://tko-trivia.s3.amazonaws.com/art/icons/" + referenceName + "_512.png"
}

function getAPLVersion(handlerInput) {
    if ((handlerInput.requestEnvelope) &&
        (handlerInput.requestEnvelope.context) &&
        (handlerInput.requestEnvelope.context.System) &&
        (handlerInput.requestEnvelope.context.System.device) &&
        (handlerInput.requestEnvelope.context.System.device.supportedInterfaces) &&
        (handlerInput.requestEnvelope.context.System.device.supportedInterfaces["Alexa.Presentation.APL"]) &&
        (handlerInput.requestEnvelope.context.System.device.supportedInterfaces["Alexa.Presentation.APL"].runtime) &&
        (handlerInput.requestEnvelope.context.System.device.supportedInterfaces["Alexa.Presentation.APL"].runtime.maxVersion)) {
        return handlerInput.requestEnvelope.context.System.device.supportedInterfaces["Alexa.Presentation.APL"].runtime.maxVersion;
    } 
    return undefined;
}

function getDeviceId(handlerInput) {
    if ((handlerInput.requestEnvelope) &&
        (handlerInput.requestEnvelope.context) &&
        (handlerInput.requestEnvelope.context.System) &&
        (handlerInput.requestEnvelope.context.System.device) &&
        (handlerInput.requestEnvelope.context.System.device.deviceId)) {
        return handlerInput.requestEnvelope.context.System.device.deviceId;
    } 
    return undefined;
}

function getDisplayShape(handlerInput) {
    if ((handlerInput.requestEnvelope) &&
        (handlerInput.requestEnvelope.context) &&
        (handlerInput.requestEnvelope.context.Viewport) &&
        (handlerInput.requestEnvelope.context.Viewport.shape)) {
        return handlerInput.requestEnvelope.context.Viewport.shape;
    } 
    return undefined;
}

function getPixelWidth(handlerInput) {
    if ((handlerInput.requestEnvelope) &&
        (handlerInput.requestEnvelope.context) &&
        (handlerInput.requestEnvelope.context.Viewport) &&
        (handlerInput.requestEnvelope.context.Viewport.pixelWidth)) {
        return handlerInput.requestEnvelope.context.Viewport.pixelWidth;
    } 
    return undefined;
}

function getPixelHeight(handlerInput) {
    if ((handlerInput.requestEnvelope) &&
        (handlerInput.requestEnvelope.context) &&
        (handlerInput.requestEnvelope.context.Viewport) &&
        (handlerInput.requestEnvelope.context.Viewport.pixelHeight)) {
        return handlerInput.requestEnvelope.context.Viewport.pixelHeight;
    } 
    return undefined;
}

module.exports = {
    getSmallCategoryImage,
    getLargeCategoryImage,
    getAPLVersion,
    getDisplayShape,
    getPixelWidth,
    getPixelHeight,
    getDeviceId
}