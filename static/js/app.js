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

        socket.on('error', (err) => {
            this.modal = {
                type : 'error',
                title : 'Error',
                text : err
            };
            this.showModal = true;
        });

        socket.on('message', (msg) => {
            this.messages.push({
                from : msg.from,
                source : 'server',
                time : msg.time,
                text : msg.text
            });
        });

        socket.on('modal', (modal) => {
            this.modal = modal;
            this.showModal = modal.type !== 'kill';
        });

        socket.on('score', (score) => this.score = score);

        socket.on('browser', (browser) => {
            console.log(`You are: ${browser}`);
        });

        socket.on('debug', (msg) => { console.log(msg) } );
    },

    data : {
        input : null,
        messages : [],
        modal : null,
        score : null,
        showModal : false
    },

    methods : {
        closeModal() {
            this.showModal = false;
            socket.emit('startsession');
        },

        submit() {
            this.messages.push({
                source : 'client',
                text : this.input
            });
            socket.emit('message', this.input);
            this.input = null;
        },

        youtubeLink(id) {
            return `https://www.youtube-nocookie.com/embed/${id}?rel=0&amp;showinfo=0&amp;autoplay=1&amp;playsinline=1`;
        }
    }
})