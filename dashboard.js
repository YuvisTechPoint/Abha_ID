// Sample patient data
let patients = [];

// Function to display patients in the table
function displayPatients(patientsToDisplay) {
    const patientList = document.getElementById('patient-list');
    patientList.innerHTML = ''; // Clear existing entries

    patientsToDisplay.forEach(patient => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${patient.name}</td>
            <td>${patient.priorityScore}</td>
            <td>${patient.arrivalTime}</td>
            <td>${patient.symptoms.join(', ')}</td>
        `;
        patientList.appendChild(row);
    });
}

// Function to apply filters
function applyFilters() {
    const priorityFilter = document.getElementById('filter-priority').value;
    const symptomFilter = document.getElementById('filter-symptom').value.toLowerCase();

    const filteredPatients = patients.filter(patient => {
        const matchesPriority = priorityFilter === '' || 
            (priorityFilter === 'low' && patient.priorityScore >= 8) ||
            (priorityFilter === 'moderate' && patient.priorityScore >= 4 && patient.priorityScore < 8) ||
            (priorityFilter === 'critical' && patient.priorityScore < 4);
        
        const matchesSymptom = symptomFilter === '' || 
            patient.symptoms.some(symptom => symptom.toLowerCase().includes(symptomFilter));

        return matchesPriority && matchesSymptom;
    });

    displayPatients(filteredPatients);
}

// Function to sort patients by priority score
function sortByPriority() {
    const sortedPatients = [...patients].sort((a, b) => b.priorityScore - a.priorityScore);
    displayPatients(sortedPatients);
}

// Function to sort patients by arrival time
function sortByArrival() {
    const sortedPatients = [...patients].sort((a, b) => new Date(a.arrivalTime) - new Date(b.arrivalTime));
    displayPatients(sortedPatients);
}

// Event listeners for sorting buttons
document.getElementById('apply-filters').addEventListener('click', applyFilters);
document.getElementById('sort-priority').addEventListener('click', sortByPriority);
document.getElementById('sort-arrival').addEventListener('click', sortByArrival);

// Function to add patient data to the queue
function addPatientToQueue(name, score, symptoms) {
    const arrivalTime = new Date().toLocaleTimeString(); // Get current time as arrival time
    const patient = { name, priorityScore: score, arrivalTime, symptoms };
    patients.push(patient);
    displayPatients(patients); // Display updated patient list
} 