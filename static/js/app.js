import Vue from 'vue';
import io from 'socket.io-client';
import socketController from './socket.js';

const socket = io(window.location.host, {
    path : `${window.location.pathname}socket.io`
});

new Vue({
    el : "main",

    mounted() {
        socketController.call(this, socket);
        this.scrollChat();

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                socket.emit('hidden');
            }
        });
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

        reload() {
            window.location.reload();
        },

        scrollChat() {
            // Scroll window
            Vue.nextTick(() => {
                window.scrollTo(0, document.body.scrollHeight);
            });
        },

        submit() {
            this.messages.push({
                source : 'client',
                text : this.input
            });

            socket.emit('message', this.input);
            this.input = null;
            this.scrollChat();
        },

        youtubeLink(id) {
            return `https://www.youtube-nocookie.com/embed/${id}?rel=0&amp;showinfo=0&amp;autoplay=1&amp;playsinline=1`;
        }
    }
})