/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a sample skill built with Amazon Alexa Skills nodejs
 * skill development kit.
 * This sample supports multiple languages (en-US, en-GB, de-GB).
 * The Intent Schema, Custom Slot and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-howto
 **/

'use strict';

const Alexa = require('alexa-sdk');
const recipes = require('./recipes');

const APP_ID = undefined; // TODO replace with your app ID (OPTIONAL).

const languageStrings = {
    'en': {
        translation: {
            RECIPES: recipes.RECIPE_EN_US,
            // TODO: Update these messages to customize.
            SKILL_NAME: 'Hank Aaron Runs Batted In',
            WELCOME_MESSAGE: "Welcome to Hank Aaron Runs batted in. Hank Aaron holds the major league baseball record for runs batted in with 2297 over his 23 year career from 1954 through 1976.  Pick a year and find out how many runs batted in Hank Aaron had that season.",
            WELCOME_REPROMPT: 'For instructions on what you can say, please say help me.',
            DISPLAY_CARD_TITLE: '%s  - RBIs in %s.',
            HELP_MESSAGE: "You can say a year like 1970, or, you can say stop...Now, what can I help you with?",
            HELP_REPROMPT: "You can say things like, RBIs in 1960, or you can say stop...Now, what can I help you with?",
            STOP_MESSAGE: 'Goodbye!',
            STATS_REPEAT_MESSAGE: 'Try saying repeat.',
            STATS_NOT_FOUND_MESSAGE: "Hank Aaron did not play that year. Please try a year between 1954 and 1976. ",
            STATS_NOT_FOUND_WITH_ITEM_NAME: 'Hank Aaron did not play in %s. Please try a year between 1954 and 1976. ',
            STATS_NOT_FOUND_WITHOUT_ITEM_NAME: 'Hank Aaron did not play that year. Please try a year between 1954 and 1976. ',
            STATS_NOT_FOUND_REPROMPT: 'What else can I help with?',
        },
    },
    'en-US': {
        translation: {
            RECIPES: recipes.RECIPE_EN_US,
            SKILL_NAME: 'Hank Aaron runs batted in',
        },
    },
    'en-GB': {
        translation: {
            RECIPES: recipes.RECIPE_EN_GB,
            SKILL_NAME: 'Hank Aaron runs batted in',
        },
    },
};

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

const handlers = {
    //Use LaunchRequest, instead of NewSession if you want to use the one-shot model
    // Alexa, ask [my-skill-invocation-name] to (do something)...
    'LaunchRequest': function () {
        this.attributes.speechOutput = this.t('WELCOME_MESSAGE', this.t('SKILL_NAME'));
        // If the user either does not reply to the welcome message or says something that is not
        // understood, they will be prompted again with this text.
        this.attributes.repromptSpeech = this.t('WELCOME_REPROMPT');

        this.response.speak(this.attributes.speechOutput).listen(this.attributes.repromptSpeech);
        this.emit(':responseReady');
    },
    'RecipeIntent': function () {
        console.log(JSON.stringify(this.event.request));
        const itemSlot = this.event.request.intent.slots.Item;
        let itemName;
        if (itemSlot && itemSlot.value) {
            itemName = itemSlot.value;
        }

        const cardTitle = this.t('DISPLAY_CARD_TITLE', this.t('SKILL_NAME'), itemName);
        const myRecipes = this.t('RECIPES');
        const recipe = myRecipes[itemName];

        if (recipe) {
            this.attributes.speechOutput = recipe;
            this.attributes.repromptSpeech = this.t('STATS_REPEAT_MESSAGE');

            this.response.speak(recipe);
            this.response.cardRenderer(cardTitle, recipe);
            this.emit(':responseReady');
        } else {
            let speechOutput = this.t('STATS_NOT_FOUND_MESSAGE');
            const repromptSpeech = this.t('STATS_NOT_FOUND_REPROMPT');
            if (itemName) {
                speechOutput = this.t('STATS_NOT_FOUND_WITH_ITEM_NAME', itemName);
            } else {
                speechOutput = this.t('STATS_NOT_FOUND_WITHOUT_ITEM_NAME');
            }

            this.attributes.speechOutput = speechOutput;
            this.attributes.repromptSpeech = repromptSpeech;

            this.response.speak(speechOutput).listen(repromptSpeech);
            this.emit(':responseReady');
        }
    },
    'AMAZON.HelpIntent': function () {
        this.attributes.speechOutput = this.t('HELP_MESSAGE');
        this.attributes.repromptSpeech = this.t('HELP_REPROMPT');

        this.response.speak(this.attributes.speechOutput).listen(this.attributes.repromptSpeech);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak("Goodbye");
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak("Goodbye");
        this.emit(':responseReady');
    },
  };
