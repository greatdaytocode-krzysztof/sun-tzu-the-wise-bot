const fs = require('fs');
const Botkit = require('botkit');

const MEDITATION_IMAGES = [
    'https://s31.postimg.org/eoab5zr8b/meditation_1.gif',
    'https://s27.postimg.org/51wh7x1oz/meditation_2.gif',
    'https://s7.postimg.org/56my6p24b/meditation_4.gif',
    'https://s13.postimg.org/h940mdu5z/meditation_5.gif',
    'https://s27.postimg.org/d1cigvur7/meditation_6.gif'
];

const MEDITATION_PHRASES = [
    "Sun Tzu looks at the stars, wondering...",
    "Sun Tzu lifts a small rock and ponders...",
    "General's face froze thoughtfully...",
    "General looks inside you, give him a moment...",
    "Sun Tzu pats a wild horse on its back, then submerges into a pond to give himself to a meditation...",
    "Troubling matter indeed! Sun Tzu squeezes some morning dew from a moss on his forehead and contemplates...",
    "Sun Tzu opens up his 10th chakra and asks the Wisdom Dragon out to consult your problem with...",
    "Sun Tzu frowns in silence..."
];

var controller = Botkit.slackbot({
    json_file_store: './data/',
    debug: false,
    stats_optout: true
});

controller.configureSlackApp({
   clientId: process.env.CLIENT_ID,
   clientSecret: process.env.CLIENT_SECRET,
   redirectUri: process.env.OAUTH_REDIRECT_URI,
   scopes: ['bot']
});

controller.setupWebserver(process.env.PORT, (err, webserver) => {
    controller.createOauthEndpoints(controller.webserver, (err, req, res) => { })
});

var _bots = {};
function trackBot(bot) {
  _bots[bot.config.token] = bot;
}

controller.on('create_bot',function(bot,config) {

  if (_bots[bot.config.token]) {
    // already online! do nothing.
  } else {
    bot.startRTM(function(err) {

      if (!err) {
        trackBot(bot);
      }

    });
  }

});

controller.storage.teams.all(function(err,teams) {

  if (err) {
    throw new Error(err);
  }

  // connect all teams with bots up to slack!
  for (var t  in teams) {
    if (teams[t].bot) {
      controller.spawn(teams[t]).startRTM(function(err, bot) {
        if (err) {
          console.log('Error connecting bot to Slack:',err);
        } else {
          trackBot(bot);
        }
      });
    }
  }

});

let stripsOfWisdom = readTheBookOfWisdom();
becomeAllEarsToTheUnenlightened();

function readTheBookOfWisdom() {
    let theScrollOfEnlightenedQuotes = fs.readFileSync('./quotes', { encoding: 'utf8' });
    // cutting the scroll into Strips of Wisdom
    let stripsOfWisdom = theScrollOfEnlightenedQuotes.split('\n');
    return stripsOfWisdom;
}

function becomeAllEarsToTheUnenlightened() {
    controller.hears('.*', ['direct_message', 'direct_mention', 'mention'], (bot,message) => {
        console.log('Received a message', message);

        let troubleInQuestion = message;
        let meditatingMessage = {
           "text": pick(MEDITATION_PHRASES),
            "attachments": [
                {
                    "fallback": "Sun Tzu's inspired message should reveal itself here",
                    "color": "#36a64f",
                    "image_url": pick(MEDITATION_IMAGES)
                }
            ]
        };

        bot.replyAndUpdate(message, meditatingMessage, (err, sentMessage, updateCb) => {
            let inspiredReply = seekForAComfortingPieceOfWisdom(troubleInQuestion.text);

            setTimeout(() => {
                updateCb({
                    attachments: [
                        {
                            "fallback": "Sun Tzu's inspired message should reveal itself here",
                            "text": inspiredReply,
                            "color": "#36a64f",
                            "footer": "Sun Tzu, The Art of War",
                        }
                    ]
                });
            }, 8000);
        });
    });
}

function seekForAComfortingPieceOfWisdom(troubleInQuestion) {
    console.log(troubleInQuestion);
    let sunTzuReply = pick(stripsOfWisdom).trim();
    return `"${sunTzuReply}"`;
}

function pick(collection) {
    return collection[pickANumber(collection.length)];
}

function pickANumber(maximum) {
    return Math.floor(Math.random() * maximum);
}