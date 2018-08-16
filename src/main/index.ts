import * as electron from 'electron';
import * as ipc from 'electron-better-ipc';
import * as fs from 'fs';
import { IJSXSource } from 'interfaces';
import * as launchEditor from 'react-dev-utils/launchEditor';
import { promisify } from 'util';

import dragDrop from './controllers/dragDrop';
import remove from './controllers/remove';

const writeFileAsync = promisify(fs.writeFile);

let mainWindow: electron.BrowserWindow | null;

function createWindow() {
  mainWindow = new electron.BrowserWindow({ width: 1280, height: 800 });

  // and load the index.html of the app.
  mainWindow.loadURL('http://localhost:7979');

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
electron.app.on('ready', createWindow);

// Quit when all windows are closed.
electron.app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    electron.app.quit();
  }
});

electron.app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

ipc.answerRenderer<{ start: IJSXSource; end: IJSXSource }>(
  'drag-drop',
  body => {
    dragDrop(body).then(newTargetFileText => {
      writeFileAsync(body.end.fileName, newTargetFileText);
    });
  },
);

ipc.answerRenderer<{ start: IJSXSource }>('remove', body => {
  remove(body).then(newTargetFileText => {
    writeFileAsync(body.start.fileName, newTargetFileText);
  });
});

ipc.answerRenderer<{ start: IJSXSource }>('open-file', body => {
  launchEditor(body.start.fileName, body.start.lineNumber);
});
