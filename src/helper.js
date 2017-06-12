let db;

var path = require('path');

var globalVueInstance = null;

var imap = require('imap-simple');
var Imap = require('imap');
let Vue = require('../node_modules/vue/dist/vue.min');

var inspect = require('util').inspect;
var fs = require('fs'), fileStream;

// get the client
var knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: path.join(__dirname,'database/vuetron.db')
    },
    useNullAsDefault: true
});

module.exports = {

    updateVueInstance: function(vueInstance){
        globalVueInstance = vueInstance;
    },

    getVueInstance: function(){
      return globalVueInstance;
    },

    /**
     *
     * @returns {*}
     */
    dbConn: function(){
        return knex;
    },

    /**
     *
     * @param template
     */
    compileTemplate: function(template){
        var compiled = Vue.compile(template);
        console.log(compiled);
        return compiled;
    },

    /**
     *
     * @param file
     * @returns {*}
     */
    readTemplateContents: function(file){
        var fs = require('fs');
        //var path = require('path');
        //var filePath = path.join(__dirname, file);

        return fs.readFileSync(file, 'utf8');
    },

    response: function(error, msg){
        return {error: error, message: msg};
    },

    /**
     *
     * @param mailFolder
     */
    syncImap: function(vueInstance, accountDetails, mailAccountId, mailFolder, sequenceNumber, syncFrom){
        var mailBox = require('./Mailbox/model/mailBox'); //Putting in top will cause issue
        console.log(syncFrom, sequenceNumber);
        const options = {
            imap: {
                authTimeout: 5000
            }
        };
        options.imap.user = accountDetails.email;
        options.imap.password = accountDetails.password;
        options.imap.host = accountDetails.incoming_server_hostname;
        options.imap.port = accountDetails.incoming_server_port;
        if(accountDetails.incoming_server_ssl === "SSL/TLS"){
            options.imap.tls = true;
        }

        /*var imapp = new Imap({
            user: accountDetails.email,
            password: accountDetails.password,
            host: accountDetails.incoming_server_hostname,
            port: 993,
            tls: true
        });

        imapp.on('ready', function() {
            imapp.getBoxes(function (err, folders) {
                if(err){
                    throw err.message;
                }
                console.log(folders);
            })
        });

        imapp.once('error', function(err) {
            console.log(err);
        });

        imapp.once('end', function() {
            console.log('Connection ended');
        });

        imapp.connect();*/

        //@Todo: Roadmap: include pop3 feature also
        /*
        if(accountDetails.incoming_server_type === "imap"){

        }else if(accountDetails.incoming_server_type === "imap"){

        }else{
            return "Oops;";
        }*/

        let toStore = [];

        if(sequenceNumber === null){
            //First time syncing
            if(syncFrom === null){

                //Sync mails specified from date
                imap.connect(options).then(function (connection) {

                    return connection.openBox(mailFolder).then(function () {
                        var searchCriteria = [
                            'All'
                        ];

                        var fetchOptions = {
                            bodies: ['HEADER', ''],
                            struct: true
                            //markSeen: false
                        };

                        return connection.search(searchCriteria, fetchOptions).then(function (results) {
                            //console.log(results);
                            results.map(function (res) {
                                toStore.push({
                                    sequence_number: res.seqNo,
                                    headers: JSON.stringify(res.parts[0].body),
                                    body: res.parts[1].body,
                                    folder: mailFolder,
                                    mail_account_id: mailAccountId
                                });
                            });
                        });
                    });
                }).then(function () {
                    console.log(toStore);
                    mailBox.store(vueInstance, toStore);
                }).catch(function (error) {
                    console.log(error.message);
                });

            }else{

                //Sync mails specified from date
                imap.connect(options).then(function (connection) {

                    return connection.openBox(mailFolder).then(function () {
                        var searchCriteria = [
                            'All',
                            ['SINCE', syncFrom]
                        ];

                        var fetchOptions = {
                            bodies: ['HEADER', ''],
                            struct: true
                            //markSeen: false
                        };

                        return connection.search(searchCriteria, fetchOptions).then(function (results) {
                            //console.log(results);
                            results.map(function (res) {
                                toStore.push({
                                    sequence_number: res.seqNo,
                                    headers: JSON.stringify(res.parts[0].body),
                                    body: res.parts[1].body,
                                    folder: mailFolder,
                                    mail_account_id: mailAccountId
                                });
                            });
                        });
                    });
                }).then(function () {
                    console.log(toStore);
                    mailBox.store(vueInstance, toStore);
                }).catch(function (error) {
                    console.log(error.message);
                });
            }
        }else{

            //Sync mails using specific UID
            imap.connect(options).then(function (connection) {

                return connection.openBox(mailFolder).then(function () {
                    var searchCriteria = [
                        'All',
                        ['UID', '*:'+(sequenceNumber)]
                    ];

                    var fetchOptions = {
                        bodies: ['HEADER', ''],
                        struct: true
                        //markSeen: false
                    };

                    return connection.search(searchCriteria, fetchOptions).then(function (results) {
                        //console.log(results);
                        results.map(function (res) {
                            toStore.push({
                                sequence_number: res.seqNo,
                                headers: JSON.stringify(res.parts[0].body),
                                body: res.parts[1].body,
                                folder: mailFolder,
                                mail_account_id: mailAccountId
                            });
                        });
                    });
                });
            }).then(function () {
                console.log(toStore);
                mailBox.store(vueInstance, toStore);
            }).catch(function (error) {
                console.log(error.message);
            });
        }
    }
};

