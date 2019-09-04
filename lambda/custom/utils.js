function getSmallCategoryImage(referenceName) {
    return "https://tko-trivia.s3.amazonaws.com/art/icons/" + referenceName + "_108.png"
}

function getLargeCategoryImage(referenceName) {
    return "https://tko-trivia.s3.amazonaws.com/art/icons/" + referenceName + "_512.png"
}

module.exports = {
    getSmallCategoryImage,
    getLargeCategoryImage
}