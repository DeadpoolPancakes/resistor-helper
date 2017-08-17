'use strict';

var Alexa = require('alexa-sdk');
var APP_ID = undefined; // TODO replace with your app ID (OPTIONAL).
var colors = {
    "RECIPE_EN_GB" : {
        "black": 0,
        "brown" : 1,
        "red" : 2,
        "orange": 3,
        "yellow": 4,
        "green": 5,
        "blue": 6,
        "violet": 7,
        "gray": 8,
        "white": 9
    }
}
var multipliers = {
    "RECIPE_EN_GB" : {
        "black": 1,
        "brown" : 10,
        "red" : 100,
        "orange": 1000,
        "yellow": 10000,
        "green": 100000,
        "blue": 1000000,
        "violet": 10000000
    }
}
var recipes = {
    "RECIPE_EN_GB" : {
        "10 ohm": "Brown, Black, Black",
        "20 ohm": "Red, Black, Black",
        "47 ohm": "Yellow, Violet, Black",
        "2.2 kilohm": "Red, Red, Red, Gold",
        "2.2 k": "Red, Red, Red, Gold",
        "4.7 k": "Yellow, Violet, Red",
        "4.7 kilohm": "Yellow, Violet, Red",
        "22 k": "Red, Red, Orange",
        "22 kilohm": "Red, Red, Orange",
        "47 k": "Yellow, Violet, Orange",
        "47 kilohm": "Yellow, Violet, Orange",
        "100 k": "Brown, Black, Yellow",
        "100 kilohm": "Brown, Black, Yellow",
        "220 k": "Red, Red, Yellow",
        "220 kilohm": "Red, Red, Yellow",
        "470 k": "Red, Red, Yellow",
        "470 kilohm": "Red, Red, Yellow",
        "1 megaohm": "Brown, Black, Green",
        "1 m": "Brown, Black, Green",
        "100 ohm": "Brown, Black, Brown,",
        "220 ohm": "Red, Red, Brown",
        "330 ohm": "Orange, Orange, Brown",
        "1 kilohm": "Brown, Black, Red",
        "1 k": "Brown, Black, Red",
        "10 k": "	Brown, Black, Orange",
        "10 kilohm": "	Brown, Black, Orange"
    },
    "RECIPE_EN_US" : {
        "10 ohm": "Brown, Black, Black",
        "20 ohm": "Red, Black, Black",
        "47 ohm": "Yellow, Violet, Black",
        "2.2 kilohm": "Red, Red, Red, Gold",
        "2.2 k": "Red, Red, Red, Gold",
        "4.7 k": "Yellow, Violet, Red",
        "4.7 kilohm": "Yellow, Violet, Red",
        "22 k": "Red, Red, Orange",
        "22 kilohm": "Red, Red, Orange",
        "47 k": "Yellow, Violet, Orange",
        "47 kilohm": "Yellow, Violet, Orange",
        "100 k": "Brown, Black, Yellow",
        "100 kilohm": "Brown, Black, Yellow",
        "220 k": "Red, Red, Yellow",
        "220 kilohm": "Red, Red, Yellow",
        "470 k": "Red, Red, Yellow",
        "470 kilohm": "Red, Red, Yellow",
        "1 megaohm": "Brown, Black, Green",
        "1 m": "Brown, Black, Green",
        "100 ohm": "Brown, Black, Brown,",
        "220 ohm": "Red, Red, Brown",
        "330 ohm": "Orange, Orange, Brown",
        "1 kilohm": "Brown, Black, Red",
        "1 k": "Brown, Black, Red",
        "10 k": "	Brown, Black, Orange",
        "10 kilohm": "	Brown, Black, Orange"
    },
    "RECIPE_DE_DE" : {
       
    }
};

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    //Use LaunchRequest, instead of NewSession if you want to use the one-shot model
    // Alexa, ask [my-skill-invocation-name] to (do something)...
    'LaunchRequest': function () {
        this.attributes['speechOutput'] = this.t("WELCOME_MESSAGE", this.t("SKILL_NAME"));
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        this.attributes['repromptSpeech'] = this.t("WELCOME_REPROMPT");
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    },
    'RecipeIntent': function () {
        var itemSlot = this.event.request.intent.slots.item;
        var itemName;
        var color1;
        var color2;
        var color3;
        if (itemSlot && itemSlot.value) {
            itemName = itemSlot.value.toLowerCase();
        }

        var cardTitle = this.t("DISPLAY_CARD_TITLE", this.t("SKILL_NAME"), itemName);
        var recipes = this.t("RECIPES");
        var recipe = recipes[itemName];
        var colorcode = function(color1, color2, color3){
                var i;
                var j;
                var m;
                i = colors[color1]
                j = colors[color2]
                m = multipliers[color3]

                return (i + j) * m;
        }


        if (recipe) {
            this.attributes['speechOutput'] = colorcode;
            this.attributes['repromptSpeech'] = this.t("RECIPE_REPEAT_MESSAGE");
            this.emit(':tellWithCard', colorcode, this.attributes['repromptSpeech'], cardTitle, colorcode);
        } else {
            var speechOutput = this.t("RECIPE_NOT_FOUND_MESSAGE");
            var repromptSpeech = this.t("RECIPE_NOT_FOUND_REPROMPT");
            if (itemName) {
                speechOutput += this.t("RECIPE_NOT_FOUND_WITH_ITEM_NAME", itemName);
            } else {
                speechOutput += this.t("RECIPE_NOT_FOUND_WITHOUT_ITEM_NAME");
            }
            speechOutput += repromptSpeech;

            this.attributes['speechOutput'] = speechOutput;
            this.attributes['repromptSpeech'] = repromptSpeech;

            this.emit(':ask', speechOutput, repromptSpeech);
        }
    },
    'AMAZON.HelpIntent': function () {
        this.attributes['speechOutput'] = this.t("HELP_MESSAGE");
        this.attributes['repromptSpeech'] = this.t("HELP_REPROMPT");
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    },
    'AMAZON.RepeatIntent': function () {
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    },
    'AMAZON.StopIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'AMAZON.CancelIntent': function () {
        this.emit('SessionEndedRequest');
    },
    'SessionEndedRequest':function () {
        this.emit(':tell', this.t("STOP_MESSAGE"));
    },
    'Unhandled': function () {
        this.attributes['speechOutput'] = this.t("HELP_MESSAGE");
        this.attributes['repromptSpeech'] = this.t("HELP_REPROMPT");
        this.emit(':ask', this.attributes['speechOutput'], this.attributes['repromptSpeech'])
    }
};

