import { app, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { START_PROCESS, PROCESS_STARTED, UPDATE_PROCESS_STATUS, PROCESS_FINISHED } from './constants';
import { process as _process } from './processor/main';
import { homedir } from 'os';
import { destinationPath } from './util/destinationPath';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on(START_PROCESS, async (event, path) => {
  event.reply(PROCESS_STARTED, path);

  const backupFile = await _process(path, (status) => {
    event.reply(UPDATE_PROCESS_STATUS, status);
  })

  const destination = destinationPath(backupFile, homedir());

  event.sender.downloadURL(`file://${backupFile}`);

  event.reply(PROCESS_FINISHED, destination);
});


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
