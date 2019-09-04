function getSmallCategoryImage(referenceName) {
    return "https://tko-trivia.s3.amazonaws.com/art/ISPs/" + referenceName + "_108.png"
}

function getLargeCategoryImage(referenceName) {
    return "https://tko-trivia.s3.amazonaws.com/art/ISPs/" + referenceName + "_512.png"
}

module.exports = {
    getSmallCategoryImage,
    getLargeCategoryImage
}