/**
 * This module sends the drawn names over Discord to each individual
 * user.
 */
import { BUDGET, DEBUG, MSG_TYPES, READ_YEAR } from "./config";
import { Client, Intents, MessageEmbed, User } from "discord.js";
import { Member } from "../interfaces/members";
import _ from "lodash";
import auth from "../../data/auth.json";
import members from "../../data/members.json";

// Discord Client
const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.DIRECT_MESSAGES,
		Intents.FLAGS.GUILD_MEMBERS,
	],
});

// List of Members
const li_members: Array<Member> = [];

/**
 * Fetch user from Discord
 * @param member
 * @returns
 */
const fetchUser = async (member: Member): Promise<User> => {
	return await client.users.fetch(member.id);
};

/**
 * Sends embedded message to user
 * @param user User who will receive message
 * @param title Title of the message
 * @param content Content of the message
 */
const sendMessage = async (user: User, title: string, content: string) => {
	const SANTA_EMBED = new MessageEmbed()
		.setTitle(title)
		.setColor(0xb3000c)
		.setDescription(content);

	await user.send({ embeds: [SANTA_EMBED] });
	console.log(`DISCORD: Message sent to ${user.username}...`);
};

/**
 * Sends secret santa draw over Discord to each individual
 */
const sendDrawnNames = async () => {
	const MYLON_USER = await fetchUser(members.Mylon);

	let numMsgSent = 0;

	li_members.forEach(async (member: Member) => {
		const drawnName = member.secret_santa[READ_YEAR].toUpperCase();
		const user = await fetchUser(member);

		const title = `Turtles Secret Santa ${READ_YEAR}`;
		const content = `You drew **${drawnName}**. \nBudget is $${BUDGET}.`;

		if (DEBUG) await sendMessage(MYLON_USER, title, content);
		else await sendMessage(user, title, content);

		numMsgSent += 1;

		if (numMsgSent === li_members.length) {
			setTimeout(() => {
				console.log(`DISCORD: All ${numMsgSent} messages sent!`);
				process.exit(1);
			}, 5000);
		}
	});
};

/**
 * Sends notifications to all members over Discord
 */
const sendNotification = async () => {
	const MYLON_USER = await fetchUser(members.Mylon);
	const title = `Turtles ${READ_YEAR} Secret Santa Reminder`;

	let numMsgSent = 0;

	li_members.forEach(async (member: Member) => {
		const user = await fetchUser(member);

		const content = `...`;		// TODO: Update content and images and files if necessary

		if (DEBUG) await sendMessage(MYLON_USER, title, content);
		else await sendMessage(user, title, content);

		numMsgSent += 1;

		if (numMsgSent === li_members.length) {
			setTimeout(() => {
				console.log(`DISCORD: All ${numMsgSent} messages sent!`);
				process.exit(1);
			}, 5000);
		}
	});
};

/**
 * Sends to Discord
 * @param type MSG_TYPE
 */
const sendToDiscord = (type: number) => {
	_.forOwn(members, (member: Member) => li_members.push(member));

	client.on("ready", () => {
		console.log("DISCORD: Discord Client Ready");

		switch (type) {
			case MSG_TYPES.DRAWNAME:
				sendDrawnNames();
				break;
			case MSG_TYPES.NOTIFY:
				sendNotification();
				break;
		}
	});
};

client.login(auth.token);

export default sendToDiscord;
