//All the model functions are placed here

const helper = require('../../helper');
const knex = helper.dbConn();

var dateFormat = require('dateformat');
var now = new Date();

const table = 'mail_account';

//knex is a promise so vueInstance has to be passed. Hoping better way is there.

module.exports = {

    /**
     *
     * @param vueInstance
     * @param data
     */
    create: function(vueInstance, data){
        //Check if exits. If exits then update else insert
        data.created_at = dateFormat(now, 'yyyy-mm-dd HH:MM:ss');
        data.updated_at = dateFormat(now, 'yyyy-mm-dd HH:MM:ss');

        return knex.table(table).where('email', data.email).first('id').then(function(row) {
            if(typeof row !== 'undefined'){
                vueInstance.message = "Account exists.";
            }else{

                knex.insert(data).into(table).then(function() {
                    vueInstance.message = "Account created.";
                    //Redirect to mail listing
                    //window.location = "#/bar";
                }).catch(function(error) {
                    vueInstance.message = error.message;
                });
            }
        });
    },

    /**
     *
     * @param id
     * @param data
     * @returns {*}
     */
    update: function(vueInstance, id, data) {

        data.updated_at = dateFormat(now, 'yyyy-mm-dd HH:MM:ss');

        return knex.table(table).where('id', '=', id).update(data).then(function() {

            return helper.response(false, 'updated successfully');

        }).catch(function(error) {
            console.error(error);
            return helper.response(true, error);
        });
    },

    /**
     *
     * @param id
     * @returns {*}
     */
    destroy: function(id){
        return knex.table(table).where('id', id).del().then(function(status) {
            console.log(status);
        }).catch(function(error) {
            console.error(error);
        });
    },

    /**
     *
     * @returns {*}
     */
    all: function(vueInstance){

        knex.select('id', 'email').table(table).then(function(rows) {
            console.log(vueInstance.accounts);
            vueInstance.accounts = rows;
            //vueInstance.$forceUpdate();
        }).catch(function(error) {
            console.error(error);
        });
    },

    /**
     *
     * @returns {*}
     */
    findAndSync: function(vueInstance, id, mailFolder){
        let rows= '';
        knex.table(table)
            .where('id', '=', id)
            .first()
            .then(function(_rows) {
                rows = _rows;
                knex.select('sequence_number', 'created_at')
                    .table('mailbox')
                    .where('mail_account_id', _rows.id)
                    .where('folder', mailFolder)
                    .orderBy('sequence_number', 'desc')
                    .first().then(function (result) {
                        if (typeof result === 'undefined') {
                            //Assume new mail account has been created
                            helper.syncImap(vueInstance, rows, id, mailFolder, null, rows.sync_from);
                        } else {
                            helper.syncImap(vueInstance, rows, id, mailFolder, null, dateFormat(result.created_at, "mmmm d, yyyy"));
                        }
                    }
                ).catch(function(error) {
                    console.error(error);
                });
            }).catch(function(error) {
                console.error(error);
            });
    },

    find: function (vueInstance, id) {
        knex.table(table).where('id', '=', id).first()
            .then(function(account) {
                vueInstance.name = account.name;
                vueInstance.email = account.email;
                vueInstance.password = account.password;
                vueInstance.incoming_server_type = account.incoming_server_type;
                vueInstance.incoming_server_hostname = account.incoming_server_hostname;
                vueInstance.incoming_server_port = account.incoming_server_port;
                vueInstance.incoming_server_ssl = account.incoming_server_ssl;
                vueInstance.incoming_server_authentication = account.incoming_server_authentication;
                vueInstance.outgoing_server_hostname = account.outgoing_server_hostname;
                vueInstance.outgoing_server_port = account.outgoing_server_port;
                vueInstance.outgoing_server_ssl = account.outgoing_server_ssl;
                vueInstance.outgoing_server_authentication = account.outgoing_server_authentication;
                vueInstance.sync_duration = account.sync_duration;
            });
    }
};
