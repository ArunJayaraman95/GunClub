import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserSessionPersistence,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const app = initializeApp({
  apiKey: "AIzaSyBbZvaYl6TUxMtsjh7XSSOgupD2yHYnykY",
  authDomain: "carleton-gun-club.firebaseapp.com",
  projectId: "carleton-gun-club",
  storageBucket: "carleton-gun-club.firebasestorage.app",
  messagingSenderId: "144777381131",
  appId: "1:144777381131:web:0a18e9fd9619e3a54c8e0e",
});
const auth = getAuth(app);
const db = getFirestore(app);

const SHARED_EMAIL = "members@carletongunclub.ca";
const PASSWORD_SUFFIX = "pw";

const loginSection = document.getElementById("member-login-section");
const loginForm = document.getElementById("member-login");
const loginError = document.getElementById("login-error");
const memberContent = document.getElementById("member-content");
const eventsList = document.getElementById("member-events");
const logoutButton = document.getElementById("logout");

async function login(lastName, password) {
  await setPersistence(auth, browserSessionPersistence);
  await signInWithEmailAndPassword(auth, SHARED_EMAIL, password + PASSWORD_SUFFIX);
  const match = await getDocs(
    query(collection(db, "members"), where("lastName", "==", lastName.toLowerCase()), limit(1))
  );
  if (match.empty) {
    await signOut(auth);
    throw new Error("Last name not found");
  }
}

async function loadEvents() {
  eventsList.textContent = "Loading events...";
  const snap = await getDocs(query(collection(db, "events"), orderBy("date")));
  eventsList.replaceChildren();
  if (snap.empty) {
    eventsList.textContent = "No member events posted yet.";
    return;
  }
  for (const doc of snap.docs) {
    const event = doc.data();
    const card = document.createElement("div");
    card.className = "event-card";
    const details = document.createElement("div");
    details.className = "event-details";
    const title = document.createElement("h3");
    title.textContent = event.title;
    const date = document.createElement("p");
    date.textContent = event.date;
    const body = document.createElement("p");
    body.textContent = event.details;
    details.append(title, date, body);
    card.append(details);
    eventsList.append(card);
  }
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  loginError.hidden = true;
  const lastName = document.getElementById("last-name").value.trim();
  const password = document.getElementById("password").value;

  try {
    await login(lastName, password);
  } catch (err) {
    loginError.textContent = "⚠️ Last name or password is incorrect.";
    loginError.hidden = false;
    return;
  }

  loginForm.reset();
  loginSection.hidden = true;
  memberContent.hidden = false;
  try {
    await loadEvents();
  } catch (err) {
    eventsList.textContent = "Could not load member events.";
  }
});

logoutButton.addEventListener("click", async () => {
  await signOut(auth);
  memberContent.hidden = true;
  loginSection.hidden = false;
});
