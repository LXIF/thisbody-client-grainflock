<template>
    <div class='andri-card'>
            <xy-pad @presence="presence('01', 'pos-spread', $event)"></xy-pad>
            <xy-pad @presence="presence('01', 'len-vol', $event)"></xy-pad>
            <hr />
            <xy-pad @presence="presence('02', 'pos-spread', $event)"></xy-pad>
            <xy-pad @presence="presence('02', 'len-vol', $event)"></xy-pad>
            <!-- <grain-flocker :audioHasStarted="true"></grain-flocker> -->
    </div>
</template>

<script>

import { useStore } from 'vuex'
// let GrainFlocker = () => import('../components/instruments/GrainFlocker.vue')
// import { ref } from 'vue'

export default {

    setup() {
        const store = useStore();

        function presence(name, controller, presence) {
            const playObject = {
                x: presence.x,
                y: presence.y,
                controller: controller,
                name: name
            };
            store.dispatch('sendPlay', playObject);
        }

        //////////////MIDI///////////////
        //for midi
        // function allowMIDIAccess() {
        //         navigator.requestMIDIAccess()
        //         .then(onMIDISuccess, onMIDIFailure);
        // }

        // try {
        //     allowMIDIAccess();
        // } catch(err) {
        //     console.log(err);
        // }

        // function onMIDIFailure() {
        //     console.log('Could not access your MIDI devices.');
        // }

        // function onMIDISuccess(midiAccess) {
        //     console.log(midiAccess);
        //     for (var input of midiAccess.inputs.values()) {
        //         input.onmidimessage = getMIDIMessage;
        //     }
        // }

        // function midiToPercent(i) {
        //     return i / 127 * 100;
        // }

        // function getMIDIMessage(midiMessage) {
        //     const data = midiMessage.data;
        //         switch (data[1]) {
        //             case 70: //breath
        //                 breathIntensity.value = midiToPercent(data[2]);
        //                 store.dispatch('sendBreath', data[2]);
        //                 break;
        //             case 71: //bite
        //                 biteIntensity.value = midiToPercent(data[2]);
        //                 store.dispatch('sendBite', data[2]);
        //                 break;
        //             case 72: //nod
        //                 nodIntensity.value = midiToPercent(data[2]);
        //                 store.dispatch('sendNod', data[2]);
        //                 break;
        //             case 73: //tilt
        //                 tiltIntensity.value = midiToPercent(data[2]);
        //                 store.dispatch('sendTilt', data[2]);
        //                 break;
        //             case 100: //heartbeat
        //                 heartbeatIntensity.value = midiToPercent(data[2]);
        //                 store.dispatch('sendHeartbeat', data[2]);
        //                 break;
        //             default:
        //                 break;
        //     }
        // }
        return {
            presence,
            // GrainFlocker
            // GrainFlocker: () => import('../components/instruments/GrainFlocker.vue')
        }
    },
    data() {
        return {
        }
    },
}
</script>

<style lang="stylus" scoped>
.andri-card {
    max-width: 400px;
}


    .registration-radio {
        background-color: transparent;
        width: 20px;
        height: 20px;
        opacity: 0;
        margin: 0;
        position: absolute;
        
    }

    .registration-customradio {
        border: 2px solid red;
        width: 30px;
        height: 30px;
        margin-right: 5px;
        transform: scale(1);
        border-radius: 20px;
    }

    .registration-customradio-dot {
        background-color: red;
        width: 25px;
        height: 25px;
        border-radius: 100%;
        position: absolute;
        top: 2px;
        left: 2px;
    }

</style>