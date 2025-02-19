/* Costanti di gioco */
const SHIELD_POINTS = 250;
const SKILL_TURN_LIMIT = 5;
const BONUS_INTERVAL = 3; // Bonus ogni 3 round
const MAX_ROUNDS = 5;
const SHIP_NAMES = ["ARDO", "GRANITO", "ARMONIO", "ILLUSIO", "MANPO"];

const SHIP_IMAGES = {
  ARDO: "images/naveARDO.png",
  GRANITO: "images/naveGRANITO.png",
  ARMONIO: "images/naveARMONIO.png",
  ILLUSIO: "images/naveILLUSIO.png",
  MANPO: "images/naveMANPO.png"
};

// Lista oggetti bonus (inserisci tutti gli oggetti come da specifica)
const bonusObjects = [
  { id: 1, name: "Scudo Bio-Cibernetico", type: "Difensivo", effect: "Aumenta la DEF di tutte le carte in campo del giocatore di +8 per un round.", image: "images/oggetto1.png" },
  { id: 2, name: "Carapace Corazzato", type: "Difensivo", effect: "Le carte Granito in campo diventano immuni agli attacchi diretti per un round.", image: "images/oggetto2.png" },
  // … (inserire gli altri oggetti come nell’elenco originale)
  { id: 25, name: "Arma Finale Xenogenetica", type: "Raro", effect: "Distrugge una nave ignorando scudi e guardiani ma tu distruggi la carta con il TOT più alto sul tuo lato del campo.", image: "images/oggetto25.png" }
];

/* Stato del gioco */
let ships = [];
let currentZone = "?";
let turnCounter = 0;        // Conta i cicli completi (player+navy) 
let roundCounter = 1;       // Inizia dal Round 1
let playerTurn = true;      // Il gioco parte con il turno del Giocatore
let playerObjects = [];
let usedObjects = [];
let availableObjects = [];
let playerMode = 1;
let peerConnection, dataChannel;
let deathModeActivated = false;

/* Elementi DOM */
const shipsContainer = document.getElementById("ships-container");
const playerObjectsContainer = document.getElementById("player-objects-container");
const usedObjectsContainer = document.getElementById("used-objects-container");
const logElement = document.getElementById("log");
const currentZoneElement = document.getElementById("current-zone");
const turnIndicator = document.getElementById("turn-indicator");
const turnCounterElement = document.getElementById("turn-counter");
const roundCounterElement = document.getElementById("round-counter");
const modeSelection = document.getElementById("mode-selection");
const syncArea = document.getElementById("sync-area");
const gameArea = document.getElementById("game-area");
const localOfferTextarea = document.getElementById("local-offer");
const remoteOfferTextarea = document.getElementById("remote-offer");
const localAnswerTextarea = document.getElementById("local-answer");
const remoteAnswerTextarea = document.getElementById("remote-answer");

/* Mappa effetti per Cerchio degli Estri */
const mappaEffetti = {
  Ardo: { Ardo: { bonus: 0 }, Granito: { bonus: 2 }, Armonio: { bonus: 10 }, Illusio: { malus: -5 }, Manpo: { malus: -10 } },
  Granito: { Granito: { bonus: 0 }, Ardo: { malus: -2 }, Armonio: { bonus: 2 }, Illusio: { bonus: 5 }, Manpo: { bonus: 10 } },
  Armonio: { Armonio: { bonus: 0 }, Ardo: { malus: -10 }, Granito: { malus: -2 }, Illusio: { bonus: 10 }, Manpo: { bonus: 5 } },
  Illusio: { Illusio: { bonus: 0 }, Ardo: { bonus: 10 }, Granito: { malus: -10 }, Armonio: { bonus: 5 }, Manpo: { bonus: 2 } },
  Manpo: { Manpo: { bonus: 0 }, Ardo: { bonus: 5 }, Granito: { bonus: 2 }, Armonio: { malus: -2 }, Illusio: { bonus: 10 } }
};

/* FUNZIONI DI GIOCO */
function startGame(mode) {
  playerMode = mode;
  logEvent(`Modalità ${mode === 1 ? "1 Giocatore" : "2 Giocatori"} selezionata.`);
  modeSelection.classList.add("hidden");
  if (mode === 2) {
    syncArea.classList.remove("hidden");
  } else {
    gameArea.classList.remove("hidden");
    initializeGame();
  }
}

