import { ARGS, MSG_TYPES } from "./config";
import secretSantaGenerator from "./secretSantaGenerator";
import sendToDiscord from "./sendToDiscord";

/**
 * Draw names and send over Discord
 */
const drawSecretSanta = () => {
	if (secretSantaGenerator()) {
		console.log("INFO: Names drawn...");
		console.log("INFO: Sending drawn names on Discord...");
		sendToDiscord(MSG_TYPES.DRAWNAME);
	} else {
		console.error("ERROR: Unable to generate pairings!");
	}
};

/**
 *	Notify members over Discord
 */
const notifySecretSanta = () => {
	sendToDiscord(MSG_TYPES.NOTIFY);
};

// Main Script
const args = process.argv.slice(2);

switch (args[0].toLowerCase()) {
	case ARGS.DRAWNAME:
		drawSecretSanta();
		break;

	case ARGS.NOTIFY:
		notifySecretSanta();
		break;
}
