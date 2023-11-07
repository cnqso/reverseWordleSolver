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

	const answerData = await fetchAnswers();
    const wordList = await fetchCommonWords();

	if (answerData && wordList) {
		const result = {answers: answerData, words: wordList};
        // createDownloadLink(result);
        return result;
	} else {
		console.error("JSON data not found");
		return false;
	}
}

async function fetchAnswers() {
	try {
		const response = await fetch(
			"https://raw.githubusercontent.com/cnqso/wordle-data/main/answers.json"
		);
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}
		const text = await response.text();
		const json = JSON.parse(text);
		return json;
	} catch (error) {
		console.error("Error fetching the text file:", error);
	}
}


async function fetchCommonWords() {
	try {
		const response = await fetch(
			"https://raw.githubusercontent.com/cnqso/wordle-data/main/word_frequency.json"
		);
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}
		const text = await response.text();
		const json = JSON.parse(text);
		return json;
	} catch (error) {
		console.error("Error fetching the text file:", error);
	}
}