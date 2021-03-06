# TKOTriviaAlexa
 
This is a full working sample of an advanced trivia skill for Amazon's Alexa.  It has a dependency on a data source, which is not included here, so you are free to review the design and code for this skill, but don't have access to the data structure or contents.

[You can view the Data tables here.](https://airtable.com/shrijc4aBxL8Z9TUq)</br>
[You can view the Speech tables here.](https://airtable.com/shrKRlq5XcZiLiplO)

Here are list of the features it includes:

* Ask for random trivia questions, across 20 different categories.
* Ask for questions from a specific category.
* Answer (and correctly validate) all trivia questions.
* Ask for the list of categories.
* Purchase any of the categories using in-skill purchases.
* Purchase a subscription that unlocks all categories, and shares correct answers when you answer incorrectly.
* Cancel subscription
* Earn points and level up at every increment of 1000.
* Ask for point and level status.
* Start the daily game, which presents the user with 10 brand-new questions.  Getting a question wrong ends the game.
* Uses dynamic entities to populate correct answers into the answer slot.
* Uses APL to build informative displays on devices with screens.
* Uses a variety of sound effects and speechcons to make the game more realistic and entertaining.
* Has a custom experience for first time users to get them directly to their first question.
* Stores all wrong answers, and any unhandled phrases to a database for future improvement and review.
* Randomizes all speech across hundreds of responses to keep the conversation fresh.
* Can repeat the previous statement at any point in the game.


The creation of this game has also provided a large amount of content in other regards.
* It is regularly referenced during weekly Alexa Office Hours.
* It is the reference code that I use for discussing Dynamic Entities.
* It leans heavily on Entity Resolution.
* It demonstrates best practices for upselling and offering ISPs.
* It illustrates how randomization of speech can make a skill more conversational.
* It uses several mechanisms for retention, including personalization, leaderboards, and daily activities.
* It leans heavily on calling 3rd party APIs for data.
* It has a large number of node.js helper functions which simplify future development.
* It effectively uses RequestInterceptor and ResponseInterceptors.


Let's think about a PRFAQ format for "presenting the project."
