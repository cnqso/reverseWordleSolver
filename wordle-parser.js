/** @format */

// import fetchData from "./data-fetcher.js"
import reverseSolver from "./reverse-solver.js"
let globalJsonData = {answers: {}, words: []};

//FOR TESTING
fetch('data.json')
  .then(response => response.json())
  .then(data => {
    console.log(data)
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


  const solution = reverseSolver(plainText, answer, globalJsonData.words); 
  // console.log(solution)
	return {
		wordleNumber,
		score,
		hardMode,
		plainText,
    answer,
    date,
	};
}
