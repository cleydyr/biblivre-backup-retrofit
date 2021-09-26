const {
    contextBridge,
    ipcRenderer
} = require("electron");

const START_PROCESS = 'start-process';
const PROCESS_STARTED = 'process-started';
const UPDATE_PROCESS_STATUS = 'update-process-status';
const PROCESS_FINISHED = 'process-finished';

console.log(__dirname);

contextBridge.exposeInMainWorld(
    "api", {
        events: {
            START_PROCESS, PROCESS_STARTED, UPDATE_PROCESS_STATUS, PROCESS_FINISHED
        },
        send: (channel, data) => {
            // whitelist channels
            const validChannels = [START_PROCESS];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        },
        receive: (channel, func) => {
            const validChannels = [PROCESS_STARTED, PROCESS_FINISHED, UPDATE_PROCESS_STATUS];

            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender` 
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
        }
    }
);