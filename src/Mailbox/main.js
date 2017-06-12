var Vue = require('../../node_modules/vue/dist/vue.min');

var VueRouter = require('vue-router');

const helper = require('../helper');

const components = require('./components');

Vue.use(VueRouter);

var routes = require('./routes');

const router = new VueRouter({
    routes: [
        routes.navigateFolderRoute
    ]
});


if(helper.getVueInstance() === null){

    helper.updateVueInstance(new Vue({
        router
    })).$mount('#app');
}else{

    var app = helper.getVueInstance();

    app.$router.addRoutes([
        routes.navigateFolderRoute,
        routes.navigateOpenMail
    ]);

}

//helper.syncImap('INBOX');
//helper.fetchAllMailFolders();
