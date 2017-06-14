var Vue = require('../../node_modules/vue/dist/vue.min');

var VueRouter = require('vue-router');

const helper = require('../helper');

const components = require('./components');

require('../global-components/info');

Vue.use(VueRouter);

var routes = require('./routes');

let route_paths =  [
    routes.navigateFolderRoute,
    routes.navigateOpenMail
];

if(helper.getVueInstance() === null){
    const router = new VueRouter({
        routes: route_paths
    });

    helper.updateVueInstance(new Vue({
        router,
        el: '#app'
    }));

}else{
    let app = helper.getVueInstance();
    app.$router.addRoutes(route_paths);
    helper.updateVueInstance(app);
}
