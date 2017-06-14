const Vue = require('../../node_modules/vue/dist/vue.min');
const mailbox = require('../Mailbox/model/mailBox');
window.$ = window.jQuery = require('jquery');
const helper = require('../helper');
const remote = require('electron').remote;
let currentWindow = remote.getCurrentWindow();
require('../global-components/info');

const nodemailer = require('nodemailer');

var app = new Vue({
    el: '#app',
    data: {
        message: '',
        type: '',
        account: '',
        sequenceNumber: '',
        to: '',
        cc: '',
        subject:'',
        content: '',
        attachments: [],
        tinyMce: tinymce
    },

    methods: {
        getMessageDetails: function () {
            mailbox.messageModule(this, this.account, this.sequenceNumber, this.type);
        },
        attach: function(){
            const {dialog} = require('electron').remote;
            dialog.showOpenDialog({
                properties: ['multiSelections']
            }, function (files) {
                if (files){
                    for(var i=0;i<files.length;i++)
                    {
                        this.app.attachments.push(files[i]);
                    }
                }
            });

            console.log(this.attachments);
        },

        removeAttachment: function (index) {
            this.attachments.splice(index, 1);
        },

        send: function () {
            //Trigger the maild
            let knex = helper.dbConn();
            let vue = this;

            let mailOptions = {
                to: this.to, // list of receivers
                subject: this.subject, // Subject line
                //text: '', // plain text body
                html: this.tinyMce.activeEditor.getContent() // html body
            };

            if(this.cc !== ''){
                mailOptions.cc = this.cc;
            }

            //Include the attachments
            if(this.attachments.length > 0)
            {
                let temp = [];
                for(var i=0;i<this.attachments.length;i++)
                {
                    let filename = this.attachments[i].split('/');
                    temp.push({filename: filename[filename.length - 1], path: this.attachments[i]})
                }
                mailOptions.attachments = temp;
            }

            knex.table('mail_account')
                .where('id', this.account)
                .first()
                .then(function (account) {

                    mailOptions.from = '"'+account.name+'" <'+account.email+'>';
                    let transporter = nodemailer.createTransport({
                        host: account.outgoing_server_hostname,
                        port: parseInt(account.outgoing_server_port),
                        secure: parseInt(account.outgoing_server_port) === 465, // secure:true for port 465, secure:false for port 587
                        auth: {
                            user: account.email,
                            pass: account.password
                        }
                    });

                    vue.message = "Sending message. Will close automatically if sent.";
                    // send mail with defined transport object
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            console.log(error);
                            vue.message = error.message;
                        }else{
                            console.log('Message %s sent: %s', info.messageId, info.response);
                            currentWindow.close();
                        }
                    });
                }).catch(function (err) {
                    console.log(err);
            });
        }
    },

    beforeMount: function () {
        let params = new URL(window.location.href).searchParams;
        this.type = params.get('type');
        this.account = params.get('account');
        this.sequenceNumber = params.get('sequence-number');
        if(this.type !== 'compose'){
            this.getMessageDetails();
        }else{
            //No choice but to initialize here
            this.tinyMce.init({
                selector: '#content'
            });
        }
    }
});