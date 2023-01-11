<template>
    <div>
        howdy midi uwu
        <select name="midi-inputs" v-model="selectedMidiInput">
            <option v-bind:key="input" v-for="input in midiInputs">{{ input.name }}</option>
        </select>
        <p>selected: {{ selectedMidiInput }}</p>
        <p>value: {{ midiValue }}</p>
    </div>
</template>


<script>
import { ref, watch } from 'vue';
import { useStore } from 'vuex'

export default {
    setup() {
        const store = useStore();
        const midiValue = ref(0);

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

        const midiInputs = ref([]);
        const selectedMidiInput = ref();

        function onMIDISuccess(midiAccess) {
            const inputs = [];
            for (const input of midiAccess.inputs.values()) {
                inputs.push(input);
            }
            midiInputs.value = [...inputs];
        }

        watch(selectedMidiInput, (newValue) => {
            const input = midiInputs.value.find((input) => {
                return input.name === newValue
            });
            input.onmidimessage = getMIDIMessage;
        });

        function midiToPercent(i) {
            return i / 127 * 100;
        }

        function getMIDIMessage(midiMessage) {
            const data = midiMessage.data;
            if(data[0] === 176) { //channel 1
                switch (data[1]) {
                    case 1: //first knob
                        store.dispatch('sendMidi', midiToPercent(data[2]));
                        midiValue.value = midiToPercent(data[2]);
                        break;
                    case 2: //second knob
                        
                        
                        break;  
                    default:
                        break;
                }
            }
        }

        return {
            midiInputs,
            selectedMidiInput,
            midiValue
        }
    },
    data() {
        return {
            
        }
    },
    computed: {
        
    },
    methods: {
        
    }
}
</script>


<style lang="stylus" scoped>

</style>