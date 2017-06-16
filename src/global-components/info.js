let Vue = require('../../node_modules/vue/dist/vue.min');
let style = 'border-radius: 4px; margin:5px; color: #31708f;background-color: #d9edf7; border: 1px solid #bce8f1;text-align: center';
let template = `
    <div style="${style}">
        <p>{{ message }}</p>
    </div>`;

Vue.component('info', {
   template: template,
    props: ['message']
});