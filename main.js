const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require("fs");
const path = require("path");
const csv = require('csv-parser');

const file_path = path.join(__dirname, "/All_csv_files/master.csv")


function createWindow() {
        const win = new BrowserWindow({
                width: 900,
                height: 1000,
                webPreferences: {
                        nodeIntegration: true,
                        contextIsolation: false
                }
        })

        win.loadFile("index.html")
        fs.createReadStream(file_path)
                .pipe(csv())
                .on('data', (row) => {
                        console.log(row.filename);
                        ipcMain.once("reply", (event, data) => {
                                event.sender.send("sendFromMain", row.filename);
                        })
                })
                .on('end', () => {
                        console.log('CSV file successfully processed');
                });

}
app.whenReady().then(createWindow);
