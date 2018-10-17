import Vue from 'vue';
import io from 'socket.io-client';

const socket = io();

new Vue({
    el : "main",

    mounted() {
        socket.on('message', (msg) => {
            this.messages.push({
                source : 'server',
                text : msg
            });
        });
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