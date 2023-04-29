/** @format */

async function fetchHTML(url) {
	const response = await fetch(url);
	const htmlText = await response.text();
	return htmlText;
}

// Function to extract JSON data from the HTML
function extractJSON(htmlText) {
	const parser = new DOMParser();
	const doc = parser.parseFromString(htmlText, "text/html");
	const scriptTags = doc.getElementsByTagName("script");

	for (const scriptTag of scriptTags) {
		if (scriptTag.textContent.includes("var ssr_cache=")) {
			const jsonMatch = scriptTag.textContent.match(/JSON\.parse\((.*?)\)/);
			if (jsonMatch) {
				const jsonString = jsonMatch[1];
				const jsonData = JSON.parse(jsonString);
				return jsonData;
			}
		}
	}
}

function restructureData(jsonstring) {
	const jsonData = JSON.parse(jsonstring);
	const result = {};

	// Add today's data
	result[jsonData.data.today.index] = jsonData.data.today.answer;

	// Add past data
	jsonData.data.past.forEach((monthData) => {
		monthData.answers.forEach((answerData) => {
			result[answerData.index] = answerData.answer;
		});
	});

	return result;
}

async function fetchTextFile() {
	try {
		const response = await fetch(
			"https://raw.githubusercontent.com/cnqso/wordleviewer/main/iPhoneWordleExtractor/mostCommonWords.txt"
		);
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}
		const text = await response.text();
		return text;
	} catch (error) {
		console.error("Error fetching the text file:", error);
	}
}

async function exportTextAsList() {
	const fileContent = await fetchTextFile();
	const wordList = fileContent.split("\n");
	return wordList;
}

function createDownloadLink(jsonData) {
    const dataStr = JSON.stringify(jsonData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const dataUrl = URL.createObjectURL(dataBlob);
  
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'data.json';
    link.textContent = 'Download JSON data';
    document.body.appendChild(link);
  }
  


export default async function fetchData() {
	const url = "https://wordfinder.yourdictionary.com/wordle/answers/"; // Replace this with the target website URL
	const htmlText = await fetchHTML(url);
	const answerData = extractJSON(htmlText);
    const wordList = await exportTextAsList();

	if (answerData && wordList) {
		const flattenedAnswerData = restructureData(answerData);
		const result = {answers: flattenedAnswerData, words: wordList};
        createDownloadLink(result);
        return result;
	} else {
		console.error("JSON data not found");
	}
}
