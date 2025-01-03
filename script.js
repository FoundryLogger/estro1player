// Costanti di gioco
const SHIELD_POINTS = 250;
const SKILL_TURN_LIMIT = 5;
const BONUS_INTERVAL = 3; // Bonus ogni 3 turni
const MAX_ROUNDS = 5;
const SHIP_NAMES = ["ARDO", "GRANITO", "ARMONIO", "ILLUSIO", "MANPO"];

// Mappa delle immagini delle navi
const SHIP_IMAGES = {
    "ARDO": "images/naveARDO.png",
    "GRANITO": "images/naveGRANITO.png",
    "ARMONIO": "images/naveARMONIO.png",
    "ILLUSIO": "images/naveILLUSIO.png",
    "MANPO": "images/naveMANPO.png"
};

// Lista degli oggetti bonus
const bonusObjects = [
    {
        id: 1,
        name: "Scudo Bio-Cibernetico",
        type: "Difensivo",
        effect: "Aumenta la DEF di tutte le carte in campo del giocatore di +8 per un round.",
        image: "images/oggetto1.png"
    },
    {
        id: 2,
        name: "Carapace Corazzato",
        type: "Difensivo",
        effect: "Le carte Granito in campo diventano immuni agli attacchi diretti per un round.",
        image: "images/oggetto2.png"
    },
    {
        id: 3,
        name: "Generatori di Campo Protettivo",
        type: "Difensivo",
        effect: "Riduce l'ATK di tutte le carte avversarie di -5 per un round.",
        image: "images/oggetto3.png"
    },
    {
        id: 4,
        name: "Armatura Simbiotica",
        type: "Difensivo",
        effect: "La carta più debole del giocatore ottiene +10 DEF. Persistente finché non viene distrutta.",
        image: "images/oggetto4.png"
    },
    {
        id: 5,
        name: "Placca Anti-Esplosione",
        type: "Difensivo",
        effect: "Protegge una carta dall'eliminazione automatica in caso di attacco con valore primario doppio.",
        image: "images/oggetto5.png"
    },
    {
        id: 6,
        name: "Lama Plasma-Risonante",
        type: "Offensivo",
        effect: "Aumenta l'ATK di una carta scelta di +12, ma riduce il suo MAP di -5.",
        image: "images/oggetto6.png"
    },
    {
        id: 7,
        name: "Proiettile Neuro-Sincronico",
        type: "Offensivo",
        effect: "Distrugge una carta avversaria con TOT inferiore a 50.",
        image: "images/oggetto7.png"
    },
    {
        id: 8,
        name: "Cannone Particellare",
        type: "Offensivo",
        effect: "Permette a una carta di attaccare due volte nel turno.",
        image: "images/oggetto8.png"
    },
    {
        id: 9,
        name: "Sferza Fotonica",
        type: "Offensivo",
        effect: "Un attacco ignora la DEF della carta avversaria. Durata: 1 utilizzo.",
        image: "images/oggetto9.png"
    },
    {
        id: 10,
        name: "Iniettore di Veleno Genetico",
        type: "Offensivo",
        effect: "Diminuisce il TOT di una carta avversaria di -8 per due turni.",
        image: "images/oggetto10.png"
    },
    {
        id: 11,
        name: "Matrice di Calcolo Tattico",
        type: "Strategico",
        effect: "Aumenta il valore più basso di una carta (ATK, HEL, DEF, MAP, o DEX) del 50% per un turno.",
        image: "images/oggetto11.png"
    },
    {
        id: 12,
        name: "Dispositivo di Teletrasporto",
        type: "Strategico",
        effect: "Permette di scambiare una carta in campo con una dalla mano.",
        image: "images/oggetto12.png"
    },
    {
        id: 13,
        name: "Codice di Override",
        type: "Strategico",
        effect: "Controlla una carta avversaria per un turno.",
        image: "images/oggetto13.png"
    },
    {
        id: 14,
        name: "Generatore di Ologrammi",
        type: "Strategico",
        effect: "Nasconde una carta per due turni, impedendo attacchi diretti su di essa o essere bersagliata da un dono.",
        image: "images/oggetto14.png"
    },
    {
        id: 15,
        name: "Impulso Elettromagnetico",
        type: "Strategico",
        effect: "Disattiva i Doni di tutte le carte avversarie per un round.",
        image: "images/oggetto15.png"
    },
    {
        id: 16,
        name: "Unità Medica Avanzata",
        type: "Supporto",
        effect: "Permette di annullare un effetto negativo su una carta alleata.",
        image: "images/oggetto16.png"
    },
    {
        id: 17,
        name: "Scanner del Futuro",
        type: "Supporto",
        effect: "Consente di scoprire 3 carte coperte e evitare l'attivazione degli effetti di una di queste.",
        image: "images/oggetto17.png"
    },
    {
        id: 18,
        name: "Modulo di Energia Alieno",
        type: "Supporto",
        effect: "Aumenta il TOT di tutte le carte dello stesso estro di +5 per 2 turni.",
        image: "images/oggetto18.png"
    },
    {
        id: 19,
        name: "Amplificatore Psionico",
        type: "Supporto",
        effect: "Aumenta la DEX di una carta Illusio di +10.",
        image: "images/oggetto19.png"
    },
    {
        id: 20,
        name: "Protocolli di Ricostruzione",
        type: "Supporto",
        effect: "Rende una carta distrutta riutilizzabile, viene rimessa nel mazzo, ma con TOT ridotto del 50%.",
        image: "images/oggetto20.png"
    },
    {
        id: 21,
        name: "Cristallo Omniversale",
        type: "Raro",
        effect: "Aumenta di +10 tutti i valori di una carta per un turno.",
        image: "images/oggetto21.png"
    },
    {
        id: 22,
        name: "Virus della Corruzione",
        type: "Raro",
        effect: "Diminuisce TOT di tutte le carte avversarie di -5 per tre turni.",
        image: "images/oggetto22.png"
    },
    {
        id: 23,
        name: "Frattura Dimensionale",
        type: "Raro",
        effect: "Annulla gli effetti attivi di una carta avversaria per un turno.",
        image: "images/oggetto23.png"
    },
    {
        id: 24,
        name: "Nucleo Singolare",
        type: "Raro",
        effect: "Aumenta il TOT della carta più debole in campo a pari valore con quella più forte.",
        image: "images/oggetto24.png"
    },
    {
        id: 25,
        name: "Arma Finale Xenogenetica",
        type: "Raro",
        effect: "Distrugge una nave ignorando scudi e guardiani ma tu distruggi la carta con il TOT più alto sul tuo lato del campo.",
        image: "images/oggetto25.png"
    }
];

