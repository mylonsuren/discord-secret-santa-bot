import secretSantaGenerator from "./secretSantaGenerator";
import sendToDiscord from "./sendToDiscord";

/**
 * Main script for generating secret santa draw
 */
if (secretSantaGenerator()) {
	console.log("INFO: Names drawn...");
	console.log("INFO: Sending drawn names on Discord...");
	sendToDiscord();
} else {
	console.error("ERROR: Unable to generate pairings!");
}
