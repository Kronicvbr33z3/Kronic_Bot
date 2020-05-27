/* eslint-disable space-infix-ops */
const snoowrap = require('snoowrap');
const Discord = require('discord.js');
const { userAgent, clientId, clientSecret, refreshToken } = require('../config.json');
const r = new snoowrap({
	userAgent: userAgent,
	clientId: clientId,
	clientSecret: clientSecret,
	refreshToken: refreshToken,
});

function between(min, max) {
	return Math.floor(
		Math.random() * (max-min+1) + min,
	);
}

module.exports = {
	name: 'aita',
	description: 'Random AITA Post with ',
	execute(message, args) {
		r.getSubreddit('AmItheAsshole').getRandomSubmission().then(myPost => {
			const pid = between(0, myPost.length);
			const str = myPost[pid].selftext;
			for (let i = 0; i < str.length; i += 2000) {
				const toSend = str.substring(i, Math.min(str.length, i + 2000));
				message.channel.send(toSend);
			}
			myPost[pid].fetch().then(submission => {
				const comments = new Discord.MessageEmbed()
					.setTitle('Comments')
					.setColor('#0099ff')
					.addFields(
						{ name: 'Upvotes', value: submission.comments[1].ups, inline: true },
						{ name: 'Comment', value: submission.comments[1].body, inline: true },
					)
					.addField('\u200b', '\u200b')
					.addFields(
						{ name: 'Upvotes', value: submission.comments[2].ups, inline: true },
						{ name: 'Comment', value: submission.comments[2].body, inline: true },
					)
					.addField('\u200b', '\u200b')
					.addFields(
						{ name: 'Upvotes', value: submission.comments[3].ups, inline: true },
						{ name: 'Comment', value: submission.comments[3].body, inline: true },
					)
					.setFooter('Kronic Bot');


				message.channel.send(comments);
			});
		});
	},
};