const button = document.querySelector("button")
const imgEl = document.querySelector("#file-ip-1-preview")
const resultEl = document.querySelector(".result")
console.log("🚀 ~ file: script.js ~ line 4 ~ resultEl", resultEl)

const myUrl = "https://teachablemachine.withgoogle.com/models/6LrJvv3Pp/"

async function init() {
	const modelURL = myUrl + "model.json"
	const metadataURL = myUrl + "metadata.json"
	model = await tmImage.load(modelURL, metadataURL)
}

function showPreview(event) {
	if (event.target.files.length > 0) {
		var src = URL.createObjectURL(event.target.files[0])
		var preview = document.getElementById("file-ip-1-preview")
		preview.src = src
		preview.style.display = "block"
	}
}

async function predict() {
	const result = await model.predict(imgEl)
	result.sort((a, b) => b.probability - a.probability)
	console.log("🚀 ~ file: script.js ~ line 23 ~ predict ~ result", result)

	resultEl.innerHTML = result[0].className
}

button.addEventListener("click", () => {
	predict()
})

init()
