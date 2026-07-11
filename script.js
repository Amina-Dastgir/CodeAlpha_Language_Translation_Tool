// Get HTML Elements

const inputText = document.getElementById("inputText");
const outputText = document.getElementById("outputText");
const sourceLang = document.getElementById("sourceLang");
const targetLang = document.getElementById("targetLang");
const translateBtn = document.getElementById("translateBtn");
const copyBtn = document.getElementById("copyBtn");
const swapBtn = document.getElementById("swapBtn");
const themeBtn = document.getElementById("themeBtn");
const voiceBtn = document.getElementById("voiceBtn");
const speakBtn = document.getElementById("speakBtn");
const historyList = document.getElementById("historyList");
const loading = document.getElementById("loading");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

// Dark Mode

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    if (document.body.classList.contains("dark")) {
        themeBtn.innerHTML = "☀️ Light Mode";
    }
    else {
        themeBtn.innerHTML = "🌙 Dark Mode";
    }
});

// Swap Languages

swapBtn.addEventListener("click", () => {
    let temp = sourceLang.value;
    sourceLang.value = targetLang.value;
    targetLang.value = temp;
    let tempText = inputText.value;
    inputText.value = outputText.value;
    outputText.value = tempText;
});

// Copy Button

copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(outputText.value);
    copyBtn.innerHTML = "✅ Copied";
    setTimeout(() => {
        copyBtn.innerHTML = "📋 Copy";
    }, 1500);
});

// Text To Speech

speakBtn.addEventListener("click", () => {
if(outputText.value.trim()==""){
alert("Nothing to Speak");
return;
}
const speech = new SpeechSynthesisUtterance(outputText.value);
switch(targetLang.value){
case "en":
speech.lang="en-US";
break;
case "ur":
speech.lang="ur-PK";
break;
case "hi":
speech.lang="hi-IN";
break;
case "fr":
speech.lang="fr-FR";
break;
case "es":
speech.lang="es-ES";
break;
case "ar":
speech.lang="ar-SA";
break;
default:
speech.lang="en-US";
}
window.speechSynthesis.cancel();
window.speechSynthesis.speak(speech);
});

// Voice Input

voiceBtn.addEventListener("click", () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = sourceLang.value;
    recognition.start();
    recognition.onresult = function (event) {
        inputText.value = event.results[0][0].transcript;
    }
});

// Save History

function saveHistory(original, translated) {
    let history =
        JSON.parse(localStorage.getItem("history")) || [];
    history.unshift({
        original,
        translated
    });
    localStorage.setItem("history", JSON.stringify(history));
    showHistory();
}

// Show History

function showHistory() {
    historyList.innerHTML = "";
    let history =
        JSON.parse(localStorage.getItem("history")) || [];
    history.forEach(item => {
        const li = document.createElement("li");
        li.innerHTML =
            `<b>${item.original}</b><br>${item.translated}`;
        historyList.appendChild(li);
    });
}
showHistory();

clearHistoryBtn.addEventListener("click", () => {
    localStorage.removeItem("history");
    showHistory();
    alert("History Cleared Successfully");
});

// Translate Button

translateBtn.addEventListener("click", translateText);
async function translateText() {
    const text = inputText.value.trim();
    if (text === "") {
        alert("Please enter text");
        return;
    }
    loading.style.display = "block";
    try {
        const response = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang.value}|${targetLang.value}`
        );
        const data = await response.json();
        loading.style.display = "none";
        outputText.value = data.responseData.translatedText;
        saveHistory(text, outputText.value);
    }
    catch (error) {
        loading.style.display = "none";
        alert("Translation Failed");
        console.log(error);
    }
}
