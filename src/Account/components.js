const helper = require('../helper');
var path = require('path');
var mailx = require('mailx');
var mailAccount = require('./model/mailAccount');
var dateFormat = require('dateformat');
const ipc = require('electron').ipcRenderer;

module.exports = {
    addNewMailAccountComponent: {
        template: helper.readTemplateContents(path.join(__dirname, '/templates/add-mail-account.vue')),
        data: function () {
            return {
                message: '',
                display: false,
                name: '',
                email: '',
                password: '',
                incoming_server_type: 'imap',
                incoming_server_hostname: '',
                incoming_server_port: '',
                incoming_server_ssl: 'SSL/TLS',
                incoming_server_authentication: '',
                outgoing_server_hostname: '',
                outgoing_server_port: '',
                outgoing_server_ssl: 'SSL/TLS',
                outgoing_server_authentication: '',
                sync_duration: '',
                sync_from: '',
                disable_submit_button: 'false'
            }
        },
        methods: {
            /**
             *
             * @returns {Array}
             */
            syncDuration: function () {
                return [1, 5, 10, 15, 30, 45, 60];
            },

            /**
             *
             * @returns {{1: string, 3: string, 14: string, 30: string, 0: string}}
             */
            syncFrom:function () {
                return {
                    1: 'Last day',
                    3: 'Last three days',
                    14: 'Last two weeks',
                    30: 'Last month',
                    //0: 'All'
                }
            },

            /**
             *
             */
            submitForm: function () {
                var now = new Date();
                let vue = this;
                vue.message = 'Processing..';
                //this.disable_submit_button = 'disabled';
                if (this.validate()) {
                    this.sync_from = this.sync_from !== 0 ?
                        dateFormat(now.setDate(now.getDate() - this.sync_from), "mmmm d, yyyy") : null;

                    let options = {
                        imap: {
                            authTimeout: 3000
                        }
                    };
                    options.imap.user = this.email;
                    options.imap.password = this.password;
                    options.imap.host = this.incoming_server_hostname;
                    options.imap.port = this.incoming_server_port;
                    options.imap.tls = this.incoming_server_ssl === "SSL/TLS";

                    mailAccount.create(this ,{
                        name: this.name,
                        email: this.email,
                        password: this.password,
                        incoming_server_type: this.incoming_server_type,
                        incoming_server_hostname: this.incoming_server_hostname,
                        incoming_server_port: this.incoming_server_port,
                        incoming_server_ssl: this.incoming_server_ssl,
                        incoming_server_authentication: this.incoming_server_authentication,
                        outgoing_server_hostname: this.outgoing_server_hostname,
                        outgoing_server_port: this.outgoing_server_port,
                        outgoing_server_ssl: this.outgoing_server_ssl,
                        outgoing_server_authentication: this.outgoing_server_authentication,
                        sync_duration: this.sync_duration,
                        sync_from: this.sync_from
                    }).then(function () {
                        //@TODO: Try exploring the correct way if any
                        mailAccount.all(helper.getVueInstance().$router.app.$children[1]);
                    }).catch(function (err) {
                        vue.message = err.message;
                    });

                    vue.display = true;
                }
            },

            validate: function () {
                //Will be implemented in next update
                return true;
                var message = mailx.message();
                message.setFrom('me', this.email);
                message.addTo('you', 'vinaykumar1989@gmail.com');
                message.setSubject('hello');
                message.setText('This is a test message');

                var transport = mailx.transport(this.outgoing_server, parseInt(this.outgoing_server_port), this.email, this.password);
                transport.send(message, function(err,result) {
                   if(typeof result !== 'undefined')
                   {
                       console.log(result);
                       return true;
                   }else{
                       this.disable_submit_button = '';
                       console.log(err);
                       return false;
                   }
                });

                return false;
            }
        }
    },

    editMailAccountComponent:{
        template: helper.readTemplateContents(path.join(__dirname, '/templates/edit-mail-account.vue')),

        data: function () {
            return {
                message: '',
                display: 'false',
                name: '',
                email: '',
                password: '',
                incoming_server_type: '',
                incoming_server_hostname: '',
                incoming_server_port: '',
                incoming_server_ssl: '',
                incoming_server_authentication: '',
                outgoing_server_hostname: '',
                outgoing_server_port: '',
                outgoing_server_ssl: '',
                outgoing_server_authentication: '',
                sync_duration: '',
                sync_from: '',
                disable_submit_button: 'false'
            }
        },

        methods: {
            syncDuration: function () {
                return [1, 5, 10, 15, 30, 45, 60];
            },

            submitForm: function () {
                let vue = this;
                vue.message = 'Processing...';
                mailAccount.update(this,
                    this.$route.params.id,
                    {
                        name: this.name,
                        email: this.email,
                        password: this.password,
                        incoming_server_type: this.incoming_server_type,
                        incoming_server_hostname: this.incoming_server_hostname,
                        incoming_server_port: this.incoming_server_port,
                        incoming_server_ssl: this.incoming_server_ssl,
                        incoming_server_authentication: this.outgoing_server_authentication,
                        outgoing_server_hostname: this.outgoing_server_hostname,
                        outgoing_server_port: this.outgoing_server_port,
                        outgoing_server_ssl: this.outgoing_server_ssl,
                        outgoing_server_authentication: this.outgoing_server_authentication,
                        sync_duration: this.sync_duration
                    }
                ).then(function () {
                    vue.message = 'Updated';
                }).catch(function (err){
                    vue.message = err.message;
                });

                this.display = true;
            }
        },
        watch: {
            '$route' (to, from) {
                // react to route changes...
                mailAccount.find(this, this.$route.params.id);
            }
        },

        beforeMount: function () {
            mailAccount.find(this, this.$route.params.id);
        }
    },

    listMailAccounts: {
        template: helper.readTemplateContents(path.join(__dirname, '/templates/list-accounts.vue')),

        data: function () {
            return {
                accounts: '',
                displayMenu: false
            }
        },

        methods:{
            compose: function (account) {
                const { remote } = require('electron');
                const { BrowserWindow } = remote;
                // Create the browser window.
                win = new BrowserWindow({width: 800, height: 600});
                win.loadURL(`file://${__dirname}/../Message/index.html?type=compose&account=`+account);

                // Open the DevTools.
                win.webContents.openDevTools();

                // Emitted when the window is closed.
                win.on('closed', () => {
                    // Dereference the window object, usually you would store windows
                    // in an array if your app supports multi windows, this is the time
                    // when you should delete the corresponding element.
                    win = null;
                });
            },

            expandMenu: function(id){
                let current = document.getElementById('dropdown-'+id).style.display;
                document.getElementById('dropdown-'+id).style.display = current === 'none' ? 'block' : 'none';
            },

            removeAccount(val){
                ipc.send('open-confirm-account-deletion-dialog');
                ipc.on('information-dialog-selection', function (event, index) {
                    if (index === 0){
                        //Hide the dropdown because after re-rendering the index changes. Another option is to hide raather than re-rendering
                        document.getElementById('dropdown-'+val).style.display = 'none';
                        //Proceed with deletion
                        mailAccount.destroy(val).then(function () {
                            //Refresh the component
                            mailAccount.all(helper.getVueInstance().$router.app.$children[1]);
                        });
                    }
                })
            }
        },

        beforeMount: function(){
            mailAccount.all(this);
        }
    }

};