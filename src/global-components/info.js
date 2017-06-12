let Vue = require('../../node_modules/vue/dist/vue.min');

Vue.component('info', {
   template: '<p>{{ message }}</p>',
    props: ['message']
});