let questions = {
    en: [
        "What is your main symptom?",
        "How long have you had this symptom?",
        "Have you experienced any other symptoms?"
    ],
    hi: [
        "आपका मुख्य लक्षण क्या है?",
        "आपको यह लक्षण कब से है?",
        "क्या आपने कोई अन्य लक्षण अनुभव किया है?"
    ],
    es: [
        "¿Cuál es su síntoma principal?",
        "¿Cuánto tiempo ha tenido este síntoma?",
        "¿Ha experimentado algún otro síntoma?"
    ],
    ta: [
        "உங்கள் முக்கியமான அறிகுறி என்ன?",
        "இந்த அறிகுறி எப்போது இருந்தது?",
        "மற்ற எந்த அறிகுறிகள் உள்ளன?"
    ],
    bn: [
        "আপনার প্রধান উপসর্গ কী?",
        "আপনার এই উপসর্গটি কতদিন ধরে আছে?",
        "আপনি কি অন্�� কোনো উপসর্গ অনুভব করেছেন?"
    ]
};

let currentQuestionIndex = 0;
let symptomsData = [];
let priorityScore = 0;

// Initialize the patient input form
function initializePatientInputForm() {
    document.getElementById('fetchData').addEventListener('click', fetchPatientData);
    document.getElementById('language').addEventListener('change', changeLanguage);
    document.getElementById('search-button').addEventListener('click', showExpectedOutcome);
}

// Fetch Patient Data
async function fetchPatientData() {
    const abhaId = document.getElementById('abha-id').value;
    const feedbackElement = document.getElementById('abha-id-feedback');

    // Validate ABHA ID format (example: must be 12 digits)
    const abhaIdPattern = /^\d{12}$/;
    if (!abhaIdPattern.test(abhaId)) {
        feedbackElement.innerText = 'Invalid ABHA ID. Please enter a 12-digit ID.';
        return;
    } else {
        feedbackElement.innerText = ''; // Clear feedback
    }

    alert(`Fetching data for ABHA ID: ${abhaId}`);
    // Simulate API Call
    document.getElementById('priorityScore').textContent = "Priority Score: Pending...";
}

// Add Symptom
function addSymptom() {
    const symptomSelect = document.getElementById('symptom');
    const selectedSymptom = symptomSelect.value;
    const abhaId = document.getElementById('abha-id').value;

    if (selectedSymptom && abhaId) {
        symptomsData.push(selectedSymptom);
        updateSymptomList();
        symptomSelect.value = ''; // Clear selection
        calculatePriorityScore(); // Calculate score in real-time

        // Add patient data to the queue management table
        addPatientToQueue(abhaId, priorityScore, symptomsData);
    } else {
        alert('Please select a symptom and enter ABHA ID.');
    }
}

// Update Symptom List
function updateSymptomList() {
    const symptomList = document.getElementById('symptom-list');
    symptomList.innerHTML = ''; // Clear existing list
    symptomsData.forEach(symptom => {
        const li = document.createElement('li');
        li.textContent = symptom;
        symptomList.appendChild(li);
    });
}

// Change Language
function changeLanguage() {
    const selectedLang = this.value;
    document.getElementById('title').innerText = selectedLang === 'hi' ? 'एबीएचए आईडी' : selectedLang === 'ta' ? 'ஏபிஹே ஐடி' : selectedLang === 'bn' ? 'এবিএইচএ আইডি' : 'ABHA ID';
    document.getElementById('subtitle').innerText = selectedLang === 'hi' ? 'बहुभाषी, आवाज-सक्षम प्रयोगशाला परिणाम' : selectedLang === 'ta' ? 'பல மொழி, குரல்-செயல்படுத்தப்பட்ட ஆய்வக முடிவுகள்' : selectedLang === 'bn' ? 'বহুভাষী, ভয়েস-সক্ষম ল্যাব ফলাফল' : 'Multilingual, Voice-enabled Lab Results';
    document.getElementById('abha-id-label').innerText = selectedLang === 'hi' ? 'एबीएचए आईडी ���र्ज करें:' : selectedLang === 'ta' ? 'ஏபிஹே ஐடி உள்ளிடவும்:' : selectedLang === 'bn' ? 'এবিএইচএ আইডি লিখুন:' : 'Enter ABHA ID:';
    document.getElementById('symptom-label').innerText = selectedLang === 'hi' ? 'लक्षण चुनें:' : selectedLang === 'ta' ? 'அறிகுறி தேர்ந்தெடுக்கவும்:' : selectedLang === 'bn' ? 'উপসর্গ নির্বাচন করুন:' : 'Select Symptom:';
    currentQuestionIndex = 0; // Reset question index
    symptomsData = []; // Reset symptoms data
    nextQuestion(); // Load the first question in the selected language
}

// Function to display the next question
function nextQuestion() {
    const language = document.getElementById('language').value;
    const questionText = questions[language][currentQuestionIndex];
    document.getElementById('questions').innerText = questionText;
    currentQuestionIndex++;
    if (currentQuestionIndex >= questions[language].length) {
        currentQuestionIndex = 0; // Reset for next round
        calculatePriorityScore(); // Calculate score when questions are done
    }
}

// Function to calculate priority score
function calculatePriorityScore() {
    priorityScore = symptomsData.length * 2; // Example: 2 points for each symptom
    displaySummary();
}

// Function to display summary
function displaySummary() {
    const summary = `You reported the following symptoms: ${symptomsData.join(', ')}.`;
    document.getElementById('score').innerText = `${priorityScore}/10`;
    document.getElementById('summary').innerText = summary;
    updateScoreDisplay(priorityScore); // Update score display with color coding
}

// Function to update score display with color coding and urgency summary
function updateScoreDisplay(score) {
    const scoreElement = document.getElementById('score');
    const urgencySummary = document.getElementById('urgency-summary');

    if (score >= 8) {
        scoreElement.style.color = 'green'; // Low risk
        urgencySummary.innerText = 'Urgency: Low. Patient can wait for further evaluation.';
    } else if (score >= 4) {
        scoreElement.style.color = 'yellow'; // Moderate risk
        urgencySummary.innerText = 'Urgency: Moderate. Patient should be evaluated soon.';
    } else {
        scoreElement.style.color = 'red'; // Critical risk
        urgencySummary.innerText = 'Urgency: High. Immediate evaluation required!';
    }
}

// Function to show expected outcome
function showExpectedOutcome() {
    const outcome = `Based on the reported symptoms: ${symptomsData.join(', ')}, the expected outcome is to consult a healthcare professional for further evaluation.`;
    document.getElementById('outcome-result').innerText = outcome;
}

// Initialize the patient input form on page load
initializePatientInputForm();

// Initialize the first question
nextQuestion();