// Stato del gioco
let ships = [];
let currentZone = "?";
let turnCounter = 0;
let roundCounter = 0;
let playerTurn = true; // true per turno del giocatore, false per turno delle navi
let playerObjects = [];
let usedObjects = [];
let availableObjects = []; // Sarà inizializzato con una copia mescolata di bonusObjects
let playerMode = 1; // 1 o 2 giocatori
let peerConnection;
let dataChannel;
let deathModeActivated = false;

// Elementi DOM
const shipsContainer = document.getElementById('ships-container');
const playerObjectsContainer = document.getElementById('player-objects-container');
const usedObjectsContainer = document.getElementById('used-objects-container');
const logElement = document.getElementById('log');
const currentZoneElement = document.getElementById('current-zone');
const turnIndicator = document.getElementById('turn-indicator');
const turnCounterElement = document.getElementById('turn-counter');
const roundCounterElement = document.getElementById('round-counter');
const modeSelection = document.getElementById('mode-selection');
const syncArea = document.getElementById('sync-area');
const gameArea = document.getElementById('game-area');
const localOfferTextarea = document.getElementById('local-offer');
const remoteOfferTextarea = document.getElementById('remote-offer');
const localAnswerTextarea = document.getElementById('local-answer');
const remoteAnswerTextarea = document.getElementById('remote-answer');

// Inizia il gioco con la modalità scelta
function startGame(mode) {
    playerMode = mode;
    logEvent(`Modalità ${mode === 1 ? "1 Giocatore" : "2 Giocatori"} selezionata.`);
    modeSelection.classList.add('hidden');
    if (mode === 2) {
        syncArea.classList.remove('hidden');
    } else {
        gameArea.classList.remove('hidden');
        initializeGame();
    }
}

