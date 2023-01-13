<template>
    <div>
        <p>grain upload uwu</p>
        <div
            class="dropzone-container"
            @dragover="dragover"
            @dragleave="dragleave"
            @drop="drop"
        >
            <input
                type="file"
                multiple
                name="sounds"
                id="fileInput"
                class="hidden-input"
                @change="onChange"
                accept=".wav,.mp3"
            />

            <label for="fileInput" class="file-label">
                <div v-if="isDragging">Release to drop files here.</div>
                <div v-else>Drop files here or <u>click here</u> to upload.</div>
            </label>
            <ul>
                <li v-for="file in files" :key="file.name">{{ file.name }}</li>
            </ul>
        </div>
        <button @click="upload">upload</button>
        <h3>current sounds:</h3>
        <p v-for="sound in currentSounds" :key="sound">{{ sound }}<button @click="deleteGrain(sound)">X</button></p>
    </div>
    <hr>
    <div>
        <p>welcome upload uwu</p>
        <div
            class="dropzone-container"
            @dragover="dragover"
            @dragleave="dragleave"
            @drop="dropWelcome"
        >
            <input
                type="file"
                name="sounds"
                id="fileInput"
                accept=".wav,.mp3"
                class="hidden-input"
            />

            <label for="fileInput" class="file-label">
                <div v-if="isDragging">Release to drop files here.</div>
                <div v-else>Drop files here or <u>click here</u> to upload.</div>
            </label>
            <p v-if="welcomeFile">{{ welcomeFile.name }}</p>
        </div>
        <button @click="uploadWelcome">upload</button>
        <h3>current welcome sound:</h3>
        <div><p>{{ currentWelcomeSound }}</p></div>
    </div>
</template>


<script>
import { ref, onMounted } from 'vue';
// import { useStore } from 'vuex'

export default {
    setup() {
        // const store = useStore();

        const isDragging = ref(false);
        const files = ref([]);

        //handle drop
        function drop(e) {
            e.preventDefault();
            files.value = e.dataTransfer.files;
            onChange();
            isDragging.value = false;
        }

        function dragover(e) {
            e.preventDefault();
            isDragging.value = true;
        }

        function dragleave() {
            isDragging.value = false;
        }

        function onChange() {
            console.log(welcomeFile.value);
        }

        const welcomeFile = ref();

        function dropWelcome(e) {
            e.preventDefault();
            welcomeFile.value = e.dataTransfer.files[0];
            onChange();
            isDragging.value = false;
        }

        //API

        function upload() {
            console.log(files.value);
            const formData = new FormData();

            files.value.forEach(file => {
                formData.append('sounds', file)
            })

            fetch(process.env.VUE_APP_HOST_IP + '/grain', {
                method: 'POST',
                body: formData,
            }).then(res => console.log(res))
        }

        function uploadWelcome() {
            console.log(welcomeFile.value);
            const formData = new FormData();

            formData.append('sounds', welcomeFile.value);

            fetch(process.env.VUE_APP_HOST_IP + '/welcome', {
                method: 'POST',
                body: formData,
            }).then(res => console.log(res))
        }

        function deleteGrain(name) {
            console.log(name);
            fetch(process.env.VUE_APP_HOST_IP + '/deletegrain/' + name, {
                method: 'POST',
            }).then(res => console.log(res))
        }

        const currentSounds = ref([]);
        const currentWelcomeSound = ref()

        onMounted(() => {
                fetch(process.env.VUE_APP_HOST_IP + '/sampleslist')
                .then(response => response.json())
                .then(data => currentSounds.value = [...data.list])

                fetch(process.env.VUE_APP_HOST_IP + '/welcomesound')
                .then(response => response.json())
                .then(data => currentWelcomeSound.value = data.name)
            } 
        )

        // //////////////MIDI///////////////
        // //for midi
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

        // const midiInputs = ref([]);
        // const selectedMidiInput = ref();

        // function onMIDISuccess(midiAccess) {
        //     const inputs = [];
        //     for (const input of midiAccess.inputs.values()) {
        //         inputs.push(input);
        //     }
        //     midiInputs.value = [...inputs];
        // }

        // watch(selectedMidiInput, (newValue) => {
        //     const input = midiInputs.value.find((input) => {
        //         return input.name === newValue
        //     });
        //     input.onmidimessage = getMIDIMessage;
        // });

        // function midiToPercent(i) {
        //     return i / 127 * 100;
        // }

        // function getMIDIMessage(midiMessage) {
        //     const data = midiMessage.data;
        //     if(data[0] === 176) { //channel 1
        //         switch (data[1]) {
        //             case 1: //first knob
        //                 store.dispatch('sendMidi', midiToPercent(data[2]));
                        
        //                 break;
        //             case 2: //second knob
                        
                        
        //                 break;  
        //             default:
        //                 break;
        //         }
        //     }
        // }

        return {
            drop,
            dragover,
            dragleave,
            onChange,
            files,
            isDragging,
            upload,
            currentSounds,
            dropWelcome,
            uploadWelcome,
            currentWelcomeSound,
            welcomeFile,
            deleteGrain
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
    .dropzone-container
        height 300px
        width 300px
        box-shadow 0 0 10px white

    .hidden-input {
        opacity: 0;
        overflow: hidden;
        position: absolute;
        width: 1px;
        height: 1px;
    }
</style>