const {app, BrowserWindow, Menu, ipcMain} = require('electron')
const path = require('path')
const config = require('electron-json-config')

let mainWindow

function createWindow () {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 640,
        minWidth: 800,
        minHeight: 600,
        icon: path.join(__dirname, '/iservio.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    if (config.has('iservurl')) {
        mainWindow.loadURL(config.get('iservurl', ''))
    } else {
        mainWindow.loadFile('index.html')
    }

    var menu = Menu.buildFromTemplate([
        {
            label: 'File',
            submenu: [
                {
                    label: 'Settings',
                    click() {
                        mainWindow.loadFile('index.html')
                    }
                },
                {type: 'separator'},
                {
                    label: 'Exit',
                    click() {
                        app.quit()
                    }
                }
            ]
        }
    ])
    Menu.setApplicationMenu(menu)

    mainWindow.on('closed', function () {
        mainWindow = null
    })
}

app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) createWindow()
})

ipcMain.on('submitchange', (event, arg) => {
    config.set('iservurl', arg)
    mainWindow.loadURL(arg)
})
