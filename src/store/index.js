import { createStore } from 'vuex';

import io from 'socket.io-client';

const socket = io(process.env.VUE_APP_HOST_IP);

const store = createStore({
    state() {
        return {
            connected: false,
            audioStarted: false,
            breath: 0,
            bite: 0,
            nod: 0,
            tilt: 0,
            heartbeat: 0,
        }
    },
    mutations: {
        setConnectionStatus(state, payload) {
            state.connected = payload;
        },
        startAudio(state) {
            state.audioStarted = true;
        },
        setBreath(state, payload) {
            state.breath = payload;
        },
        setBite(state, payload) {
            state.bite = payload;
        },
        setNod(state, payload) {
            state.nod = payload;
        },
        setTilt(state, payload) {
            state.tilt = payload;
        },
        setHeartbeat(state, payload) {
            state.heartbeat = payload;
        },
    },
    actions: {
        sendBreath(context, payload) {
            context.commit('setBreath', payload);
            socket.emit('breath', payload);
        },
        sendBite(context, payload) {
            context.commit('setBite', payload);
            socket.emit('bite', payload);
        },
        sendNod(context, payload) {
            context.commit('setNod', payload);
            socket.emit('nod', payload);
        },
        sendTilt(context, payload) {
            context.commit('setTilt', payload);
            socket.emit('tilt', payload);
        },
        sendHeartbeat(context, payload) {
            context.commit('setHeartbeat', payload);
            socket.emit('heartbeat', payload);
        },
        receiveBreath(context, payload) {
            context.commit('setBreath', payload);
        },
        receiveNod(context, payload) {
            context.commit('setNod', payload);
        },
        receiveTilt(context, payload) {
            context.commit('setTilt', payload);
        },
        receiveBite(context, payload) {
            context.commit('setBite', payload);
        },
        receiveHeartbeat(context, payload) {
            context.commit('setHeartbeat', payload);
        },
        setConnectionStatus(context, payload) {
            context.commit('setConnectionStatus', payload);
        },
        startAudio(context) {
            context.commit('startAudio');
        },
    },
    getters: {
        getBreath(state) {
            return state.breath;
        },
        getBite(state) {
            return state.bite;
        },
        getNod(state) {
            return state.nod;
        },
        getTilt(state) {
            return state.tilt;
        },
        getHeartbeat(state) {
            return state.heartbeat;
        },
        connected(state) {
            return state.connected;
        },
        audioStarted(state) {
            return state.audioStarted
        },
    }

});

socket.on('connect', () => {
    store.dispatch('setConnectionStatus', true);
    const howdyMessage = {
        howdy: 'howdy'
    };
    // console.log(howdyMessage);
    socket.emit('howdy', howdyMessage);
});

socket.on('disconnect', () => {
    store.dispatch('setConnectionStatus', false);
})

socket.on('breath', (breath) => {
    store.dispatch('receiveBreath', breath);
});
socket.on('bite', (bite) => {
    store.dispatch('receiveBite', bite);
});
socket.on('nod', (nod) => {
    store.dispatch('receiveNod', nod);
});
socket.on('tilt', (tilt) => {
    store.dispatch('receiveTilt', tilt);
});
socket.on('heartbeat', (heartbeat) => {
    store.dispatch('receiveHeartbeat', heartbeat);
});

export default store;