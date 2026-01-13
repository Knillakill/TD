// Point d'entrée du jeu
const game = new Phaser.Game(GameConfig);

/**
 * Solution pour garder le jeu actif en arrière-plan
 * Les navigateurs throttle requestAnimationFrame quand l'onglet n'est pas visible
 * On utilise un Web Worker + AudioContext pour contourner cette limitation
 */

// Méthode 1: Web Worker (plus fiable)
let backgroundWorker = null;
let isPageVisible = true;

// Créer le worker inline pour éviter les problèmes CORS
const workerCode = `
    let intervalId = null;
    self.onmessage = function(e) {
        if (e.data === 'start') {
            if (intervalId === null) {
                intervalId = setInterval(() => {
                    self.postMessage('tick');
                }, 16);
            }
        } else if (e.data === 'stop') {
            if (intervalId !== null) {
                clearInterval(intervalId);
                intervalId = null;
            }
        }
    };
`;

try {
    const blob = new Blob([workerCode], { type: 'application/javascript' });
    backgroundWorker = new Worker(URL.createObjectURL(blob));
    
    backgroundWorker.onmessage = function(e) {
        if (e.data === 'tick' && !isPageVisible && game && game.loop) {
            // Forcer une mise à jour du jeu quand l'onglet est caché
            const time = performance.now();
            const delta = game.loop.delta;
            
            // Appeler step manuellement sur le loop
            if (game.loop.running) {
                game.loop.step(time);
            }
        }
    };
    
    console.log('[BackgroundGame] Web Worker créé avec succès');
} catch (error) {
    console.warn('[BackgroundGame] Impossible de créer le Web Worker:', error);
}

// Détecter quand la page devient visible/invisible
document.addEventListener('visibilitychange', () => {
    isPageVisible = !document.hidden;
    
    if (backgroundWorker) {
        if (document.hidden) {
            // Page cachée - démarrer le worker pour maintenir le jeu
            backgroundWorker.postMessage('start');
            console.log('[BackgroundGame] Onglet caché - Worker activé');
        } else {
            // Page visible - arrêter le worker (le RAF reprend)
            backgroundWorker.postMessage('stop');
            console.log('[BackgroundGame] Onglet visible - Worker désactivé');
        }
    }
});

// Méthode 2: Fallback avec setInterval (moins précis mais fonctionne)
let fallbackInterval = null;

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Démarrer un fallback setInterval
        if (!fallbackInterval) {
            fallbackInterval = setInterval(() => {
                if (game && game.loop && game.loop.running) {
                    game.loop.step(performance.now());
                }
            }, 100); // 10 fps en arrière-plan (suffisant pour un TD)
        }
    } else {
        // Arrêter le fallback
        if (fallbackInterval) {
            clearInterval(fallbackInterval);
            fallbackInterval = null;
        }
    }
});

// Nettoyage à la fermeture
window.addEventListener('beforeunload', () => {
    if (backgroundWorker) {
        backgroundWorker.postMessage('stop');
        backgroundWorker.terminate();
    }
    if (fallbackInterval) {
        clearInterval(fallbackInterval);
    }
});

/**
 * Garder l'audio actif en arrière-plan
 * Les navigateurs suspendent l'AudioContext quand l'onglet perd le focus
 * On utilise plusieurs techniques pour contourner cette limitation
 */

let silentOscillator = null;
let silentGain = null;

// Créer un oscillateur silencieux pour maintenir l'AudioContext actif
function createSilentKeepAlive(audioContext) {
    try {
        // Créer un oscillateur à volume 0 pour garder le contexte actif
        silentOscillator = audioContext.createOscillator();
        silentGain = audioContext.createGain();
        
        silentOscillator.connect(silentGain);
        silentGain.connect(audioContext.destination);
        
        // Volume à 0 (silencieux)
        silentGain.gain.value = 0;
        
        // Démarrer l'oscillateur
        silentOscillator.start(0);
        
        console.log('[BackgroundAudio] Oscillateur silencieux créé pour maintenir l\'audio');
    } catch (error) {
        console.warn('[BackgroundAudio] Impossible de créer l\'oscillateur:', error);
    }
}

// Attendre que le jeu soit prêt puis créer le keepalive
function initAudioKeepAlive() {
    if (game && game.sound && game.sound.context) {
        createSilentKeepAlive(game.sound.context);
        return true;
    }
    return false;
}

// Essayer d'initialiser l'audio keepalive (attendre que le jeu soit prêt)
let audioInitAttempts = 0;
const audioInitInterval = setInterval(() => {
    audioInitAttempts++;
    if (initAudioKeepAlive() || audioInitAttempts > 100) {
        clearInterval(audioInitInterval);
    }
}, 100);

document.addEventListener('visibilitychange', () => {
    if (game && game.sound && game.sound.context) {
        const audioContext = game.sound.context;
        
        // Toujours essayer de reprendre l'audio quand on change d'onglet
        if (audioContext.state === 'suspended') {
            audioContext.resume().then(() => {
                console.log('[BackgroundAudio] AudioContext repris');
            }).catch(err => {
                console.warn('[BackgroundAudio] Impossible de reprendre l\'audio:', err);
            });
        }
    }
});

// Vérifier périodiquement que l'audio n'est pas suspendu (toutes les 500ms)
setInterval(() => {
    if (game && game.sound && game.sound.context) {
        const audioContext = game.sound.context;
        if (audioContext.state === 'suspended') {
            audioContext.resume().catch(() => {});
        }
    }
}, 500);