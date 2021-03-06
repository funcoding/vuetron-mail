let Vue = require('../node_modules/vue/dist/vue.min');
let VueRouter = require('vue-router');
let helper = require('./helper');

Vue.use(VueRouter);

let route_paths =  [
    {
        path: '/',
        component: {
            template: '<h1 style = "text-align: center">Vuetron Mail Client</h1>'
        }
    }
];

if(helper.getVueInstance() === null){
    const router = new VueRouter({
        routes: route_paths
    });

    helper.updateVueInstance(
        new Vue({
            router,
            el: '#app'
        })
    );
}else{
    helper.getVueInstance().$router.addRoutes(router);
}

//Require the modules
require('./Account/main');
require('./Mailbox/main');