async function createOffer() {
  peerConnection = new RTCPeerConnection();
  dataChannel = peerConnection.createDataChannel("gameSync");
  dataChannel.onopen = () => logEvent("Data channel aperto.");
  dataChannel.onmessage = (event) => {
    const receivedData = JSON.parse(event.data);
    syncGameState(receivedData);
  };
  peerConnection.onicecandidate = (event) => { if (event.candidate) {} };
  const offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer);
  localOfferTextarea.value = JSON.stringify(peerConnection.localDescription);
  logEvent("Offerta creata. Invia questa offerta al secondo giocatore.");
}

async function createAnswer() {
  const remoteOffer = JSON.parse(remoteOfferTextarea.value);
  peerConnection = new RTCPeerConnection();
  peerConnection.ondatachannel = (event) => {
    dataChannel = event.channel;
    dataChannel.onopen = () => logEvent("Data channel aperto.");
    dataChannel.onmessage = (event) => {
      const receivedData = JSON.parse(event.data);
      syncGameState(receivedData);
    };
  };
  peerConnection.onicecandidate = (event) => { if (event.candidate) {} };
  await peerConnection.setRemoteDescription(new RTCSessionDescription(remoteOffer));
  const answer = await peerConnection.createAnswer();
  await peerConnection.setLocalDescription(answer);
  localAnswerTextarea.value = JSON.stringify(peerConnection.localDescription);
  logEvent("Risposta creata. Invia questa risposta al primo giocatore.");
}

async function finalizeConnection() {
  const remoteAnswer = JSON.parse(remoteAnswerTextarea.value);
  await peerConnection.setRemoteDescription(new RTCSessionDescription(remoteAnswer));
  logEvent("Connessione stabilita con l'altro giocatore.");
  gameArea.classList.remove("hidden");
  initializeGame();
}

function syncGameState(state) {
  ships = state.ships;
  turnCounter = state.turnCounter;
  playerTurn = state.playerTurn;
  currentZone = state.currentZone;
  playerObjects = state.playerObjects;
  usedObjects = state.usedObjects;
  availableObjects = state.availableObjects;
  renderShips();
  renderObjects();
  updateTurnIndicator();
  updateCounters();
  logEvent("Stato sincronizzato con il peer.");
}

function initializeGame() {
  ships = [];
  currentZone = "?";
  turnCounter = 1;
  playerTurn = true;
  playerObjects = [];
  usedObjects = [];
  availableObjects = shuffleArray([...bonusObjects]);
  generateShips();
  renderShips();
  renderObjects();
  updateTurnIndicator();
  updateCounters();
  logEvent("Giocatore Turno 1 Round 1 iniziato.");
}

function generateShips() {
  ships = [];
  SHIP_NAMES.forEach(name => {
    let skillDescription = "";
    switch (name) {
      case "ARDO":
        skillDescription = "Tutte le carte ARDO sul campo del giocatore vengono distrutte, inoltre ogni round che passa, una carta a scelta viene distrutta.";
        break;
      case "GRANITO":
        skillDescription = "Tutte le carte GRANITO del giocatore perdono 10 DEF e quelle dei guardiani sono immortali.";
        break;
      case "ARMONIO":
        skillDescription = "Le carte ARMONIO hanno i Doni inibiti finché l'astronave ARMONIO è in campo.";
        break;
      case "ILLUSIO":
        skillDescription = "Le carte ILLUSIO hanno DEX +10 e cambiano lato durante l'attivazione.";
        break;
      case "MANPO":
        skillDescription = "Il giocatore deve mandare al Cimitero tutte le carte in mano e pescare solo la metà.";
        break;
    }
    const ship = { id: name, shields: SHIELD_POINTS, alarm: false, skillCountdown: null, skillDescription };
    ships.push(ship);
  });
  logEvent("Navi generate con successo.");
  if (playerMode === 2) syncAndSendState();
}

function renderShips() {
  shipsContainer.innerHTML = "";
  ships.forEach(ship => {
    const shipDiv = document.createElement("div");
    shipDiv.className = "ship";
    shipDiv.id = `ship-${ship.id}`;
    const overlayDisplay = ship.shields <= 0 ? "flex" : "none";
    shipDiv.innerHTML = `
      <div class="ship-overlay" id="overlay-${ship.id}" style="display: ${overlayDisplay};">Distrutta</div>
      <img src="${SHIP_IMAGES[ship.id]}" alt="Immagine di ${ship.id}">
      <h3>Astronave ${ship.id}</h3>
      <p>Scudi: <span id="shields-${ship.id}">${ship.shields}</span></p>
      <p id="skill-${ship.id}">Skill: ${ship.skillCountdown !== null ? "Attiva tra " + ship.skillCountdown + " turni" : "Non attiva"}</p>
      <p class="skill-description"><strong>Effetto Skill:</strong><br>${ship.skillDescription}</p>
      <button class="action-button" onclick="activateAlarm('${ship.id}')" ${ship.shields <= 0 ? "disabled" : ""}>Attiva Allarme</button>
      <input type="number" id="damage-${ship.id}" placeholder="Danni" min="0" ${ship.shields <= 0 ? "disabled" : ""}/>
      <button class="action-button" onclick="damageShip('${ship.id}')" ${ship.shields <= 0 ? "disabled" : ""}>Sottrai Scudi</button>
    `;
    shipsContainer.appendChild(shipDiv);
  });
}

