'use strict';

const fs = require('fs');
let emoteData = require('./emote_data.json');

exports.respondEmoteStats = function(client, target) {
	emoteData[0].emotes.forEach(emote =>
		client.say(target, emote.name + ' : ' + emote.count));
}

exports.handleEmotes = function(msg, context) {
	const tokenizedMsg = msg.split(' ');

	let emotesFound = 0;
	tokenizedMsg.forEach(tok =>
		emotesFound += exports.checkEmote(tok, context));

	if (emotesFound > 0)
		exports.saveEmoteData();
}

exports.checkEmote = function(tok, context) {
  for (var iTier = 0; iTier < emoteData.length; iTier++) {
    for (var iEmote = 0; iEmote < emoteData[iTier].emotes.length; iEmote++) {
      if (tok == emoteData[iTier].emotes[iEmote].name) {
        emoteData[iTier].emotes[iEmote].count++;
        console.log('eh ~ ' + context['display-name'] + ' used ' + emoteData[iTier].emotes[iEmote].name);
        return 1;
      }
    }
  }
  return 0;
}

exports.saveEmoteData = function(bak) {
	let fileName = __dirname + '/emote_data.json';
	if (bak) {
		fileName += '.bak';
		console.log('eh ~ emote_data.json has been backed up to emote_data.json.bak');
	}  
	fs.writeFile(fileName, JSON.stringify(emoteData, null, 2), err => {
	    if (err) {
	      console.log(`eh ~ FATAL: There was an error saving emote_data.json...`);
	      throw err;
	    }
	  });
	console.log('eh ~ emote_data.json has been udpated.')
}

exports.resetEmoteData = function() {
	emoteData.forEach(tier =>
		tier.emotes.forEach(emote =>
			emote.count = 0));

  exports.saveEmoteData();

  console.log('eh ~ Emote data has been reset.');
}