// Crea un'offerta per la connessione WebRTC
async function createOffer() {
    peerConnection = new RTCPeerConnection();
    dataChannel = peerConnection.createDataChannel("gameSync");

    dataChannel.onopen = () => {
        logEvent("Data channel aperto.");
    };

    dataChannel.onmessage = (event) => {
        const receivedData = JSON.parse(event.data);
        syncGameState(receivedData);
    };

    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            // Gestione candidati ICE se necessario
        }
    };

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    localOfferTextarea.value = JSON.stringify(peerConnection.localDescription);
    logEvent("Offerta creata. Invia questa offerta al secondo giocatore.");
}

// Crea una risposta all'offerta ricevuta
async function createAnswer() {
    const remoteOffer = JSON.parse(remoteOfferTextarea.value);
    peerConnection = new RTCPeerConnection();

    peerConnection.ondatachannel = (event) => {
        dataChannel = event.channel;
        dataChannel.onopen = () => {
            logEvent("Data channel aperto.");
        };
        dataChannel.onmessage = (event) => {
            const receivedData = JSON.parse(event.data);
            syncGameState(receivedData);
        };
    };

    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            // Gestione candidati ICE se necessario
        }
    };

    await peerConnection.setRemoteDescription(new RTCSessionDescription(remoteOffer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    localAnswerTextarea.value = JSON.stringify(peerConnection.localDescription);
    logEvent("Risposta creata. Invia questa risposta al primo giocatore.");
}

// Finalizza la connessione inserendo la risposta ricevuta
async function finalizeConnection() {
    const remoteAnswer = JSON.parse(remoteAnswerTextarea.value);
    await peerConnection.setRemoteDescription(new RTCSessionDescription(remoteAnswer));
    logEvent("Connessione stabilita con l'altro giocatore.");
    gameArea.classList.remove('hidden');
    initializeGame();
}

// Sincronizza lo stato del gioco con l'altro giocatore
function syncGameState(state) {
    ships = state.ships;
    turnCounter = state.turnCounter;
    roundCounter = state.roundCounter;
    playerTurn = state.playerTurn;
    currentZone = state.currentZone;
    playerObjects = state.playerObjects;
    usedObjects = state.usedObjects;
    availableObjects = state.availableObjects;

    renderShips();
    renderObjects();
    updateTurnIndicator();
    updateCounters();
    logEvent(`Stato sincronizzato con il peer.`);
}

// Inizializza il gioco
function initializeGame() {
    // Inizializza gli array e le variabili
    ships = [];
    currentZone = "?";
    turnCounter = 0;
    roundCounter = 0;
    playerTurn = true;
    playerObjects = [];
    usedObjects = [];
    availableObjects = shuffleArray([...bonusObjects]); // Copia mescolata degli oggetti disponibili

    generateShips();
    renderShips();
    renderObjects();
    updateTurnIndicator();
    updateCounters();
}

// Genera navi e imposta stato iniziale
function generateShips() {
    shipsContainer.innerHTML = '';
    ships = [];

    SHIP_NAMES.forEach(name => {
        let skillDescription = '';
        switch (name) {
            case 'ARDO':
                skillDescription = 'Tutte le carte <strong>ARDO</strong> sul campo del giocatore vengono distrutte, inoltre ogni round che passa, una carta a scelta del giocatore viene distrutta fino a che l\'astronave resta in campo';
                break;
            case 'GRANITO':
                skillDescription = 'Tutte le carte <strong>GRANITO</strong> del giocatore perdono <strong>10 DEF</strong> inoltre tutte le carte GRANITO dei guardiani sono immortali fino a che l\'astronave è sul campo.';
                break;
            case 'ARMONIO':
                skillDescription = 'Tutte le carte <strong>ARMONIO</strong> del giocatore hanno i Doni inibiti, sia quelle in campo che quelle giocate dopo l\'attivazione della skill, finché l\'astronave ARMONIO non viene distrutta.';
                break;
            case 'ILLUSIO':
                skillDescription = 'Le carte guardiano <strong>ILLUSIO</strong> delle navi hanno <strong>DEX +10</strong>, inoltre le carte ILLUSIO del giocatore sul campo durante l\'attivazione cambiano lato del campo.';
                break;
            case 'MANPO':
                skillDescription = 'Il giocatore deve mandare al Cimitero tutte le carte in mano e pescare solo metà di esse, arrotondato per difetto.';
                break;
            default:
                skillDescription = '';
        }

        const ship = {
            id: name,
            shields: SHIELD_POINTS,
            alarm: false,
            skillCountdown: null, // null finché non viene attivato
            skillDescription: skillDescription
        };
        ships.push(ship);
    });

    renderShips();
    logEvent("Navi generate con successo.");
    if (playerMode === 2) {
        syncAndSendState();
    }
}

// Mostra le navi
function renderShips() {
    shipsContainer.innerHTML = '';
    ships.forEach(ship => {
        const shipDiv = document.createElement('div');
        shipDiv.className = 'ship';
        shipDiv.id = `ship-${ship.id}`;

        // Determina se l'overlay deve essere visualizzato
        const overlayDisplay = ship.shields <= 0 ? 'flex' : 'none';

        shipDiv.innerHTML = `
            <div class="ship-overlay" id="overlay-${ship.id}" style="display: ${overlayDisplay};">Distrutta</div>
            <img src="${SHIP_IMAGES[ship.id]}" alt="Immagine di ${ship.id}">
            <h3>Astronave ${ship.id}</h3>
            <p>Scudi: <span id="shields-${ship.id}">${ship.shields}</span></p>
            <p id="skill-${ship.id}">Skill: ${ship.skillCountdown !== null ? `Attiva tra ${ship.skillCountdown} turni` : "Non attiva"}</p>
            <p class="skill-description"><strong>Effetto Skill:</strong><br>${ship.skillDescription}</p>
            <button class="action-button" onclick="activateAlarm('${ship.id}')" ${ship.shields <= 0 ? 'disabled' : ''}>Attiva Allarme</button>
            <input type="number" id="damage-${ship.id}" placeholder="Danni" min="0" ${ship.shields <= 0 ? 'disabled' : ''}/>
            <button class="action-button" onclick="damageShip('${ship.id}')" ${ship.shields <= 0 ? 'disabled' : ''}>Sottrai Scudi</button>
        `;

        shipsContainer.appendChild(shipDiv);
    });
}

// Mostra gli oggetti del giocatore
function renderObjects() {
    playerObjectsContainer.innerHTML = '';
    playerObjects.forEach(object => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
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

// Funzione per aprire la modale degli Oggetti Usati
function openUsedObjectsModal() {
    const modal = document.getElementById('used-objects-modal');
    modal.style.display = 'block';
    // Re-render degli oggetti usati all'interno della modale
    renderUsedObjects();
}

// Funzione per chiudere la modale degli Oggetti Usati
function closeUsedObjectsModal() {
    const modal = document.getElementById('used-objects-modal');
    modal.style.display = 'none';
}

// Renderizza gli oggetti usati all'interno della modale
function renderUsedObjects() {
    const usedObjectsContainer = document.getElementById('used-objects-container');
    usedObjectsContainer.innerHTML = '';
    usedObjects.forEach(object => {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';
        cardDiv.id = `used-object-${object.id}`;
        cardDiv.innerHTML = `
            <img src="${object.image}" alt="${object.name}">
            <h4>${object.name}</h4>
            <p>Usato</p>
        `;
        usedObjectsContainer.appendChild(cardDiv);
    });
}

// Utilizza un oggetto
function useObject(id) {
    if (!playerTurn) {
        alert("Non è il tuo turno!");
        return;
    }
    const objectIndex = playerObjects.findIndex(obj => obj.id === id);
    if (objectIndex !== -1) {
        const object = playerObjects.splice(objectIndex, 1)[0];
        usedObjects.push(object);
        logEvent(`Oggetto ${object.name} utilizzato. Effetto: ${object.effect}`);
        renderObjects();

        // Se la sezione bersagli è aperta, non è necessario aggiornare la modale
        const modal = document.getElementById('used-objects-modal');
        if (modal.style.display === 'block') {
            renderUsedObjects();
        }

        syncAndSendState();
    }
}

// Attiva l'allarme per una nave
function activateAlarm(id) {
    if (!playerTurn) {
        alert("Non è il tuo turno!");
        return;
    }
    const ship = ships.find(s => s.id === id);
    if (ship && !ship.alarm) {
        ship.alarm = true;
        ship.skillCountdown = SKILL_TURN_LIMIT;
        logEvent(`Allarme attivato per la Nave ${id}. Skill sarà attivata in ${SKILL_TURN_LIMIT} turni.`);
        updateSkillStatus(id);
        syncAndSendState();
        renderShips();
    }
}

// Gestisce i danni alle navi
function damageShip(id) {
    if (!playerTurn) {
        alert("Non è il tuo turno!");
        return;
    }
    const damageInput = document.getElementById(`damage-${id}`);
    const damage = parseInt(damageInput.value, 10);
    if (isNaN(damage) || damage < 0) {
        alert("Inserisci un valore di danno valido.");
        return;
    }

    const ship = ships.find(s => s.id === id);
    if (ship) {
        ship.shields -= damage;
        if (ship.shields < 0) ship.shields = 0;
        logEvent(`Nave ${ship.id} subisce ${damage} danni. Scudi rimanenti: ${ship.shields}`);
        damageInput.value = '';

        // Controlla se la nave è distrutta
        if (ship.shields <= 0) {
            ship.shields = 0;
            // Resetta la skill se è in countdown
            if (ship.skillCountdown !== null) {
                ship.alarm = false;
                ship.skillCountdown = null;
                logEvent(`La skill della Nave ${ship.id} è stata annullata perché gli scudi sono a zero.`);
            }
        }

        // Re-render delle navi per aggiornare l'overlay
        renderShips();
        syncAndSendState();
    }
}

// Aggiorna lo stato delle skill
function updateSkillStatus(id) {
    const ship = ships.find(s => s.id === id);
    if (ship) {
        const skillElement = document.getElementById(`skill-${id}`);
        if (ship.skillCountdown !== null) {
            if (ship.skillCountdown > 1) {
                ship.skillCountdown--;
                skillElement.innerHTML = `Skill: Attiva tra ${ship.skillCountdown} turni`;
                if (ship.skillCountdown === 1) {
                    skillElement.classList.add('skill-warning');
                    logEvent(`Skill della Nave ${id} sarà attivata al prossimo turno!`);
                }
            } else if (ship.skillCountdown === 1) {
                ship.skillCountdown--;
                skillElement.innerHTML = `Skill: ATTIVA!`;
                logEvent(`Skill della Nave ${id} attivata!`);

                // Applica l'effetto della skill e logga il messaggio
                applyShipSkillEffect(ship);

                ship.alarm = false;
                ship.skillCountdown = null; // Reset del countdown
                skillElement.classList.remove('skill-warning');
                syncAndSendState();
            }
        }
    }
}

function applyShipSkillEffect(ship) {
    switch (ship.id) {
        case 'ARDO':
            logEvent('Skill di ARDO attivata: Tutte le carte ARDO sul campo del giocatore vengono distrutte, inoltre ogni round che passa, una carta a scelta del giocatore viene distrutta fino a che l\'astronave resta in campo');
            // Implementa l'effetto secondo le meccaniche del gioco
            break;
        case 'GRANITO':
            logEvent('Skill di GRANITO attivata: Tutte le carte GRANITO del giocatore perdono 10 DEF inoltre tutte le carte GRANITO dei guardiani sono immortali fino a che l\'astronave è sul campo.');
            // Implementa l'effetto secondo le meccaniche del gioco
            break;
        case 'ARMONIO':
            logEvent('Skill di ARMONIO attivata: Tutte le carte ARMONIO del giocatore hanno i Doni inibiti finché l\'astronave ARMONIO non viene distrutta.');
            // Implementa l'effetto secondo le meccaniche del gioco
            break;
        case 'ILLUSIO':
            logEvent('Skill di ILLUSIO attivata: Le carte guardiano ILLUSIO delle navi hanno DEX +10, inoltre le carte ILLUSIO del giocatore sul campo durante l\'attivazione cambiano lato del campo.');
            // Implementa l'effetto secondo le meccaniche del gioco
            break;
        case 'MANPO':
            logEvent('Skill di MANPO attivata: Devi mandare al Cimitero tutte le carte in mano e pescare solo metà di esse, arrotondato per difetto.');
            // Implementa l'effetto secondo le meccaniche del gioco
            break;
        default:
            logEvent('Skill sconosciuta attivata.');
    }
}

// Avanza i turni
function nextTurn() {
    turnCounter++; // Incrementa i turni ogni volta che viene completato un turno
    if (playerTurn) {
        // Turno del giocatore
        logEvent(`Turno del Giocatore ${Math.ceil(turnCounter / 2)}.`); // Ogni round ha 2 turni
        turnIndicator.innerText = "Turno delle Navi";
        playerTurn = false;

        // Controllo se assegnare un oggetto bonus
        if (Math.ceil(turnCounter / 2) % BONUS_INTERVAL === 0 && availableObjects.length > 0) {
            const bonusObject = getRandomObjects(1)[0];
            playerObjects.push(bonusObject);
            logEvent(`Hai ricevuto un nuovo oggetto: ${bonusObject.name}`);
            renderObjects();
        }

    } else {
        // Turno delle navi
        ships.forEach(ship => {
            if (ship.skillCountdown !== null) {
                updateSkillStatus(ship.id);
            }
        });
        logEvent(`Turno delle Navi completato.`);

        turnIndicator.innerText = "Turno del Giocatore";
        playerTurn = true;

        // Incrementa i round solo dopo il turno delle navi
        if (turnCounter % 2 === 0) {
            roundCounter++;
            logEvent(`Fine del Round ${roundCounter}.`);
            updateCounters();

            if (roundCounter >= MAX_ROUNDS && !deathModeActivated) {
                deathModeActivated = true;
                logEvent("Modalità Morte attivata!");
                alert("Modalità Morte attivata!");

                // Aggiungi un indicatore visivo per la Modalità Morte
                const deathModeIndicator = document.createElement('div');
                deathModeIndicator.id = 'death-mode-indicator';
                deathModeIndicator.innerText = 'Modalità Morte Attiva';
                deathModeIndicator.classList.add('death-mode');
                document.getElementById('game-area').appendChild(deathModeIndicator);
            }
        }
    }

    syncAndSendState();
}


// Imposta la zona attuale
function setZone() {
    const zone = prompt("Inserisci la zona attuale (ARDO, GRANITO, ARMONIO, ILLUSIO, MANPO):");
    if (zone) {
        const zoneUpper = zone.trim().toUpperCase();
        if (SHIP_NAMES.includes(zoneUpper)) {
            currentZone = zoneUpper;
            currentZoneElement.innerText = zoneUpper;
            logEvent(`Zona attuale impostata su: ${zoneUpper}`);

            // Reset scudi e impostazione scudi speciali
            ships.forEach(ship => {
                ship.shields = SHIELD_POINTS;
            });
            const specialShip = ships.find(s => s.id === currentZone);
            if (specialShip) {
                specialShip.shields = SHIELD_POINTS + 50; // Esempio: +50 scudi
                logEvent(`Nave ${specialShip.id} ha scudi aumentati a ${specialShip.shields} a causa della zona.`);
            }

            renderShips();
            syncAndSendState();
        } else {
            alert("Zona non valida. Inserisci uno dei seguenti nomi: ARDO, GRANITO, ARMONIO, ILLUSIO, MANPO.");
        }
    }
}

// Log degli eventi
function logEvent(message) {
    const time = new Date().toLocaleTimeString();
    logElement.innerHTML += `<p>[${time}] ${message}</p>`;
    logElement.scrollTop = logElement.scrollHeight;
}

// Resetta il gioco
function resetGame() {
    deathModeActivated = false;
    // Rimuove l'indicatore della Modalità Morte se presente
    const deathModeIndicator = document.getElementById('death-mode-indicator');
    if (deathModeIndicator) {
        deathModeIndicator.remove();
    }

    turnCounter = 0;
    roundCounter = 0;
    playerTurn = true;
    currentZone = "?";
    currentZoneElement.innerText = "?";
    playerObjects = [];
    usedObjects = [];
    availableObjects = shuffleArray([...bonusObjects]); // Resetta e mescola gli oggetti disponibili
    ships.forEach(ship => {
        ship.shields = SHIELD_POINTS;
        ship.alarm = false;
        ship.skillCountdown = null;
    });

    renderShips(); // Re-render delle navi per aggiornare l'overlay
    renderObjects();
    updateCounters();
    logEvent("Gioco resettato.");
}

// Funzione per mescolare un array usando l'algoritmo Fisher-Yates
function shuffleArray(array) {
    let currentIndex = array.length, randomIndex;

    // Mentre ci sono elementi da mescolare
    while (currentIndex !== 0) {

        // Seleziona un elemento rimanente
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // E scambialo con l'elemento attuale
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

// Funzione per ottenere oggetti casuali e rimuoverli dall'array degli oggetti disponibili
function getRandomObjects(num) {
    const selectedObjects = [];
    for (let i = 0; i < num && availableObjects.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * availableObjects.length);
        const [object] = availableObjects.splice(randomIndex, 1);
        selectedObjects.push(object);
    }
    return selectedObjects;
}

// Sincronizza e invia lo stato attuale
function syncAndSendState() {
    if (playerMode === 2 && dataChannel && dataChannel.readyState === 'open') {
        const state = {
            ships,
            turnCounter,
            roundCounter,
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

// Mappa degli effetti tra gli Estro (assicurati che sia definita)
const mappaEffetti = {
  "Ardo": {
    "Ardo": { "bonus": 0 },
    "Granito": { "bonus": 2 },
    "Armonio": { "bonus": 10 },
    "Illusio": { "malus": -5 },
    "Manpo": { "malus": -10 }
  },
  "Granito": {
    "Granito": { "bonus": 0 },
    "Ardo": { "malus": -2 },
    "Armonio": { "bonus": 2 },
    "Illusio": { "bonus": 5 },
    "Manpo": { "bonus": 10 }
  },
  "Armonio": {
    "Armonio": { "bonus": 0 },
    "Ardo": { "malus": -10 },
    "Granito": { "malus": -2 },
    "Illusio": { "bonus": 10 },
    "Manpo": { "bonus": 5 }
  },
  "Illusio": {
    "Illusio": { "bonus": 0 },
    "Ardo": { "bonus": 10 },
    "Granito": { "malus": -10 },
    "Armonio": { "bonus": 5 },
    "Manpo": { "bonus": 2 }
  },
  "Manpo": {
    "Manpo": { "bonus": 0 },
    "Ardo": { "bonus": 5 },
    "Granito": { "bonus": 2 },
    "Armonio": { "malus": -2 },
    "Illusio": { "bonus": 10 }
  }
};

// Funzione per generare la tabella del cerchio degli estri
function generateCerchioEstriTable() {
  const container = document.getElementById('cerchio-estri-content');
  container.innerHTML = ''; // Pulisce il contenuto precedente

  const estros = Object.keys(mappaEffetti);

  // Crea la tabella
  let table = document.createElement('table');
  table.className = 'cerchio-estri-table';

  // Crea l'intestazione della tabella
  let thead = document.createElement('thead');
  let headerRow = document.createElement('tr');
  let emptyCell = document.createElement('th');
  emptyCell.textContent = 'Estro che attacca ▼';
  headerRow.appendChild(emptyCell);

  estros.forEach(estro => {
    let th = document.createElement('th');
    th.textContent = estro;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Crea il corpo della tabella
  let tbody = document.createElement('tbody');
  estros.forEach(estroAttaccante => {
    let row = document.createElement('tr');
    let th = document.createElement('th');
    th.textContent = estroAttaccante;
    row.appendChild(th);

    estros.forEach(estroDifensore => {
      let cell = document.createElement('td');
      const effetto = mappaEffetti[estroAttaccante][estroDifensore];
      if (effetto) {
        if (effetto.bonus) {
          cell.textContent = `+${effetto.bonus}`;
          cell.style.color = 'green';
        } else if (effetto.malus) {
          cell.textContent = `${effetto.malus}`;
          cell.style.color = 'red';
        } else {
          cell.textContent = '0';
        }
      } else {
        cell.textContent = '-';
      }
      row.appendChild(cell);
    });
    tbody.appendChild(row);
  });
  table.appendChild(tbody);

  container.appendChild(table);
}

// Event listener per aprire la modale e generare la tabella
document.getElementById('open-cerchio-estri').addEventListener('click', function() {
  document.getElementById('modal-cerchio-estri').style.display = 'block';
  generateCerchioEstriTable();
});

// Event listener per chiudere la modale quando si clicca sulla 'X'
document.getElementById('close-cerchio-estri').addEventListener('click', function() {
  document.getElementById('modal-cerchio-estri').style.display = 'none';
});

document.getElementById('open-target-section').addEventListener('click', openTargetSection);
document.getElementById('close-target-section').addEventListener('click', closeTargetSection);
document.getElementById('select-target-cards').addEventListener('click', selectTargetCards);


// Funzione per aprire la sezione bersagli
function openTargetSection() {
    const targetSection = document.getElementById('target-section');
    targetSection.classList.add('active');
}

// Funzione per chiudere la sezione bersagli
function closeTargetSection() {
    const targetSection = document.getElementById('target-section');
    targetSection.classList.remove('active');
}

// Funzione per selezionare casualmente 2 carte da bersagliare
function selectTargetCards() {
    const cardCountInput = document.getElementById('card-count');
    let cardCount = parseInt(cardCountInput.value, 10);

    if (isNaN(cardCount) || cardCount < 2) {
        alert('Per favore, inserisci un numero valido di carte (almeno 2).');
        return;
    }

    // Genera un array con le posizioni delle carte in campo (da sinistra a destra)
    let cardPositions = [];
    for (let i = 1; i <= cardCount; i++) {
        cardPositions.push(i);
    }

    // Mescola casualmente l'ordine delle carte per una rappresentazione randomica
    shuffleArray(cardPositions);

    // Seleziona le prime 2 carte dall'array mescolato
    let selectedCards = cardPositions.slice(0, 2);

    // Ordina le carte selezionate in base alla posizione originale (da sinistra a destra)
    selectedCards.sort((a, b) => a - b);

    // Determina casualmente se i guardiani attaccheranno dal TOT più alto o più basso
    let useHighestTOT = Math.random() < 0.5; // True = TOT più alto, False = TOT più basso

    // Genera il messaggio per l'attacco dei guardiani
    const guardianMessage = useHighestTOT
        ? "Le carte dei guardiani che attaccheranno saranno dal TOT più alto al più basso."
        : "Le carte dei guardiani che attaccheranno saranno dal TOT più basso al più alto.";

    // Ordina le carte in base alla logica scelta
    let attackOrder = useHighestTOT
        ? [...selectedCards].sort((a, b) => b - a) // TOT decrescente
        : [...selectedCards].sort((a, b) => a - b); // TOT crescente

    // Genera il messaggio per le carte bersaglio
    const targetMessage = `Le carte bersaglio dei guardiani sono la carta ${selectedCards[0]} e la carta ${selectedCards[1]} da sinistra verso destra del giocatore.`;

    // Determina e genera il messaggio sull'ordine di attacco
    const attackSequenceMessage = `Verrà prima attaccata la carta ${attackOrder[0]} e poi la carta ${attackOrder[1]}.`;

    // Mostra il messaggio completo
    alert(`${guardianMessage}\n\n${targetMessage}\n\n${attackSequenceMessage}`);

    // Logga gli eventi
    logEvent(guardianMessage);
    logEvent(targetMessage);
    logEvent(attackSequenceMessage);
}




// Chiude la modale se l'utente clicca al di fuori di essa
window.onclick = function(event) {
    const modal = document.getElementById('used-objects-modal');
    if (event.target === modal) {
        modal.style.display = "none";
    }

    const cerchioEstriModal = document.getElementById('modal-cerchio-estri');
    if (event.target === cerchioEstriModal) {
        cerchioEstriModal.style.display = "none";
    }
}


// At the end of script.js
window.openTargetSection = openTargetSection;
window.closeTargetSection = closeTargetSection;
window.selectTargetCards = selectTargetCards;
// Do this for all functions called from inline event handlers