function renderObjects() {
  playerObjectsContainer.innerHTML = "";
  playerObjects.forEach(object => {
    const cardDiv = document.createElement("div");
    cardDiv.className = "card";
    cardDiv.id = `object-${object.id}`;
    cardDiv.innerHTML = `
      <img src="${object.image}" alt="${object.name}">
      <h4>${object.name}</h4>
      <p>${object.effect}</p>
      <button onclick="useObject(${object.id})">Utilizza</button>
    `;
    playerObjectsContainer.appendChild(cardDiv);
  });
}

function openUsedObjectsModal() {
  document.getElementById("used-objects-modal").style.display = "block";
  renderUsedObjects();
}

function closeUsedObjectsModal() {
  document.getElementById("used-objects-modal").style.display = "none";
}

function renderUsedObjects() {
  usedObjectsContainer.innerHTML = "";
  usedObjects.forEach(object => {
    const cardDiv = document.createElement("div");
    cardDiv.className = "card";
    cardDiv.id = `used-object-${object.id}`;
    cardDiv.innerHTML = `
      <img src="${object.image}" alt="${object.name}">
      <h4>${object.name}</h4>
      <p>Usato</p>
    `;
    usedObjectsContainer.appendChild(cardDiv);
  });
}

function useObject(id) {
  if (!playerTurn) {
    alert("Non è il tuo turno!");
    return;
  }
  const index = playerObjects.findIndex(obj => obj.id === id);
  if (index !== -1) {
    const object = playerObjects.splice(index, 1)[0];
    usedObjects.push(object);
    logEvent(`Oggetto ${object.name} utilizzato. Effetto: ${object.effect}`);
    renderObjects();
    if (document.getElementById("used-objects-modal").style.display === "block") {
      renderUsedObjects();
    }
    syncAndSendState();
  }
}

function activateAlarm(id) {
  if (!playerTurn) { alert("Non è il tuo turno!"); return; }
  const ship = ships.find(s => s.id === id);
  if (ship && !ship.alarm) {
    ship.alarm = true;
    ship.skillCountdown = SKILL_TURN_LIMIT;
    logEvent(`Allarme attivato per la Nave ${id}. Skill attiverà tra ${SKILL_TURN_LIMIT} turni.`);
    updateSkillStatus(id);
    syncAndSendState();
    renderShips();
  }
}

function damageShip(id) {
  if (!playerTurn) { alert("Non è il tuo turno!"); return; }
  const damageInput = document.getElementById(`damage-${id}`);
  const damage = parseInt(damageInput.value, 10);
  if (isNaN(damage) || damage < 0) { alert("Inserisci un valore di danno valido."); return; }
  const ship = ships.find(s => s.id === id);
  if (ship) {
    ship.shields -= damage;
    if (ship.shields < 0) ship.shields = 0;
    logEvent(`Nave ${ship.id} subisce ${damage} danni. Scudi rimasti: ${ship.shields}`);
    damageInput.value = "";
    if (ship.shields <= 0) {
      ship.shields = 0;
      if (ship.skillCountdown !== null) {
        ship.alarm = false;
        ship.skillCountdown = null;
        logEvent(`Skill della Nave ${ship.id} annullata (scudi a 0).`);
      }
    }
    renderShips();
    syncAndSendState();
  }
}

function updateSkillStatus(id) {
  const ship = ships.find(s => s.id === id);
  if (ship && ship.skillCountdown !== null) {
    const skillElem = document.getElementById(`skill-${id}`);
    if (ship.skillCountdown > 1) {
      ship.skillCountdown--;
      skillElem.innerHTML = `Skill: Attiva tra ${ship.skillCountdown} turni`;
      if (ship.skillCountdown === 1) {
        skillElem.classList.add("skill-warning");
        logEvent(`La skill della Nave ${id} si attiverà al prossimo turno!`);
      }
    } else if (ship.skillCountdown === 1) {
      ship.skillCountdown--;
      skillElem.innerHTML = `Skill: ATTIVA!`;
      logEvent(`Skill della Nave ${id} attivata!`);
      applyShipSkillEffect(ship);
      ship.alarm = false;
      ship.skillCountdown = null;
      skillElem.classList.remove("skill-warning");
      syncAndSendState();
    }
  }
}

