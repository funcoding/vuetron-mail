//All the model functions are placed here

const helper = require('../../helper');
const knex = helper.dbConn();

let dateFormat = require('dateformat');
let now = new Date();
const util = require('util');
const table = 'mailbox';
let simpleParser = require('mailparser').simpleParser;

module.exports = {

    fetchFolder: function(vueInstance, mailAccount, folder){
        knex.select()
            .table(table)
            .where('mail_account_id', mailAccount)
            .where('folder', folder)
            .whereNot('headers', '=', '{}') //In rare case headers is stored as {} . Have to dig into.
            .orderBy('sequence_number', 'desc')
            .then(function(rows) {
                /*let temp = [];
                for(let i=0;i<rows.length;i++){
                    simpleParser(rows[i].body, (err, mail)=>{
                        temp.push({
                            from: mail.from,
                            subject: mail.subject,
                            date: mail.date,
                            attachments: mail.attachments.length
                        });
                    });
                }
                console.log(temp);
                vueInstance.contents = temp;*/
                vueInstance.contents = rows;
            }).catch(function(error) {
                console.log(error.message);
            });
    },

    store: function(vueInstance, data){
        var i = 0;
        var toInsert = [];
        var index = 0;
        while (i < data.length){
            knex.table(table)
                .update('body', data[i].body)
                .where('sequence_number', data[i].sequence_number)
                .then(function(updated){
                    if(updated !== 1){
                        knex.insert({
                            sequence_number: data[index].sequence_number,
                            headers: data[index].headers,
                            body: data[index].body,
                            folder: data[index].folder,
                            mail_account_id: data[index].mail_account_id
                        }).into(table).then(function (status) {
                            console.log(status);
                        }).catch(function (error) {
                            console.error(error.message);
                        });
                        index++;
                    }
                }).catch(function (error) {
                    console.error(error.message);
            });
            i++;
        }
    },

    find: function (vueInstance, account, sequenceNumber) {

        knex.table(table)
            .where('sequence_number', sequenceNumber)
            .where('mail_account_id', account)
            .first()
            .then(function (result) {
                simpleParser(result.body, (err, mail)=>{
                    if(mail.html !== false){
                        vueInstance.body = mail.html;
                    }else if(mail.textAsHtml !== false){
                        vueInstance.body = mail.textAsHtml;
                    }else{
                        vueInstance.body = mail.text;
                    }

                    if(mail.attachments.length > 0)
                    {
                        for(var i=0;i<mail.attachments.length;i++){
                            vueInstance.attachments.push(mail.attachments[i]);
                        }
                    }
                });
            })
            .catch(function (error) {
                console.error(error.message);
            });
    },

    messageModule: function (vueInstance, account, sequenceNumber, type) {
        knex.table(table)
            .where('sequence_number', sequenceNumber)
            .where('mail_account_id', account)
            .first()
            .then(function (result) {
                simpleParser(result.body, (err, mail)=>{
                    if(type === 'reply'){
                        vueInstance.to = JSON.parse(result.headers).from;
                        vueInstance.subject = mail.subject;
                        vueInstance.content = '<br>On '+mail.date+" "
                            +JSON.parse(result.headers).from
                            +" wrote:<br>"+mail.html;
                        vueInstance.tinyMce.init({
                            selector: '#content'
                        });
                    }else if(type === 'reply-all'){
                        vueInstance.to = JSON.parse(result.headers).from;
                        vueInstance.cc = JSON.parse(result.headers).cc;
                        vueInstance.subject = mail.subject;
                        vueInstance.content += mail.html;
                        vueInstance.tinyMce.init({
                            selector: '#content'
                        });
                    }else if(type === 'forward'){
                        vueInstance.content = mail.html;
                        vueInstance.subject += mail.subject;
                        vueInstance.tinyMce.init({
                            selector: '#content'
                        });
                    }
                });
            })
            .catch(function (error) {
                console.error(error.message);
            });
    }
};