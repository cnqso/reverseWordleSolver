/** @format */


export default function reverseSolver(wordleString, answer, validWords) {
	// input: string of rights and wrongs, answer, validWords
	// Output 1. The 2D solution array 2. The index of the "optimal" solutions

	const wordleArray = wordleString.match(/.{1,5}/g);
	const [allPaths, checks, foundMatches] = bruteForceAllPaths(wordleArray, answer, validWords);
	let possiblePaths = allPaths[0].length;
	for (let i = 1; i < allPaths.length; i++) {
		possiblePaths = possiblePaths * allPaths[i].length;
	}
	const standards = {
		yellowNeglect: false,
		yellowRepeats: false,
		blankRepeats: false,
		allowRepeats: false,
	};

	let standardsMet = 4;
	let solution = depthWordleSearch("", allPaths, wordleArray, standards);
	if (solution === false) {
		standards.yellowNeglect = true;
		solution = depthWordleSearch("", allPaths, wordleArray, standards);
		standardsMet--;
	}
	if (solution === false) {
		standards.yellowRepeats = true;
		solution = depthWordleSearch("", allPaths, wordleArray, standards);
		standardsMet--;
	}
	if (solution === false) {
		standards.blankRepeats = true;
		solution = depthWordleSearch("", allPaths, wordleArray, standards);
		standardsMet--;
	}
	if (solution === false) {
		standards.allowRepeats = true;
		solution = depthWordleSearch("", allPaths, wordleArray, standards);
		standardsMet--;
	}
	if (solution === false) {
		console.log("No solution found");
		standardsMet--;
	}
	// try with different standards bla bla bla
	const solutionIndexes = [];
	for (let i = 0; i < solution.length; i++) {
		solutionIndexes.push(allPaths[i].indexOf(solution[i]));
	}
	solutionIndexes.push(0)
	return [allPaths, solutionIndexes, possiblePaths, checks, foundMatches, standardsMet];
}

function bruteForceAllPaths(wordleArray, answer, validWords) {
	// input: array of 5-letter sequences, answer, validWords
	// output: array of 5 arrays of words which match the sequence
	let checks = 0;
	let foundMatches = 0;
	const allPaths = [];
	for (let i = 0; i < wordleArray.length-1; i++) {
		const matches = [];
		const sequence = wordleArray[i];

		for (let j = 0; j < validWords.length; j++) {
			if (checks % 10000 === 0) {
				console.log(`Checked ${checks} words, found ${foundMatches} matches`);
			}
			checks++;
			if (wordMatchesSequence(validWords[j], sequence, answer)) {
				foundMatches++;
				matches.push(validWords[j]);
			}
		}
		allPaths.push(matches);
	}
	allPaths.push([answer])
	console.log(`Checked ${checks} words, found ${foundMatches} matches`);

	return [allPaths, checks, foundMatches];
}

function wordMatchesSequence(word, sequence, answer) {
	for (let i = 0; i < 5; i++) {
		if (sequence[i] === "B") {
			if (answer.includes(word[i])) {
				return false;
			}
		}
		if (sequence[i] === "G") {
			if (answer[i] !== word[i]) {
				return false;
			}
		}
		if (sequence[i] === "Y") {
			if (answer[i] === word[i]) {
				return false;
			}
			if (!answer.includes(word[i])) {
				return false;
			}
		}
	}
	return true;
}

