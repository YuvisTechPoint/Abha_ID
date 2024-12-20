const CLIENT_ID = 'YOUR_CLIENT_ID'; // Replace with your client ID
const API_KEY = 'YOUR_API_KEY'; // Replace with your API key
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"];
const SCOPES = "https://www.googleapis.com/auth/gmail.readonly";

document.getElementById('authorize-button').onclick = handleAuthClick;
document.getElementById('signout-button').onclick = handleSignoutClick;

function handleClientLoad() {
    gapi.load("client:auth2", initClient);
}

async function initClient() {
    gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(() => {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    });
}

function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        document.getElementById('authorize-button').style.display = 'none';
        document.getElementById('signout-button').style.display = 'block';
        listEmails();
    } else {
        document.getElementById('authorize-button').style.display = 'block';
        document.getElementById('signout-button').style.display = 'none';
    }
}

function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
}

function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
}

async function listEmails() {
    const response = await gapi.client.gmail.users.messages.list({
        'userId': 'me',
        'maxResults': 10,
        'q': 'lab report' // Filter for lab reports
    });

    const messages = response.result.messages;
    const emailList = document.getElementById('email-list');
    emailList.innerHTML = ''; // Clear existing emails

    if (messages && messages.length > 0) {
        for (const message of messages) {
            const msg = await gapi.client.gmail.users.messages.get({
                'userId': 'me',
                'id': message.id
            });
            const subject = msg.result.payload.headers.find(header => header.name === 'Subject').value;
            const snippet = msg.result.snippet;

            const emailItem = document.createElement('div');
            emailItem.innerHTML = `<strong>${subject}</strong><p>${snippet}</p>`;
            emailList.appendChild(emailItem);
        }
    } else {
        emailList.innerHTML = '<p>No lab reports found.</p>';
    }
}

// Load the API client and auth2 library
gapi.load("client:auth2", handleClientLoad); 