function applyShipSkillEffect(ship) {
  switch (ship.id) {
    case "ARDO":
      logEvent("Skill di ARDO attivata.");
      break;
    case "GRANITO":
      logEvent("Skill di GRANITO attivata.");
      break;
    case "ARMONIO":
      logEvent("Skill di ARMONIO attivata.");
      break;
    case "ILLUSIO":
      logEvent("Skill di ILLUSIO attivata.");
      break;
    case "MANPO":
      logEvent("Skill di MANPO attivata.");
      break;
    default:
      logEvent("Skill sconosciuta attivata.");
  }
}

function nextTurn() {
  if (playerTurn) {
    // Fine del turno del giocatore
    logEvent(`Turno del Giocatore ${roundCounter} completato.`);
    playerTurn = false;
    turnIndicator.innerText = "Turno delle Navi";
  } else {
    // Esecuzione del turno delle navi
    ships.forEach(ship => {
      if (ship.skillCountdown !== null) {
        updateSkillStatus(ship.id);
      }
    });
    logEvent("Turno delle Navi completato.");
    playerTurn = true;
    turnIndicator.innerText = "Turno del Giocatore";
    
    // Incrementa il contatore dei cicli completi e il Round
    turnCounter++;
    roundCounter++;
    updateCounters();

    // Controlla se attivare la Modalità Morte
    if (roundCounter > MAX_ROUNDS && !deathModeActivated) {
      deathModeActivated = true;
      logEvent("Modalità Morte attivata!");
      alert("Modalità Morte attivata!");
      const deathModeIndicator = document.createElement('div');
      deathModeIndicator.id = 'death-mode-indicator';
      deathModeIndicator.innerText = 'Modalità Morte Attiva';
      deathModeIndicator.classList.add('death-mode');
      document.getElementById('game-area').appendChild(deathModeIndicator);
    }

    // Assegna bonus se il round è multiplo di BONUS_INTERVAL
    if (roundCounter % BONUS_INTERVAL === 0 && availableObjects.length > 0) {
      const bonus = getRandomObjects(1)[0];
      playerObjects.push(bonus);
      logEvent(`Nuovo oggetto bonus ricevuto: ${bonus.name}`);
      renderObjects();
    }
  }
  syncAndSendState();
}

function setZone() {
  const zone = prompt("Inserisci la zona attuale (ARDO, GRANITO, ARMONIO, ILLUSIO, MANPO):");
  if (zone) {
    const zoneUpper = zone.trim().toUpperCase();
    if (SHIP_NAMES.includes(zoneUpper)) {
      currentZone = zoneUpper;
      currentZoneElement.innerText = zoneUpper;
      logEvent(`Zona impostata su: ${zoneUpper}`);
      ships.forEach(ship => (ship.shields = SHIELD_POINTS));
      const specialShip = ships.find(s => s.id === currentZone);
      if (specialShip) {
        specialShip.shields = SHIELD_POINTS + 50;
        logEvent(`Nave ${specialShip.id} ha scudi aumentati a ${specialShip.shields}.`);
      }
      renderShips();
      syncAndSendState();
    } else {
      alert("Zona non valida. Inserisci: ARDO, GRANITO, ARMONIO, ILLUSIO, MANPO.");
    }
  }
}

function logEvent(message) {
  const time = new Date().toLocaleTimeString();
  logElement.innerHTML += `<p>[${time}] ${message}</p>`;
  logElement.scrollTop = logElement.scrollHeight;
}

function resetGame() {
  deathModeActivated = false;
  const deathIndicator = document.getElementById("death-mode-indicator");
  if (deathIndicator) deathIndicator.remove();
  turnCounter = 1;
  playerTurn = true;
  currentZone = "?";
  currentZoneElement.innerText = "?";
  playerObjects = [];
  usedObjects = [];
  availableObjects = shuffleArray([...bonusObjects]);
  ships.forEach(ship => {
    ship.shields = SHIELD_POINTS;
    ship.alarm = false;
    ship.skillCountdown = null;
  });
  renderShips();
  renderObjects();
  updateCounters();
  logEvent("Gioco resettato.");
}

function shuffleArray(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
}

function getRandomObjects(num) {
  const selected = [];
  for (let i = 0; i < num && availableObjects.length > 0; i++) {
    const index = Math.floor(Math.random() * availableObjects.length);
    const [obj] = availableObjects.splice(index, 1);
    selected.push(obj);
  }
  return selected;
}

