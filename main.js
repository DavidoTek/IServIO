const {app, BrowserWindow, Menu, ipcMain, shell} = require('electron')
const path = require('path')
const config = require('electron-json-config')

let mainWindow

function createWindow () {
    mainWindow = new BrowserWindow({
        width: config.has('winwidth') ? config.get('winwidth', 800) : 800,
        height: config.has('winheight') ? config.get('winheight', 640) : 640,
        minWidth: 800,
        minHeight: 600,
        x: config.has('winx') ? config.get('winx', 200) : 200,
        y: config.has('winy') ? config.get('winy', 200) : 200,
        icon: path.join(__dirname, '/iservio.png'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    if (config.has('iservurl')) {
        mainWindow.loadURL(config.get('iservurl', ''))
    } else {
        mainWindow.loadFile('settings.html')
    }

    var menu = Menu.buildFromTemplate([
        {
            label: 'File',
            submenu: [
                {
                    label: 'Home',
                    click() {
                        if (config.has('iservurl')) {
                            mainWindow.loadURL(config.get('iservurl', ''))
                        } else {
                            mainWindow.loadFile('settings.html')
                        }
                    }
                },
                {
                    label: 'Settings',
                    click() {
                        mainWindow.loadFile('settings.html')
                    }
                },
                {
                    label: 'Save window size',
                    click() {
                        config.set('winwidth', mainWindow.getBounds().width)
                        config.set('winheight', mainWindow.getBounds().height)
                        config.set('winx', mainWindow.getBounds().x)
                        config.set('winy', mainWindow.getBounds().y)
                    }
                },
                {type: 'separator'},
                {
                    label: 'About',
                    click() {
                        mainWindow.loadFile('about.html')
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
    
    mainWindow.webContents.on('new-window', function(e, url) {
        if('file://' === url.substr(0, 'file://'.length)) {
            return;
        }     
        e.preventDefault();
        shell.openExternal(url);
    });
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
