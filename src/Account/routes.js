const account = require('./components');

module.exports = {
    addMailAccountRoute: {
        //Slash in front is important or else vue-router will destroy the component immediately
        path: '/account/add',
        component: account.addNewMailAccountComponent
    },

    editMailAccountRoute: {
        path: '/account/:id/edit',
        component: account.editMailAccountComponent,
        name: 'edit-mail-account'
    }
};