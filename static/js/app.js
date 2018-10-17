import Vue from 'vue';
import io from 'socket.io-client';

const socket = io();

new Vue({
    el : "main"
})