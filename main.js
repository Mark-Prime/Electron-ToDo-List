const electron = require('electron');
const url = require('url');
const path = require('path');

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow; 

// Listen for app to be ready
app.on('ready', function(){
    // Create new window
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    })

    // Quit app when closed
    mainWindow.on('closed', function() {
        app.quit()
    })

    // Load html file into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }))

    // Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
    // Insert Menu
    Menu.setApplicationMenu(mainMenu)
})

// Handle create add window
function createAddWindow() {
    // Create new window
    addWindow = new BrowserWindow({
        height: 200,
        width:  300,
        webPreferences: {
            nodeIntegration: true,
        },
    });

    // Load html file into window
    addWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, "addWindow.html"),
        protocol: "file:",
        slashes: true,
      })
    );

    // Garbage collection
    addWindow.on("closed", function () {
      addWindow = null;
    });
}

// Catch item:add
ipcMain.on('item:add', function(event, item) {
    console.log(item)
    mainWindow.webContents.send('item:add', item);
    addWindow.close()
})

// Create menu template
const mainMenuTemplate = [
    {
        label: 'File', 
        submenu: [
            {
                label: 'Add Item',
                click() {
                    createAddWindow()
                },
            },
            {
                label: 'Clear Items',
                click(){
                    mainWindow.webContents.send('item:clear');
                }
            },
            {
                label: 'Quit',
                accelerator: 'CmdOrCtrl+Q',
                click(){
                    app.quit()
                }
            }
        ]
    }
]

// If Mac add empty object to menu
if (process.platform === 'darwin') {
    mainMenuTemplate.unshift({
      label: "Electron",
    });
}

if (process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
      label: "Developer Tools",
      submenu: [
        {
          label: "Toggle Developer Tools",
          accelerator: "CmdOrCtrl+I",
          click(item, focusedWindow) {
              focusedWindow.toggleDevTools();
          },
        },
        {
            role: 'reload'
        }
      ],
    });
}