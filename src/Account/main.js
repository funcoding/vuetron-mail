var Vue = require('../../node_modules/vue/dist/vue.min');

var VueRouter = require('vue-router');

const helper = require('../helper');

Vue.use(VueRouter);

//Require global components
require('../global-components/info');

//Require local components
const components = require('./components');

var routes = require('./routes');

const router = new VueRouter({
    routes: [
        routes.addMailAccountRoute,
        routes.editMailAccountRoute
    ]
});

if(helper.getVueInstance() === null){
    helper.updateVueInstance(new Vue({
        el: '#app',
        router,
        components: {
            'list-mail-accounts': components.listMailAccounts,
        },
    }));

    //helper.getVueInstance().$mount('#app');
}else{

}

/*const app = new Vue({
    router,
    components: {
        'list-mail-accounts': components.listMailAccounts
    }
}).$mount('#app');*/

/*var v = helper.vue();
var  p = v.extend({
    router: router,
    components: {
        'list-mail-accounts': components.listMailAccounts
    }
});

new p().$mount('#app');*/