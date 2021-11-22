/**
 * This module generates secret santa pairings and stores them in a JSON file.
 */

import * as fs from "fs";
import { Member } from "../interfaces/members";
import _ from "lodash";
import members from "../../data/members.json";

type FilteredList = Record<string, Array<string>>;

const memberNames: Array<string> = Object.keys(members);
const blacklist: FilteredList = {};
const validlist: FilteredList = {};

const matches: Record<string, string> = {};

/**
 * Updates valid list of potential matches to exclude a name
 * @param excludeName Name to be excluded from the valid list
 */
const updateValidlist = (excludeName: string) => {
	memberNames.forEach((member) => {
		const t = _.differenceWith(validlist[member], [excludeName]);

		validlist[member] = t;
	});
};

/**
 * Generates a blacklist of names for each member using
 * the names they have drawn in previous years
 */
const generateBlacklist = () => {
	const li_members: Array<Member> = [];
	_.forOwn(members, (member: Member) => {
		li_members.push(member);

		const bl: Array<string> = [];
		let vl: Array<string> = [];

		bl.push(member.name);

		_.forOwn(member.secret_santa, (name: string) => {
			bl.push(name);
		});

		vl = _.differenceWith(memberNames, bl);

		validlist[member.name] = vl;
		blacklist[member.name] = [...bl];
	});
};

/**
 * Draws names and generates matches for each member
 * @returns True if successful, False otherwise
 */
const drawNames = (): boolean => {
	let isSuccess = true;

	memberNames.forEach((member) => {
		const drawnName = _.sample(validlist[member]);

		if (drawnName === undefined) {
			console.error("ERROR: Invalid Match! Running generator again...");
			isSuccess = false;
		} else {
			updateValidlist(drawnName);
			matches[member] = drawnName;
		}
	});

	return isSuccess;
};

/**
 * Saves the drawn names to a JSON file
 * @returns True if successful, False otherwise
 */
const saveDrawnNames = (): boolean => {
	_.forOwn(members, (member: Member) => {
		member.secret_santa["2022"] = matches[member.name];
	});

	try {
		fs.writeFileSync("./data/members.json", JSON.stringify(members));
	} catch (e) {
		console.error(e);
		return false;
	}

	return true;
};

/**
 * Runs secret santa generator
 * @returns True if successful, False otherwise
 */
const secretSantaGenerator = (): boolean => {
	let isSuccess = true;

	do {
		generateBlacklist();
		isSuccess = drawNames();
	} while (!isSuccess);

	if (!saveDrawnNames()) {
		return false;
	}

	return true;
};

export default secretSantaGenerator;