function depthWordleSearch(
	currentWord,
	wordNodes,
	wordleArray,
	standards,
	currentRow = 0,
	blankLetters = [],
	yellowLetters = {},
	selectedWords = []
) {
	for (let i = 0; i < wordNodes[currentRow].length; i++) {
		let nextWord = wordNodes[currentRow][i];

		if (naturallyFollows(currentWord, nextWord, blankLetters, yellowLetters, standards)) {
			let newBlankLetters = [...blankLetters]; // Copy the blankLetters array
			let newYellowLetters = { ...yellowLetters }; // Copy the yellowLetters array
			let newSelectedWords = [...selectedWords, nextWord]; // Add the nextWord to the selectedWords array

			for (let i = 0; i < 5; i++) {
				if (wordleArray[currentRow][i] === "B") {
					newBlankLetters.push(nextWord[i]);
				}
				if (wordleArray[currentRow][i] === "Y") {
					if (newYellowLetters[nextWord[i]]) {
						newYellowLetters[nextWord[i]].push(i);
					} else {
						newYellowLetters[nextWord[i]] = [i];
					}
				}
			}

			if (currentRow === wordNodes.length - 2) {
				return newSelectedWords;
			} else {
				let result = depthWordleSearch(
					nextWord,
					wordNodes,
					wordleArray,
					standards,
					currentRow + 1,
					newBlankLetters,
					newYellowLetters,
					newSelectedWords
				);
				if (result) {
					return result;
				}
			}
		}
	}
	// console.log("No solution found at" + currentWord + " " + currentRow + selectedWords + blankLetters + yellowLetters)
	return false;
}

function naturallyFollows(currentWord, targetWord, blankLetters, yellowLetters, standards) {
	if (currentWord === targetWord && !standards.allowRepeats) {
		return false;
	}

	if (currentWord === "") {
		return true;
	}

	for (let i = 0; i < 5; i++) {
		if (blankLetters.includes(targetWord[i]) && !standards.blankRepeats) {
			return false;
		}
	}

	for (let i = 0; i < Object.keys(yellowLetters).length; i++) {
		const yellowLetter = Object.keys(yellowLetters)[i];

		// if we've seen a yellow square before, we expect to see it again
		if (!standards.yellowNeglect) {
			if (!targetWord.includes(yellowLetter)) {
				return false; //First to remove for sure
			}
		}
		// We expect users to place yellow letters in new squares
		if (!standards.repeats) {
			for (let j = 0; j < yellowLetters[yellowLetter].length; j++) {
				const visitedPosition = yellowLetters[yellowLetter][j];
				if (targetWord[visitedPosition] === yellowLetter) {
					return false;
				}
			}
		}
	}
	return true;
}

// Graph theory version:
// Start: just use the first starting word that makes sense.
// {Check any presented common starting words, otherwise just use the first good one}
// Store blank letters and yellow letters in a list

// MOST LIKELY PASS
// Ban all blank letters from consideration
// Ban all yellow repeats from consideration
// Potentially: Ban the use of yellow letters in former green squares,
// Require all yellows to be retried
// (We would require greens be reused, but we already have that data)

// LESS LIKELY PASSES
// 1. Do not require all yellows to be retried
// 2. Allow yellow repeats
// 3. Allow blank letters

// Depth-first search
// A node is a word, and you are trying to take the "shortest" path to the answer
// There are 12971 words, and 4 different types of checks. (All restrictions, allow yellow abandonment, allow yellow abandonment and yellow repeats, and no restrictions)
// You end up with a list of 51884 different paths from each node to the next, the vast majority of them are blocked off (do not match the block colors or restrictions)
// There are 4.7 septillion possible combinations

// Breadth-first search
// We could theoretically brute force all non-blocked paths then find the shortest one, which guarantees at least 12971 checks, but would reduce total checks on weird cases
// Each row now has a list of many words, probably 10-3000. Each word is a node, and the distance between nodes is determined by the constant value of the word and its adherence to restrictions.

//Start with the first row with the high value word
//Check the second row for words that match all restrictions from the first word. If there are none, go back one and try a new word.
//If there are some, continue: check for third-row words that match all restrictions from the second word. If there are none, go back one and try a new second-row word
//If you ever run out of words in a list, go back one. If you run out of words in the first list, start over but allow

// Mega simplified plan
// Brute force all words for each row that match the restrictions (12971-77826 total passes)
// Starting with the first word, create a list of all likely follow-up words (words in the next row's list that match all restrictions)
//
