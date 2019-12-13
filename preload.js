const { ipcRenderer } = require('electron')

window.configset = function(val) {
    ipcRenderer.send('submitchange', val)
}