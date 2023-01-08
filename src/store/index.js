import { createStore } from 'vuex';

import io from 'socket.io-client';

const socket = io(process.env.VUE_APP_HOST_IP);

const store = createStore({
    state() {
        return {
            connected: false,
            audioStarted: false,
            play: [],
            lastChanged: ''
        }
    },
    mutations: {
        setConnectionStatus(state, payload) {
            state.connected = payload;
        },
        startAudio(state) {
            state.audioStarted = true;
        },
        setPlay(state, payload) {
            // console.log(payload);
            state.lastChanged = payload.name;
            //find or create player object in state.play
            const playerNr = state.play.findIndex(player => player.name === payload.name);
            
            if(playerNr === -1) {
                if(payload.controller === 'pos-spread') {
                    state.play.push({
                        name: payload.name,
                        position: payload.x,
                        spread: payload.y,
                        length: 0,
                        volume: 0
                    });
                }
                if(payload.controller === 'len-vol') {
                    state.play.push({
                        name: payload.name,
                        position: 0,
                        spread: 0,
                        length: payload.x,
                        volume: payload.y
                    });
                }
            } else {
                if(payload.controller === 'pos-spread') {
                    state.play[playerNr] = {...state.play[playerNr],
                        position: payload.x,
                        spread: payload.y
                    }
                }
                if(payload.controller === 'len-vol') {
                    state.play[playerNr] = {...state.play[playerNr],
                        length: payload.x,
                        volume: payload.y
                    }
                }
            }
            state.play.sort((a,b) => parseInt(a.name) - parseInt(b.name));
        }
    },
    actions: {
        // sendBreath(context, payload) {
        //     context.commit('setBreath', payload);
        //     socket.emit('breath', payload);
        // },

        // receiveBreath(context, payload) {
        //     context.commit('setBreath', payload);
        // },

        setConnectionStatus(context, payload) {
            context.commit('setConnectionStatus', payload);
        },
        startAudio(context) {
            context.commit('startAudio');
        },
        sendPlay(context, payload) {
            context.commit('setPlay', payload);
            socket.emit('play', payload);
        },
        receivePlay(context, payload) {
            context.commit('setPlay', payload);
        }
    },
    getters: {
        // getHeartbeat(state) {
        //     return state.heartbeat;
        // },
        connected(state) {
            return state.connected;
        },
        audioStarted(state) {
            return state.audioStarted
        },
        getPlay(state) {
            return state.play
        },
        getLastChanged(state) {
            return state.lastChanged
        }
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

socket.on('play', (payload) => {
    store.dispatch('receivePlay', payload);
});


export default store;