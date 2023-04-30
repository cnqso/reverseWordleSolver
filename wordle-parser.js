/** @format */

// import fetchData from "./data-fetcher.js"
import reverseSolver from "./reverse-solver.js";
let globalJsonData = { answers: {}, words: [] };

//FOR TESTING
fetch("data.json")
	.then((response) => response.json())
	.then((data) => {
		globalJsonData = data;
	});
//
// globalJsonData = await fetchData();
// console.log(globalJsonData)

const textField = document.getElementById("wordle-input");
textField.addEventListener("focus", function() {
  if (true) {
    textField.textContent = "";
  }
});


const form = document.getElementById("wordle-form");
if (form) {
	form.addEventListener("submit", function (event) {
		event.preventDefault();
		if (!globalJsonData) {
			return;
		}
		const input = document.getElementById("wordle-input").value;
		const output = parseWordle(input);
		const outputDOM = parsedWordleToDOM(output);

    const results = document.getElementById("output")
    while (results.firstChild) {
      results.removeChild(results.firstChild);
    }
		results.appendChild(outputDOM);
	});
}

function parsedWordleToDOM(wordleObject) {
	const container = document.createElement("div");
	container.className = "container";

	const header = document.createElement("div");
	header.className = "header";

	const title = document.createElement("div");
	title.className = "resultsTitle";
	title.textContent = `Wordle #${wordleObject.wordleNumber} ${wordleObject.score}`;

	const date = document.createElement("div");
	date.className = "resultsDate";
	date.textContent = `${wordleObject.date}`;

	const answer = document.createElement("div");
	answer.textContent = `Answer: ${wordleObject.answer}`;

	const matches = document.createElement("div");
	matches.textContent = `Matching words: ${wordleObject.matches.toLocaleString()}`;

	const permutations = document.createElement("div");
	permutations.textContent = `Permutations: ${wordleObject.permutations.toLocaleString()}`;

  const extraInfo = document.createElement("pre");
  extraInfo.innerText = JSON.stringify(wordleObject, null, 2);
  extraInfo.style.display = "none";



	const button = document.createElement("button");
	button.textContent = "+";
  button.className = "extraInfo";
	button.addEventListener("click", () => {
		// Toggle the visibility of the JSON elements
		extraInfo.style.display = extraInfo.style.display === "none" ? "block" : "none";
    button.textContent = button.textContent === "+" ? "–" : "+";
	});

	header.appendChild(title);
	header.appendChild(date);
	header.appendChild(answer);
  
	header.appendChild(matches);
	header.appendChild(permutations);
  header.appendChild(button); // Add the button here
  header.appendChild(extraInfo); // Add the extra info here

	container.appendChild(header);

	return container;
}

function parseWordle(input) {
	const lines = input.trim().split("\n");
	const header = lines[0].split(" ");
	const wordleNumber = parseInt(header[1]);
	const score = header[2].replace("*", "");
	const hardMode = header[2].includes("*");

	const grid = lines.slice(1);
	const linear = grid.join("").replace(/[\n\s]/g, "");

	let plainText = "";

	for (let i = 0; i < linear.length; i++) {
		const char = linear[i].charCodeAt(0);
		if (char === 11035) {
			plainText += "B";
		}
		if (char === 57320) {
			plainText += "Y";
		}
		if (char === 57321) {
			plainText += "G";
		}
	}

	let answer = "";

	if (globalJsonData.answers) {
		if (globalJsonData.answers[wordleNumber]) {
			answer = globalJsonData.answers[wordleNumber];
		} else {
			answer = "";
		}
	}

	const firstDate = new Date(2021, 5, 19);
	const rawDate = new Date(firstDate.setDate(firstDate.getDate() + wordleNumber));
	const date = rawDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

	const [solutions, indexes, permutations, checks, matches, standardsMet] = reverseSolver(
		plainText,
		answer,
		globalJsonData.words
	);

	createGrid(solutions, indexes, plainText);

	return {
		wordleNumber,
		score,
		hardMode,
		plainText,
		answer,
		date,
		permutations,
		checks,
		matches,
		standardsMet,
	};
}

function generateRandomColor(color) {
	if (color === "G") {
		return "#538D4E";
	}
	if (color === "Y") {
		return "#B59F3B";
	}
	return "#3A3A3C";
}

function createRow(solutions, startingIndex, colors, rowNumber) {
	const row = document.createElement("div");
	row.style.display = "flex";

	const leftArrow = document.createElement("div");
	leftArrow.className = "arrow";
	leftArrow.textContent = "<";
	row.appendChild(leftArrow);

	for (let i = 0; i < 5; i++) {
		const square = document.createElement("div");
		square.className = "square";
		square.textContent = solutions[startingIndex][i];
		square.style.backgroundColor = generateRandomColor(colors[i]); // Set background color
		row.appendChild(square);
	}

	const rightArrow = document.createElement("div");
	rightArrow.className = "arrow";
	rightArrow.textContent = ">";
	row.appendChild(rightArrow);

	const indexLabel = document.createElement("div");
	indexLabel.className = "indexLabel";
	indexLabel.textContent = `${startingIndex + 1}/${solutions.length}`;
	row.appendChild(indexLabel);

	leftArrow.addEventListener("click", () => changeRowContents(row, rowNumber, -1, solutions));
	rightArrow.addEventListener("click", () => changeRowContents(row, rowNumber, 1, solutions));

	return row;
}

/* Modify the changeRowContents function */
function changeRowContents(row, rowNumber, direction, solutions) {
	const squares = row.querySelectorAll(".square");
	const indexLabel = row.querySelector(".indexLabel");
	const letters = Array.from(squares).map((square) => square.textContent);
	const word = letters.join("");
	const currentIndex = solutions.indexOf(word);
	let newIndex = (currentIndex + direction) % solutions.length;
	if (newIndex < 0) {
		newIndex = solutions.length - 1;
	}
	if (newIndex >= solutions.length) {
		newIndex = 0;
	}
	indexLabel.textContent = `${newIndex + 1}/${solutions.length}`;
	const newWord = solutions[newIndex];

	const colors = Array.from(squares).map((square) => square.style.backgroundColor); // Store background colors

	// Flip out, once animation is finished remove flip-out class, switch letters, then flip in
	for (let i = 0; i < squares.length; i++) {
		squares[i].classList.add("flip-out-animation");
		squares[i].addEventListener("animationend", () => {
			squares[i].classList.remove("flip-out-animation");
			squares[i].textContent = newWord[i];
			squares[i].classList.add("flip-in-animation");
			squares[i].addEventListener("animationend", () => {
				squares[i].classList.remove("flip-in-animation");
			});
		});
	}
}

function createGrid(solutions, indexes, colorText) {
	const numRows = Math.floor(colorText.length / 5);
	const colorsArray = colorText.match(/.{1,5}/g);
	const gridContainer = document.getElementById("grid-container");
	// Clear the existing grid
	while (gridContainer.firstChild) {
		gridContainer.removeChild(gridContainer.firstChild);
	}
	for (let i = 0; i < numRows; i++) {
		gridContainer.appendChild(createRow(solutions[i], indexes[i], colorsArray[i], i));
	}
}
