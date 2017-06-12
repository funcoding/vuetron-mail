let path = require('path');

let knex = require('knex')({
    client: 'sqlite3',
    debug: true,
    connection: {
        filename: path.join(__dirname,'database/vuetron.db')
    },
    useNullAsDefault:true
});

knex.schema.createTableIfNotExists('mail_account', function (table) {
    table.increments();
    table.string('name', 20);
    table.string('email', 50);
    table.string('password', 50);
    table.string('incoming_server_type', 5);
    table.string('incoming_server_hostname', 100);
    table.integer('incoming_server_port');
    table.string('incoming_server_ssl', 20);
    table.string('incoming_server_authentication', 20);
    table.string('outgoing_server_hostname', 100);
    table.integer('outgoing_server_port');
    table.string('outgoing_server_ssl', 20);
    table.string('outgoing_server_authentication', 20);
    table.integer('sync_duration').defaultTo(1);
    table.string('sync_from', 30).nullable();
    table.timestamps(false, true);
})
    .then(function(obj) {
        console.log(obj)
    }).catch(function(err) {
        console.log(err.message)
    });

knex.schema.createTableIfNotExists('mailbox', function (table) {
    table.increments();
    table.integer('mail_account_id').unsigned();
    table.foreign('mail_account_id').references('mail_account.id');
    table.string('folder', 50);
    table.text('headers');
    table.string('sequence_number');
    //table.string('date', 100);
    //table.string('from', 100);
    //table.string('subject', 100);
    //table.string('to', 100);
    table.text('body');
    table.timestamps(false, true);
})
    .then(function(obj) {
        console.log(obj);
    })
    .catch(function(err) {
        console.log(err.message);
    });