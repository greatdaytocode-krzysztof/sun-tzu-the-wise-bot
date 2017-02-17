var fs = require('fs');
var RtmClient = require('@slack/client').RtmClient;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;

var bot_token = process.env.SLACK_BOT_TOKEN || '';
var rtm = new RtmClient(bot_token);

var sensei = {};

let stripsOfWisdom = loadTheBookOfWisdom();

proveYouAreTheRealSunTzu();
wakeUpFromTheSpiritualMeditation();
becomeAllEarsToTheUnenlightened();

function loadTheBookOfWisdom() {
    let theScrollOfEnlightenedQuotes = fs.readFileSync('.quotes', { encoding: 'utf8' });
    // cutting the scroll into Strips of Wisdom
    let stripsOfWisdom = theScrollOfEnlightenedQuotes.split('\n');
    return stripsOfWisdom;
}

function proveYouAreTheRealSunTzu() {
    rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) => {
        let self = rtmStartData.self;
        sensei.id = self.id;
        sensei.name = self.name
        console.log(`Logged in as ${sensei.name} of team ${rtmStartData.team.name}`);
    });
}

function becomeAllEarsToTheUnenlightened() {
    rtm.on(RTM_EVENTS.MESSAGE, (message) => {
        let troubleInQuestion = message;
        rtm.sendMessage(seekForAComfortingPieceOfWisdom(troubleInQuestion.text), troubleInQuestion.channel);
    });
}

function wakeUpFromTheSpiritualMeditation() {
    rtm.start();
}

function seekForAComfortingPieceOfWisdom(troubleInQuestion) {
    console.log(troubleInQuestion);
    let sunTzuReply = stripsOfWisdom[Math.floor(Math.random() * stripsOfWisdom.length)].trim();
    return `"${sunTzuReply}"`;
}