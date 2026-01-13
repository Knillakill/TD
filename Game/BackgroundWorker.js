/**
 * Web Worker pour maintenir le jeu actif en arrière-plan
 * Les navigateurs ne throttle pas les Web Workers
 */

// Interval en ms (16ms ≈ 60fps)
const TICK_INTERVAL = 16;

let intervalId = null;

self.onmessage = function(e) {
    if (e.data === 'start') {
        if (intervalId === null) {
            intervalId = setInterval(() => {
                self.postMessage('tick');
            }, TICK_INTERVAL);
        }
    } else if (e.data === 'stop') {
        if (intervalId !== null) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }
};

