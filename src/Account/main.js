let Vue = require('../../node_modules/vue/dist/vue.min');

let VueRouter = require('vue-router');

const helper = require('../helper');

Vue.use(VueRouter);

//Require global components
require('../global-components/info');

//Require local components
const components = require('./components');

let routes = require('./routes');

let route_paths = [
        routes.addMailAccountRoute,
        routes.editMailAccountRoute
];

if(helper.getVueInstance() === null){
    const router = new VueRouter({
        routes: route_paths
    });

    helper.updateVueInstance(new Vue({
        el: '#app',
        router,
        components: {
            'list-mail-accounts': components.listMailAccounts,
        },
    }));

}else{
    Vue.component('list-mail-accounts', components.listMailAccounts);
    let app = helper.getVueInstance();
    app.$router.addRoutes(route_paths);
    app.$forceUpdate(); //Need to force update since component is not loading
    helper.updateVueInstance(app);
}