function syncAndSendState() {
  if (playerMode === 2 && dataChannel && dataChannel.readyState === "open") {
    const state = {
      ships,
      turnCounter,
      playerTurn,
      currentZone,
      playerObjects,
      usedObjects,
      availableObjects
    };
    dataChannel.send(JSON.stringify(state));
  }
}

function updateTurnIndicator() {
  turnIndicator.innerText = playerTurn ? "Turno del Giocatore" : "Turno delle Navi";
}

function updateCounters() {
  turnCounterElement.innerText = turnCounter;
  roundCounterElement.innerText = roundCounter;
}

/* CERCHIO DEGLI ESTRI */
function generateCerchioEstriTable() {
  const container = document.getElementById("cerchio-estri-content");
  container.innerHTML = "";
  const estros = Object.keys(mappaEffetti);
  let table = document.createElement("table");
  table.className = "cerchio-estri-table";
  let thead = document.createElement("thead");
  let headerRow = document.createElement("tr");
  let emptyCell = document.createElement("th");
  emptyCell.textContent = "Estro attaccante ▼";
  headerRow.appendChild(emptyCell);
  estros.forEach(estro => {
    let th = document.createElement("th");
    th.textContent = estro;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);
  let tbody = document.createElement("tbody");
  estros.forEach(estroAtt => {
    let row = document.createElement("tr");
    let th = document.createElement("th");
    th.textContent = estroAtt;
    row.appendChild(th);
    estros.forEach(estroDif => {
      let cell = document.createElement("td");
      const effetto = mappaEffetti[estroAtt][estroDif];
      if (effetto) {
        if (effetto.bonus) {
          cell.textContent = `+${effetto.bonus}`;
          cell.style.color = "green";
        } else if (effetto.malus) {
          cell.textContent = `${effetto.malus}`;
          cell.style.color = "red";
        } else {
          cell.textContent = "0";
        }
      } else {
        cell.textContent = "-";
      }
      row.appendChild(cell);
    });
    tbody.appendChild(row);
  });
  table.appendChild(tbody);
  container.appendChild(table);
}

/* SEZIONE BERSAGLI */
function openTargetSection() {
  document.getElementById("target-section").classList.add("active");
}
function closeTargetSection() {
  document.getElementById("target-section").classList.remove("active");
}
function selectTargetCards() {
  const countInput = document.getElementById("card-count");
  let cardCount = parseInt(countInput.value, 10);
  if (isNaN(cardCount) || cardCount < 2) {
    alert("Inserisci almeno 2 carte.");
    return;
  }
  let positions = [];
  for (let i = 1; i <= cardCount; i++) positions.push(i);
  shuffleArray(positions);
  let selected = positions.slice(0, 2).sort((a, b) => a - b);
  let useHighest = Math.random() < 0.5;
  const guardianMessage = useHighest
    ? "Guardiani attaccheranno dal TOT più alto al più basso."
    : "Guardiani attaccheranno dal TOT più basso al più alto.";
  let attackOrder = useHighest ? [...selected].sort((a, b) => b - a) : [...selected].sort((a, b) => a - b);
  const targetMessage = `Carte bersaglio: ${selected[0]} e ${selected[1]} (da sinistra a destra).`;
  const attackSequence = `Ordine di attacco: prima la carta ${attackOrder[0]}, poi la carta ${attackOrder[1]}.`;
  alert(`${guardianMessage}\n\n${targetMessage}\n\n${attackSequence}`);
  logEvent(guardianMessage);
  logEvent(targetMessage);
  logEvent(attackSequence);
}

/* Event Listeners */
document.getElementById("open-cerchio-estri").addEventListener("click", function () {
  document.getElementById("modal-cerchio-estri").style.display = "block";
  generateCerchioEstriTable();
});
document.getElementById("close-cerchio-estri").addEventListener("click", function () {
  document.getElementById("modal-cerchio-estri").style.display = "none";
});
document.getElementById("open-target-section").addEventListener("click", openTargetSection);
document.getElementById("close-target-section").addEventListener("click", closeTargetSection);
document.getElementById("select-target-cards").addEventListener("click", selectTargetCards);

// Chiude la modale se l'utente clicca fuori (controlla se l'elemento cliccato ha la classe "modal")
window.onclick = function (event) {
  if (event.target.classList.contains("modal")) {
    event.target.style.display = "none";
  }
};

/* Esponi funzioni per chiamate inline */
window.openTargetSection = openTargetSection;
window.closeTargetSection = closeTargetSection;
window.selectTargetCards = selectTargetCards;
