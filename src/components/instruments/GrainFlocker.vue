<template>
    <div></div>
</template>
<script>
import { useStore } from 'vuex';
import {
    computed,
    watch,
    ref
} from 'vue';

import * as Tone from 'tone';
// import { watch } from 'fs';
import NoSleep from 'nosleep.js'


export default {
    setup() {
        const store = useStore();
        let noSleep = new NoSleep();

        function mapRange(in1, in2, out1, out2, value) {
            return (value - in1) * (out2 - out1) / (in2 - in1) + out1;
        }


        ////////////////TEST SYNTH///////////////
        const testSampler = new Tone.Sampler({
            urls: {A1: '/samples/thisbody_grainflocker_01.wav'}
        }).toDestination();

        function testTone() {
            testSampler.triggerAttack('A1');
        }

        ////////////GRAINFLOCKER///////////////

        //sidechain
        const midi = computed(() => store.getters.getMidi);
        const sideChainVolume = new Tone.Volume().toDestination();

        watch(midi, newValue => {
            let newVolume = mapRange(0, 100, -40, 0, newValue);
            console.log(newVolume);
            if(newVolume < -55) {
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
        const numberOfFlockSamples = 2;
        const flockBaseUrl = '/samples/thisbody_grainflocker_';
        const grainFlockers = [];
        const grainFlockerSampleLengths = [];
        const grainFlockerVolumes = [];

        function sampleLength(object) {
            return object.sampleTime * object.buffer.length
        }

        for(let counter = 1; counter <= numberOfFlockSamples; counter++) {
            let flockSampleName;
            if(counter < 10) {
                flockSampleName = '0' + counter;
            } else {
                flockSampleName = counter;
            }
            //create actual grainers
            const grainFlocker = new Tone.GrainPlayer(flockBaseUrl + flockSampleName + '.wav', () => {
                grainFlockerSampleLengths.push({
                    name: flockSampleName,
                    length: sampleLength(grainFlocker)
                });
            });

            grainFlocker.set({
                loop: true,
                loopStart: 0,
                loopEnd: 0.1,
                name: flockSampleName
            });
            
            const volume = new Tone.Volume(0).connect(sideChainVolume);
            volume.set({
                name: flockSampleName,
                mute: true
            });

            grainFlocker.connect(volume);
            grainFlockers.push(grainFlocker);
            grainFlockerVolumes.push(volume);
        }


        const play = computed(() => store.getters.getPlay);
        const lastChanged = computed(() => store.getters.getLastChanged);

        let spreadID = Math.pow(Math.random(), 1.3);
        let negative = Math.random() > 0.5;
        if(negative) {
            spreadID *= -1;
        }

        watch(play, newValue => {
                //map it to between 0 and grainFlockerSampleLength
                const indexToChange = grainFlockers.findIndex((player) => {
                    return player.name === lastChanged.value
                });

                const sampleLength = grainFlockerSampleLengths.find((guy) => guy.name === lastChanged.value).length;

                const player = newValue.find(player => player.name === lastChanged.value);

                //position, spread and length
                console.log(spreadID);
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

            }, {
                deep: true
        });

        const audioIsActive = ref(false);

        function startAudio() {
            function checkBuffersLoaded() {
                let buffersLoaded = true;
                for(let flocker of grainFlockers) {
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
                    Tone.Transport.start();
                    // playBreathSamples();
                    for(let i = 0; i < grainFlockers.length; i++) {
                        grainFlockers[i].start();
                    }
                    testTone();
                });
                store.dispatch('startAudio');
                noSleep.enable();
            } else {
                console.log('waiting for buffers');
                setTimeout(startAudio(), 1000);
            }
        }

        return {
            startAudio,
            audioIsActive,
            testTone,
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