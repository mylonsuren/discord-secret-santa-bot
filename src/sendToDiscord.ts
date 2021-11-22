/**
 * This module sends the drawn names over Discord to each individual
 * user.
 */
import { BUDGET, DEBUG, YEAR } from "./config";
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

/**
 * Fetch user from Discord
 * @param member
 * @returns
 */
const fetchUser = async (member: Member): Promise<User> => {
	return await client.users.fetch(member.id);
};

/**
 * Sends message to user with their drawn name.
 * @param user User who will be receiving the message
 * @param drawnName Name of person who will be getting gift from user
 */
const sendMessage = async (user: User, drawnName: string) => {
	const SANTA_EMBED = new MessageEmbed()
		.setTitle(`Turtles Secret Santa ${YEAR}`)
		.setColor(0xb3000c)
		.setDescription(`You drew **${drawnName}**. \nBudget is $${BUDGET}.`);

	await user.send({ embeds: [SANTA_EMBED] });
	console.log(`DISCORD: Message sent to ${user.username}...`);
};

/**
 * Sends secret santa draw over Discord to each individual
 * @returns Number of messages sent
 */
const sendSecretSanta = async () => {
	const MYLON_USER = await fetchUser(members.Mylon);

	let numMsgSent = 0;

	const li_members: Array<Member> = [];
	_.forOwn(members, (member: Member) => li_members.push(member));

	li_members.forEach(async (member: Member) => {
		const ss_name = member.secret_santa[YEAR].toUpperCase();
		const user = await fetchUser(member);

		if (DEBUG) await sendMessage(MYLON_USER, ss_name);
		else await sendMessage(user, ss_name);

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
 * Sends drawn secret santa names to Discord
 */
const sendToDiscord = () => {
	client.on("ready", () => {
		console.log("DISCORD: Discord Client Ready");

		sendSecretSanta();
	});
};

client.login(auth.token);

export default sendToDiscord;
