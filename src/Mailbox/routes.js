const mailbox = require('./components');

module.exports = {
    navigateFolderRoute: {
        path: '/mailbox/:id/:folder',
        name: 'folder-navigation',
        component: mailbox.mailFolderComponent
    },
    navigateOpenMail: {
        path: '/mailbox/:id/:folder/:sequence_number',
        name: 'open-mail',
        component: mailbox.messageComponent
    }
};