var languageStrings = {
    "en": {
        "translation": {
            "RECIPES": recipes.RECIPE_EN_US,
            "SKILL_NAME": "Resistor Helper",
            "WELCOME_MESSAGE": "Welcome to %s. You can ask a question like, what\'s the color code for a 10k resistor? ... Now, what can I help you with.",
            "WELCOME_REPROMPT": "For instructions on what you can say, please say help me.",
            "DISPLAY_CARD_TITLE": "%s  -  color code for  %s.",
            "HELP_MESSAGE": "You can ask questions such as, what\'s the color code, or, you can say exit...Now, what can I help you with?",
            "HELP_REPROMPT": "You can say things like, what\'s the color code, or you can say exit...Now, what can I help you with?",
            "STOP_MESSAGE": "Goodbye!",
            "RECIPE_REPEAT_MESSAGE": "Try saying repeat.",
            "RECIPE_NOT_FOUND_MESSAGE": "I\'m sorry, I currently do not know ",
            "RECIPE_NOT_FOUND_WITH_ITEM_NAME": "the color code for %s. ",
            "RECIPE_NOT_FOUND_WITHOUT_ITEM_NAME": "that color code. ",
            "RECIPE_NOT_FOUND_REPROMPT": "What else can I help with?"
        }
    },
    "en-US": {
        "translation": {
            "RECIPES" : recipes.RECIPE_EN_US,
            "SKILL_NAME" : "American Resistor Helper"
        }
    },
    "en-GB": {
        "translation": {
            "RECIPES": recipes.RECIPE_EN_GB,
            "SKILL_NAME": "British Resistor Helper"
        }
    },
    "de": {
        "translation": {
            "RECIPES" : recipes.RECIPE_DE_DE,
            "SKILL_NAME" : "Assistent für Resistor in Deutsch",
            "WELCOME_MESSAGE": "Willkommen bei %s. Du kannst beispielsweise die Frage stellen: Welche Rezepte gibt es für eine Truhe? ... Nun, womit kann ich dir helfen?",
            "WELCOME_REPROMPT": "Wenn du wissen möchtest, was du sagen kannst, sag einfach „Hilf mir“.",
            "DISPLAY_CARD_TITLE": "%s - Rezept für %s.",
            "HELP_MESSAGE": "Du kannst beispielsweise Fragen stellen wie „Wie geht das Rezept für“ oder du kannst „Beenden“ sagen ... Wie kann ich dir helfen?",
            "HELP_REPROMPT": "Du kannst beispielsweise Sachen sagen wie „Wie geht das Rezept für“ oder du kannst „Beenden“ sagen ... Wie kann ich dir helfen?",
            "STOP_MESSAGE": "Auf Wiedersehen!",
            "RECIPE_REPEAT_MESSAGE": "Sage einfach „Wiederholen“.",
            "RECIPE_NOT_FOUND_MESSAGE": "Tut mir leid, ich kenne derzeit ",
            "RECIPE_NOT_FOUND_WITH_ITEM_NAME": "das Rezept für %s nicht. ",
            "RECIPE_NOT_FOUND_WITHOUT_ITEM_NAME": "dieses Rezept nicht. ",
            "RECIPE_NOT_FOUND_REPROMPT": "Womit kann ich dir sonst helfen?"
        }
    }
};