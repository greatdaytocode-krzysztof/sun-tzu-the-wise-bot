var fs = require('fs');
var RtmClient = require('@slack/client').RtmClient;
var WebClient = require('@slack/client').WebClient;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;

var bot_token = process.env.SLACK_BOT_TOKEN || '';
var rtm = new RtmClient(bot_token);
var web = new WebClient(bot_token);

const meditationImages = [
    'https://s31.postimg.org/eoab5zr8b/meditation_1.gif',
    'https://s27.postimg.org/51wh7x1oz/meditation_2.gif',
    'https://s7.postimg.org/56my6p24b/meditation_4.gif',
    'https://s13.postimg.org/h940mdu5z/meditation_5.gif',
    'https://s27.postimg.org/d1cigvur7/meditation_6.gif'
];

const meditationPhrases = [
    "Sun Tzu looks at the stars, wondering...",
    "Sun Tzu lifts a small rock and ponders...",
    "General's face froze thoughtfully...",
    "General looks inside you, give him a moment...",
    "Sun Tzu pats a wild horse on its back, then submerges into a pond to give himself to a meditation...",
    "Troubling matter indeed! Sun Tzu squeezes some morning dew from a moss on his forehead and contemplates...",
    "Sun Tzu opens up his 10th chakra and asks the Wisdom Dragon out to consult your problem with...",
    "Sun Tzu frowns in silence..."
];

var sensei = {};

let stripsOfWisdom = readTheBookOfWisdom();

proveYouAreTheRealSunTzu();
wakeUpFromTheSpiritualMeditation();
becomeAllEarsToTheUnenlightened();

function readTheBookOfWisdom() {
    let theScrollOfEnlightenedQuotes = fs.readFileSync('./quotes', { encoding: 'utf8' });
    // cutting the scroll into Strips of Wisdom
    let stripsOfWisdom = theScrollOfEnlightenedQuotes.split('\n');
    return stripsOfWisdom;
}

function proveYouAreTheRealSunTzu() {
    rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) => {
        let self = rtmStartData.self;
        sensei.id = self.id;
        sensei.name = self.name;
        console.log(`Logged in as ${sensei.name} of team ${rtmStartData.team.name}`);
    });
}

function becomeAllEarsToTheUnenlightened() {
    rtm.on(RTM_EVENTS.MESSAGE, (message) => {

        if ('bot_message' === message.subtype || 'message_changed' === message.subtype) {
            // Ignore the message if it comes from Sun Tzu itself
            return;
        }

        meditate(message, honorYourAudienceWithAWiseSentence);
    });
}

function meditate(message, callback) {
    let meditatingMessage = {
        "attachments": [
            {
                "fallback": "Sun Tzu's inspired message should reveal itself here",
                "title": pick(meditationPhrases),
                "color": "#36a64f",
                "image_url": pick(meditationImages),
                "ts": 123456789
            }
        ]
    };

    web.chat.postMessage(message.channel, "", meditatingMessage, (err, data) => {
        setTimeout(() => callback(data), 8000);
    });

}

function honorYourAudienceWithAWiseSentence(data) {
    let inspiredReply = seekForAComfortingPieceOfWisdom();
    web.chat.update(data.ts, data.channel, '', {
        attachments: [
            {
                "fallback": "Sun Tzu's inspired message should reveal itself here",
                "text": inspiredReply,
                "color": "#36a64f",
                "footer": "Sun Tzu, The Art of War",
            }
        ]
    });
}

function wakeUpFromTheSpiritualMeditation() {
    rtm.start();
}

function seekForAComfortingPieceOfWisdom() {
    let sunTzuReply = pick(stripsOfWisdom).trim();
    return `"${sunTzuReply}"`;
}

function pick(collection) {
    return collection[pickANumber(collection.length)];
}

function pickANumber(maximum) {
    return Math.floor(Math.random() * maximum);
}