const helper = require('../helper');
var path = require('path');
var mailbox = require('./model/mailBox');
var mailAccount = require('../Account/model/mailAccount');
const ipc = require('electron').ipcRenderer;
const fs = require('fs');

module.exports = {
    mailFolderComponent: {
        template: helper.readTemplateContents(path.join(__dirname, '/templates/list-messages.vue')),

        data: function(){
            return {
                contents: '',
                sync: 'sync',
                disabled: false
            }
        },

        methods:{
            syncFolder: function(){
                let vue = this;
                vue.disabled = true;
                vue.sync = 'syncing....';
                mailAccount.findAndSync(this, this.$route.params.id, this.$route.params.folder);
            },
        },

        watch: {
            '$route' (to, from) {
                // react to route changes...
                mailbox.fetchFolder(this, this.$route.params.id, this.$route.params.folder);
            }
        },

        mounted: function(){
            mailbox.fetchFolder(this, this.$route.params.id, this.$route.params.folder);
        }
    },

    messageComponent: {
        template: helper.readTemplateContents(path.join(__dirname, '/templates/display-mail-contents.vue')),

        data: function () {
            return {
                body: '',
                attachments: []
            };
        },

        methods: {
            downloadAttachment: function(id){
                let file = this.attachments[id].filename;
                let buffer = this.attachments[id].content
                ipc.send('save-attachment'); //Refer project root folder main.js

                ipc.on('selected-directory', function (event, path) {
                    if (!path) path = 'No path';
                    //Save the file in the path
                    fs.writeFile(path+"/"+file, buffer, (err) => {
                        if (err) console.log(err);
                        console.log('The file has been saved!');
                    });
                });
            },

            openMessageWindow: function (type) {
                const { remote } = require('electron');
                const { BrowserWindow } = remote;
                // Create the browser window.
                win = new BrowserWindow({width: 800, height: 600});

                // and load the index.html of the app.
                win.loadURL(`file://${__dirname}/../Message/index.html?type=`+type+`&account=`+this.$route.params.id+`&sequence-number=`+this.$route.params.sequence_number);

                // Open the DevTools.
                win.webContents.openDevTools();

                // Emitted when the window is closed.
                win.on('closed', () => {
                    // Dereference the window object, usually you would store windows
                    // in an array if your app supports multi windows, this is the time
                    // when you should delete the corresponding element.
                    win = null;
            });
            }
        },

        watch: {
            '$route' (to, from) {
                // react to route changes...
                //mailbox.fetchFolder(this, this.$route.params.id, this.$route.params.folder);
            }
        },

        mounted: function(){
            mailbox.find(this, this.$route.params.id, this.$route.params.sequence_number)
        }
    }
};