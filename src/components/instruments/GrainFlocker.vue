<template>
    <div></div>
</template>
<script>
import { useStore } from 'vuex';
import {
    computed,
    watch,
    ref,
} from 'vue';

import * as Tone from 'tone';
// import { watch } from 'fs';
import NoSleep from 'nosleep.js'


export default {
    setup(props, { emit }) {
        const store = useStore();
        let noSleep = new NoSleep();

        function mapRange(in1, in2, out1, out2, value) {
            return (value - in1) * (out2 - out1) / (in2 - in1) + out1;
        }

        //follower
        const meter = new Tone.Meter().toDestination();
        meter.smoothing = 0;


        ////////////////TEST SYNTH///////////////
        const testSampler = new Tone.Sampler({
            urls: {A1: process.env.VUE_APP_HOST_IP + '/welcome' }
        }).connect(meter);

        function testTone() {
            testSampler.triggerAttack('A1');
        }

        

        ////////////GRAINFLOCKER///////////////

        //sidechain
        const midi = computed(() => store.getters.getMidi);
        const sideChainVolume = new Tone.Volume().connect(meter);

        watch(midi, newValue => {
            let newVolume = mapRange(0, 100, -40, 0, newValue);
            if(newVolume < -39) {
                sideChainVolume.set({
                    mute: true
                })
            } else {
                sideChainVolume.set({
                    mute: false,
                    volume: newVolume
                })
            }
        });

        //create sample paths
        // const numberOfFlockSamples = 2;
        const flockSamplesApi = process.env.VUE_APP_HOST_IP + '/grain/';
        let flockSampleNames = [];
        const grainFlockers = [];
        const grainFlockerSampleLengths = [];
        const grainFlockerVolumes = [];

        fetch(process.env.VUE_APP_HOST_IP + '/sampleslist')
                .then(response => response.json())
                .then(data => {
                    flockSampleNames = [...data.list];
                    for(let counter = 0; counter < flockSampleNames.length; counter++) {

                        //create actual grainers
                        const grainFlocker = new Tone.GrainPlayer(flockSamplesApi + flockSampleNames[counter], () => {
                            console.log('loaded')
                            grainFlockerSampleLengths.push({
                                name: flockSampleNames[counter],
                                length: sampleLength(grainFlocker)
                            });
                        });

                        grainFlocker.set({
                            loop: true,
                            loopStart: 0,
                            loopEnd: 0.1,
                            name: flockSampleNames[counter]
                        });
                        
                        const volume = new Tone.Volume(0).connect(sideChainVolume);
                        volume.set({
                            name: flockSampleNames[counter],
                            mute: true
                        });

                        grainFlocker.connect(volume);
                        grainFlockers.push(grainFlocker);
                        grainFlockerVolumes.push(volume);
                    }
                })



        function sampleLength(object) {
            return object.sampleTime * object.buffer.length
        }


        const play = computed(() => store.getters.getPlay);
        const lastChanged = computed(() => store.getters.getLastChanged);

        let spreadID = Math.pow(Math.random(), 1.3);
        let negative = Math.random() > 0.5;
        if(negative) {
            spreadID *= -1;
        }

        watch(play, newValue => {
            try {
                //map it to between 0 and grainFlockerSampleLength
                const indexToChange = grainFlockers.findIndex((player) => {
                    return player.name === lastChanged.value
                });

                const sampleLength = grainFlockerSampleLengths.find((guy) => guy.name === lastChanged.value).length;

                const player = newValue.find(player => player.name === lastChanged.value);

                //position, spread and length
                let spreadPosition = player.position + player.spread * spreadID;
                if(spreadPosition > 100) {
                    spreadPosition -= 100;
                }
                if(spreadPosition < 0) {
                    spreadPosition += 100;
                }


                const loopStart = mapRange(0, 100, 0, sampleLength, spreadPosition);
                const loopLength = mapRange(0, 100, 0.01, 0.5, player.length);
                const detune = mapRange(-100, 100, -200, 200, player.spread * spreadID);


                let loopEnd = loopStart + loopLength;

                if(loopEnd > sampleLength) {
                    loopEnd = sampleLength;
                }
                
                grainFlockers[indexToChange].set({
                    loopStart: loopStart,
                    loopEnd: loopEnd,
                    detune: detune
                });

                //volume
                
                if(player.volume > 3) {
                    const newVolume = mapRange(0, 100, -40, 0, player.volume);
                    grainFlockerVolumes[indexToChange].set({
                        mute: false,
                        volume: newVolume
                    });
                } else {
                    grainFlockerVolumes[indexToChange].set({
                        mute: true,
                    });
                }
            } catch {
                console.log('ouch');
            }

            }, {
                deep: true
        });

        const audioIsActive = ref(false);

        function startAudio() {
            function checkBuffersLoaded() {
                let buffersLoaded = true;
                for(const flocker of grainFlockers) {
                    if (!flocker.loaded) {
                        buffersLoaded = false;
                    }
                }
                if(!testSampler.loaded) {
                    buffersLoaded = false;
                }
                return buffersLoaded
            }

            if(checkBuffersLoaded()) {
                audioIsActive.value = true;
                Tone.start()
                .then(() => {
                    // Tone.Transport.start();
                    // playBreathSamples();
                    for(let i = 0; i < grainFlockers.length; i++) {
                        grainFlockers[i].start();
                    }
                    testTone();
                });
                store.dispatch('startAudio');
                noSleep.enable();
                setInterval(() => {
                    emit('meter', meter.getValue());
                }, 50);
            } else {
                console.log('waiting for buffers');
                setTimeout(startAudio, 1000);
            }
        }

        return {
            startAudio,
            audioIsActive,
            testTone,
            grainFlockers
            // testSynth,
        }
    },
    props: ['audioHasStarted'],
    watch: {
        audioHasStarted() {
            this.startAudio();
        }
    }
}
</script>