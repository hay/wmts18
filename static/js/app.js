import Vue from 'vue';
import io from 'socket.io-client';

const socket = io();

new Vue({
    el : "main",

    mounted() {
        socket.on('login', (msg) => {
            this.messages.push({
                source : 'user',
                text : `${msg} has logged in`
            });
        });

        socket.on('logout', (msg) => {
            this.messages.push({
                source : 'user',
                text : `${msg} has logged out`
            });
        });

        socket.on('message', (msg) => {
            this.messages.push({
                source : 'server',
                text : msg
            });
        });

        socket.on('debug', (msg) => { console.log(msg) } );
    },

    data : {
        input : null,
        messages : []
    },

    methods : {
        submit() {
            this.messages.push({
                source : 'client',
                text : this.input
            });
            socket.emit('message', this.input);
            this.input = null;
        }
    }
})