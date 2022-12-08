import { useEffect, useState, useRef } from "react"
import "./App.css"
import * as tf from "@tensorflow/tfjs"
import * as tmImage from "@teachablemachine/image"

const url = "https://teachablemachine.withgoogle.com/models/6LrJvv3Pp/"

const list = {
	"bánh mì": {
		url: "https://cdn.tgdd.vn/2021/05/CookRecipe/Avatar/banh-mi-thit-bo-nuong-thumbnail-1.jpg",
		desc: 'In Vietnamese cuisine, bánh mì or banh mi (/ˈbɑːn miː/,[2][3][4][5] /ˈbæn/;[6][5] Vietnamese: [ɓǎjŋ̟ mì], "bread") is a short baguette with thin, crisp crust and soft, airy texture. It is often split lengthwise and filled with savory ingredients like a submarine sandwich and served as a meal, called bánh mì thịt. Plain banh mi is also eaten as a staple food.',
	},
	"bánh xèo": {
		url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Banh_Xeo_with_fish_sauce_and_vegetables.jpg/375px-Banh_Xeo_with_fish_sauce_and_vegetables.jpg",
		desc: `Bánh xèo(Vietnamese: [ɓǎjŋ̟ sɛ̂w], lit. sizzling pancake) is a crispy, stuffed rice pancake popular in Vietnam.[1] The name refers to the sound(from xèo – 'sizzling') the rice batter makes when it is poured into the hot skillet.[2][3] It is a savoury fried pancake made of rice flour, water, and turmeric powder.It can also be called a Vietnamese crêpe.[4][5] Some common stuffings include pork, prawns, diced green onion, mung bean, and bean sprouts.Bánh xèo is also served with lettuce, mint, Asian basil, and fish mint`,
	},
	"cơm tấm": {
		url: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/C%C6%A1m_T%E1%BA%A5m%2C_Da_Nang%2C_Vietnam.jpg/375px-C%C6%A1m_T%E1%BA%A5m%2C_Da_Nang%2C_Vietnam.jpg",
		desc: `Cơm tấm or com tam (US: /kʌm təm/; Vietnamese: [kəːm tə̌m]) is a Vietnamese dish made from rice with fractured rice grains. Tấm refers to the broken rice grains, while cơm refers to cooked rice.[1][2] Although there are varied names like cơm tấm Sài Gòn (Saigon-style broken rice), particularly for Saigon,[1] the main ingredients remain the same for most cases.`,
	},
	"bún đậu mắm tôm": {
		url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/B%C3%BAn_%C4%91%E1%BA%ADu_m%E1%BA%AFm_t%C3%B4m_%282019%29.jpg/375px-B%C3%BAn_%C4%91%E1%BA%ADu_m%E1%BA%AFm_t%C3%B4m_%282019%29.jpg",
		desc: `Bún đậu mắm tôm is a simple and rustic dish in Northern Vietnamese cuisine. This dish is often used as a snack or snack. The main ingredients include fresh vermicelli, fried tofu, fried rice, spring rolls, doi dog, shrimp paste mixed with lemon, chili and served with herbs such as perilla, marjoram, basil, lettuce, tomato. cannon...[1] Like other folk dishes, the price is cheap, so it is eaten by many ordinary people, so the income of the people selling these dishes is quite high.`,
	},
	phở: {
		url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Pho_quay.JPG/375px-Pho_quay.JPG",
		desc: `Phở or pho[2] (UK: /fɜː/, US: /fʌ/, Canada: /fɔː/;[3] Vietnamese: [fəː˧˩˧] (listen)) is a Vietnamese soup dish consisting of broth, rice noodles (bánh phở), herbs, and meat (usually beef (phở bò), sometimes chicken (phở gà)).[4][5] Pho is a popular food in Vietnam[6] where it is served in households, street stalls and restaurants countrywide. Nam Định people were the first to create Vietnamese traditional pho. Pho is considered Vietnam's national dish.[7]`,
	},
}

function App() {
	const imgRef = useRef()
	const [previewUrl, setPreviewUrl] = useState("")
	const [uploadFileUrl, setUploadFileUrl] = useState()
	const [model, setModel] = useState()
	const [heading, setHeading] = useState("Food detection")
	const [detected, setDetected] = useState(false)
	const [info, setInfo] = useState()

	useEffect(() => {
		async function loadModel() {
			const modelURL = url + "model.json"
			const metadataURL = url + "metadata.json"
			const tfModel = await tmImage.load(modelURL, metadataURL)
			setModel(tfModel)
		}
		loadModel()
	}, [])

	useEffect(() => {
		setPreviewUrl(uploadFileUrl)
	}, [uploadFileUrl])

	function changeFileHandler(e) {
		if (e.target.files[0]) console.log("files change")
		setUploadFileUrl(URL.createObjectURL(e.target.files[0]))
	}

	async function detect() {
		setHeading("...loading")
		const result = await model.predict(imgRef.current)
		result.sort((a, b) => b.probability - a.probability)
		console.log("🚀 ~ file: script.js ~ line 23 ~ predict ~ result", result)
		setHeading(result[0].className)
		setDetected(true)
		setInfo(list[result[0].className])
	}
	return (
		<div className="app">
			<h1>{heading}</h1>
			<div className="box">
				<label htmlFor="file">
					<div className="image-upload">Upload image</div>
				</label>
				{previewUrl && <img src={previewUrl} alt="food" ref={imgRef} className="preview-img" />}
			</div>
			<input type="file" id="file" hidden onChange={changeFileHandler} />
			{previewUrl && (
				<button
					onClick={() => {
						setPreviewUrl()
						setDetected(false)
					}}>
					Clear image
				</button>
			)}
			{previewUrl && (
				<button
					onClick={() => {
						detect()
					}}>
					Detect
				</button>
			)}
			{detected && (
				<div className="summary">
					<p>{info.desc}</p>
					<img src={info.url} alt="" className="info-img" />
				</div>
			)}
		</div>
	)
}

export default App
