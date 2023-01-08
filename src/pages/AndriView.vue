<template>
    <div class='andri-card'>
            <div id='breath'>
                <h1>breath: {{ Math.round(breathIntensity) }}</h1>
                <h1>bite: {{ Math.round(biteIntensity) }}</h1>
                <h1>nod: {{ Math.round(nodIntensity) }}</h1>
                <h1>tilt: {{ Math.round(tiltIntensity) }}</h1>
                <h1>heartbeat: {{ Math.round(heartbeatIntensity) }}</h1>
            </div>
            <xy-pad @presence='presence'></xy-pad>
    </div>
</template>

<script>

import { useStore } from 'vuex'
import { ref } from 'vue'

export default {

    setup() {
        const store = useStore();

        const breathIntensity = ref(0);
        const biteIntensity = ref(0);
        const nodIntensity = ref(0);
        const tiltIntensity = ref(0);
        const heartbeatIntensity = ref(0);

        function presence(presence) {
            console.log(presence);
        }

        //////////////MIDI///////////////
        //for midi
        function allowMIDIAccess() {
                navigator.requestMIDIAccess()
                .then(onMIDISuccess, onMIDIFailure);
        }

        try {
            allowMIDIAccess();
        } catch(err) {
            console.log(err);
        }

        function onMIDIFailure() {
            console.log('Could not access your MIDI devices.');
        }

        function onMIDISuccess(midiAccess) {
            console.log(midiAccess);
            for (var input of midiAccess.inputs.values()) {
                input.onmidimessage = getMIDIMessage;
            }
        }

        function midiToPercent(i) {
            return i / 127 * 100;
        }

        function getMIDIMessage(midiMessage) {
            const data = midiMessage.data;
                switch (data[1]) {
                    case 70: //breath
                        breathIntensity.value = midiToPercent(data[2]);
                        store.dispatch('sendBreath', data[2]);
                        break;
                    case 71: //bite
                        biteIntensity.value = midiToPercent(data[2]);
                        store.dispatch('sendBite', data[2]);
                        break;
                    case 72: //nod
                        nodIntensity.value = midiToPercent(data[2]);
                        store.dispatch('sendNod', data[2]);
                        break;
                    case 73: //tilt
                        tiltIntensity.value = midiToPercent(data[2]);
                        store.dispatch('sendTilt', data[2]);
                        break;
                    case 100: //heartbeat
                        heartbeatIntensity.value = midiToPercent(data[2]);
                        store.dispatch('sendHeartbeat', data[2]);
                        break;
                    default:
                        break;
            }
        }
        return {
            allowMIDIAccess,
            breathIntensity,
            biteIntensity,
            nodIntensity,
            tiltIntensity,
            heartbeatIntensity,
            presence
        }
    },
    data() {
        return {
        }
    },
}
</script>

<style lang="stylus" scoped>
.andri-card
    max-width 400px
    margin 0 auto


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