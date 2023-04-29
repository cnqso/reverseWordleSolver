/** @format */

// import fetchData from "./data-fetcher.js"
import reverseSolver from "./reverse-solver.js"
let globalJsonData = {answers: {}, words: []};

//FOR TESTING
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    globalJsonData = data;
  });
//
// globalJsonData = await fetchData();
// console.log(globalJsonData)


const form = document.getElementById("wordle-form");
if (form) {
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!globalJsonData) {
      return;
    }
    const input = document.getElementById("wordle-input").value;
    const output = parseWordle(input);
    document.getElementById("output").innerText = JSON.stringify(output, null, 2);
  });
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
  const rawDate = new Date(firstDate.setDate(firstDate.getDate() + wordleNumber))
  const date = rawDate.toLocaleDateString("en-US", {year: 'numeric', month: 'long', day: 'numeric' })


  const [solutions, indexes, permutations, checks, matches, standardsMet] = reverseSolver(plainText, answer, globalJsonData.words); 


  // Not to forget: need to do a loop (probably just hard code it) that redoes it with different standards if it returns as false
  // Also: keep the starting word!
  // The grid needs 1. The wordle array (for height and color) 2. The 2D solution array 3. The index of the "optimal" solutions
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
    standardsMet
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
    square.textContent = solutions[startingIndex][i]
    square.style.backgroundColor = generateRandomColor(colors[i]); // Set background color
    row.appendChild(square);
  }

  const rightArrow = document.createElement("div");
  rightArrow.className = "arrow";
  rightArrow.textContent = ">";
  row.appendChild(rightArrow);

  const indexLabel = document.createElement("div");
  indexLabel.className = "indexLabel";
  indexLabel.textContent = `${startingIndex+1}/${solutions.length}`;
  row.appendChild(indexLabel)


  leftArrow.addEventListener("click", () => changeRowContents(row, rowNumber, -1, solutions));
  rightArrow.addEventListener("click", () => changeRowContents(row, rowNumber, 1, solutions));

  return row;
}

/* Modify the changeRowContents function */
function changeRowContents(row, rowNumber, direction, solutions) {
  const squares = row.querySelectorAll(".square");
  const indexLabel = row.querySelector(".indexLabel");
  const letters = Array.from(squares).map(square => square.textContent);
  const word = letters.join("");
  const currentIndex = solutions.indexOf(word);
  let newIndex = (currentIndex + direction) % solutions.length;
  if (newIndex < 0) {
    newIndex = solutions.length - 1;
  }
  if (newIndex >= solutions.length) {
    newIndex = 0;
  }
  indexLabel.textContent = `${newIndex+1}/${solutions.length}`;
  const newWord = solutions[newIndex];

  const colors = Array.from(squares).map(square => square.style.backgroundColor); // Store background colors
  for (let i = 0; i < squares.length; i++) {
    squares[i].textContent = newWord[i];
    squares[i].style.backgroundColor = colors[i]; // Update background color

    // Add flip animation and remove it after completion
    squares[i].classList.add("flip-animation");
    squares[i].addEventListener("animationend", () => {
      squares[i].classList.remove("flip-animation");
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
