require('dotenv').config();
const tmi = require('tmi.js');
const port = process.env.PORT || 1000;

const regexpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);

const commands = {
	website: {
		response: 'https://twitch.tv/TOPSilog_'
	}/* ,
	upvote: {
		response: (user) => `User ${user} was just upvoted`
	} */
}

const client = new tmi.Client({
	channels: [ 'TOPSilog_' ],
    identity: {
		username: process.env.TWITCH_BOT_USERNAME,
		password: process.env.TWITCH_OAUTH_TOKEN
	}
});

client.connect();

client.on('message', (channel, tags, message, self) => {
	const isNotBot = tags.username.toLowerCase() !== process.env.TWITCH_BOT_USERNAME;

    if (!isNotBot) return;

    const [raw, command, argument] = message.match(regexpCommand);

	const { response } = commands[command] || {};

	if ( typeof response === 'function') {
		client.say(channel, response(tags.username))
	} else if ( typeof response === 'string' ) {
		client.say(channel, response);
	}


    // "TOPSilog_: Hello, World!"
	console.log(`${tags['display-name']}: ${message}`);
});