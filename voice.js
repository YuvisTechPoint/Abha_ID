let recognition;
let isRecognizing = false;

// Initialize the Web Speech API for voice recognition
function initializeVoiceRecognition() {
    if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
        alert("Your browser does not support speech recognition. Please use Google Chrome.");
        return;
    }

    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = document.getElementById('language').value; // Set language based on selection
    recognition.interimResults = false;

    recognition.onstart = function() {
        isRecognizing = true;
        console.log("Voice recognition started. Speak now.");
        document.getElementById('symptom').value = ''; // Clear previous input
    };

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        console.log("You said: ", transcript);
        document.getElementById('symptom').value = transcript; // Set the recognized text to the symptom input
        addSymptom(); // Automatically add the symptom
    };

    recognition.onend = function() {
        isRecognizing = false;
        console.log("Voice recognition ended.");
    };

    recognition.onerror = function(event) {
        isRecognizing = false;
        console.error("Error occurred in recognition: " + event.error);
        alert("Error occurred: " + event.error);
    };
}

// Start voice recognition
function startVoiceRecognition() {
    if (!isRecognizing) {
        initializeVoiceRecognition();
        recognition.start();
    } else {
        console.log("Voice recognition is already in progress.");
    }
}

// Function to speak the question
function speakQuestion() {
    const question = "What is your main symptom? Please respond.";
    const utterance = new SpeechSynthesisUtterance(question);
    utterance.lang = document.getElementById('language').value; // Set language based on selection
    window.speechSynthesis.speak(utterance);
} 