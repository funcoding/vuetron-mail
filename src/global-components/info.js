let Vue = require('../../node_modules/vue/dist/vue.min');

let template = '<div style="border-radius: 4px; margin:5px; color: #31708f;background-color: #d9edf7; border: 1px solid #bce8f1;text-align: center">' +
    '<p>{{ message }}</p>' +
    '</div>';

Vue.component('info', {
   template: template,
    props: ['message']
});