<template>
    <div>
         <base-marquee :text='marqueeText' svg-id='touchme'></base-marquee>
         <transition name='welcome-transition'>
             <div class='welcome' v-if='!audioIsActive'>
                <h3 lang="en" class='call-to-connect'><span class='title'>EVER HEAR THISBODY?</span> <br><br><span class='cta'>will you uwu with me? touch below.</span></h3>
                <marquee-button class='yes-button' @click='startAudio' text='UWU' clicktext='OWO' />
            </div>
            <h3
                v-else
                lang="en"
                class='now-touching'
                @pointerdown='testSynth'
                >Ů̹̟̣̲̥͇͎͚̲̟̅̓̂̂̓͋̂̓͐̿͐́̕̕͟W̸̡̡̬̱̤̬̬̩̫͙̻̠͕͕̣͖͔̾ͭ͑̃̾̀ͦ̏̌͊̚͘U̡͗ͮ̄ͫ͛̂̆̈ͦͫ̈́ͣ̚̚̚͘͝͏͓͕̹̥̮̳̬̬̙̟͈͕͇̗͕͘W̢̡̛̫̞̪̞̲͓̤̲͍̻̦̥̮̮̹͆̓̓̾̎ͨ̊͝Ų̤̥̳͔͍̫ͬ͗̀͑̑́̚͜Ẉ̷̶̨̛̫̖̱̪̬͓͚̜̣̮̙̫̮̬̹̎̀ͯ̓̂ͪͯ͆̇͐ͯ̂ͯ̌̐̋̐ͣ̚ͅÙ̷̘̯͓͔̞͙̟͍͕̠̗̺̫͔͙̮̆͌ͬ̍̑̇͞W̸̛͉̮͖̑ͬͤͩͩͧ͑́̐ͅỤ̵̫͙̘̹̥͎̥̑̂̍̿ͤ̆͑̆̂ͪ͋͞͡͝͡Ẇ̨̡̹̭͈͎̮̜ͥ̂̄͂̌̒ͫͧͩ̋ͨͯ̃ͭ̌̃̓ͅŰ̶͖͉͍̼͔̪̙̼ͩ͗͆͂̽͋ͤ̓ͪ̀̅̅͐ͥ̚͟
</h3>
         </transition>
        <color-screen id='breath-display'
            :lightness='breath'
            :alpha='breath'
            @pointerdown='testSynth'
        />
        <color-screen id='weather-display'
            :lightness='0'
            :hue='0'
            :saturation='0'
            :alpha='0'
            @pointerdown='testSynth'
        />
        <connection-frame></connection-frame>
    </div>
</template>

<script>
import ColorScreen from '../components/user/ColorScreen';
import { useStore } from 'vuex';
import { computed, watch, ref } from 'vue';

import * as Tone from 'tone';
import NoSleep from 'nosleep.js'


export default {
    setup() {
        const store = useStore();
        let noSleep = new NoSleep();

        

        


        // const heartbeat = computed(() => store.getters.getHeartbeat);



        // function mapRange(in1, in2, out1, out2, value) {
        //     return (value - in1) * (out2 - out1) / (in2 - in1) + out1;
        // }

        // const clamp = (num, min, max) => Math.min(Math.max(num, min), max);


        ////////////////TEST SYNTH///////////////
        const testSynth = new Tone.Synth().toDestination();

        function testTone() {
            const randomFrequency = 300 + Math.random() * 500;
            testSynth.triggerAttackRelease(randomFrequency,"8n");
        }


        //////////////BREATH SAMPLER/////////


        //create sample paths
        const numberOfBreathSamples = 24;
        const breathBaseUrl = '/samples/breath/';
        const breathSamplers = [];
        const breathVolume = new Tone.Volume();
        const breathFilter = new Tone.Filter(100, 'lowpass');


        breathVolume.connect(breathFilter);
        breathFilter.toDestination();

        breathVolume.mute = true;

        for(let counter = 1; counter <= numberOfBreathSamples; counter++) {
            let breathSampleName;
            if(counter < 10) {
                breathSampleName = 'thisbody_breath_loud_' + '0' + counter + '.wav';
            } else {
                breathSampleName = 'thisbody_breath_loud_' + counter + '.wav';
            }
            //create actual samplers
            const breathSampler = new Tone.Sampler({
                'C3' : breathSampleName
            }, () => {
                console.log('loaded', breathSampleName);
            },
                breathBaseUrl
            );
            breathSampler.connect(breathVolume);
            breathSamplers.push(breathSampler);
        }

        //////////////VERY BAD HOTFIX, FIND AUTO SOLUTION FOR SAMPLE LENGTHS LOL////////
        const breathSampleLengths = [
            1.107,
            1.532,
            1.668,
            5.498,
            3.272,
            2.908,
            3.560,
            1.651,
            1.730,
            3.291,
            1.444,
            2.468,
            2.540,
            1.107,
            3.162,
            2.239,
            1.225,
            1.920,
            2.122,
            0.727,
            3.338,
            4.053,
            2.084,
            2.521
        ];

        function playBreathSamples() {
            const normalPitch = 50;
            const maxRandomPitchFactor = 4;

            const randomSample = Math.floor(24 * Math.random());
            const randomPitchFactor = 1 + Math.random() * maxRandomPitchFactor;
            const randomizedPitch = normalPitch * randomPitchFactor;
            breathSamplers[randomSample].triggerAttack(randomizedPitch);
            const sampleLength = breathSampleLengths[randomSample] * 1000 / ((normalPitch * randomPitchFactor) / 130);
            setTimeout(playBreathSamples, sampleLength);
            
        }

        function mapRange(in1, in2, out1, out2, value) {
            return (value - in1) * (out2 - out1) / (in2 - in1) + out1;
        }

        const breath = computed(() => store.getters.getBreath);
        const bite = computed(() => store.getters.getBite);
        const nod = computed(() => store.getters.getNod);
        const tilt = computed(() => store.getters.getTilt);

        watch(breath, newValue => {
            if (newValue <= 3) {
                breathVolume.mute = true;
                breathVolume.volume.value = -100;
                breathFilter.frequency.value = 0;
            } else {
                breathVolume.mute = false;
                breathVolume.volume.value = 0 - (100 - newValue) / 2;
                const newNewValue = 100 * Math.pow((newValue / 100), 4);
                breathFilter.frequency.value = mapRange(0, 100, 100, 2000, newNewValue);
            }
        });
        watch(bite, newValue => {
            breathFilter.Q.value = mapRange(0,100,0.91,20,newValue);
        });

        

        let nodSpeed = 0;
        let tiltSpeed = 0;
        let headSpeed = 0;

        const headOsc = new Tone.Oscillator(300, 'sawtooth').start();
        const headVolume = new Tone.Volume(-100);
        headVolume.mute = true;
        const headDelay = new Tone.FeedbackDelay((Math.random() + 1 * 50)/1000, 0.5);

        

        headOsc.connect(headVolume);
        headVolume.connect(headDelay);
        headDelay.toDestination();

        watch(nod, (newValue, oldValue) => {
            nodSpeed = Math.abs(newValue - oldValue);
            headSpeed = (nodSpeed + tiltSpeed)/2;
            console.log(headSpeed);
            if (headSpeed <= 3) {
                headVolume.mute = true;
                headVolume.volume.value = -100;
            } else {
                headVolume.mute = false;
                headVolume.volume.value = 0 - (100 - headSpeed * 2);
                headOsc.frequency.value = headSpeed * 10;
            }
        });
        watch(tilt, (newValue, oldValue) => {
            tiltSpeed = Math.abs(newValue - oldValue);
            headSpeed = (nodSpeed + tiltSpeed)/2;
            if (headSpeed <= 3) {
                headVolume.mute = true;
                headVolume.volume.value = -100;
            } else {
                headVolume.mute = false;
                if (headSpeed >= 30) {
                    headVolume.volume.value = 0;
                    headOsc.frequency.value = headSpeed * 15;
                } else {
                    headVolume.volume.value = 0 - (100 - headSpeed * 3.3);
                    headOsc.frequency.value = headSpeed * 10;
                }
            }
        });


        
        
        // watch(tilt, newValue => console.log('tilt', newValue));
        // watch(heartbeat, newValue => console.log('heartbeat', newValue));

        // function testSample() {
        //     let randomSample = Math.floor(24 * Math.random()) + 1;
        //     breathSamplers[randomSample].triggerAttack('C3');
        // }




        const audioIsActive = ref(false);

        function startAudio() {
            audioIsActive.value = true;
            Tone.start()
            .then(() => {
                Tone.Transport.start();
                playBreathSamples();
            });
            store.dispatch('startAudio');
            noSleep.enable();
            if(process.env.VUE_APP_FULLSCREEN) {
                document.querySelector('body').requestFullscreen();
            }
        }

        return {
            startAudio,
            audioIsActive,
            testTone,
            testSynth,
            breath
        }
    },
    components: {
        ColorScreen,
    },
    computed: {
        marqueeText() {
            if(this.audioIsActive) {
                return 'd(-.-)b d(-.-)b d(-.-)b d(-.-)b d(-.-)b '
            } else {
                return 'THISBODY THISBODY THISBODY '
            }
        }
    },
}
</script>

<style lang="stylus" scoped>
    .welcome
        height 100vh
        width 100vw
        background #000
        color #000
        position fixed
        top 0
        left 0
        // padding 50px
        box-sizing border-box
        display grid
        grid-template-rows 1fr 10fr

    .call-to-connect
        font-size 3.2vh
        text-align center
        font-family Comic-Sans
        hyphens auto
        margin 0
        grid-row 1/2
        padding 50px

    .cta
        text-shadow: 0 0 20px white,
                    0 0 20px white,
                    0 0 20px white;

    .welcome-transition-enter-from
        opacity 0
        transform scale(0.5)
    .welcome-transition-enter-to
        opacity 1
        transform scale(1)
    .welcome-transition-enter-active
        transition all 0.5s ease-out
    .welcome-transition-leave-from
        opacity 1
        transform scale(1)
    .welcome-transition-leave-to
        opacity 0
        transform scale(2)
    .welcome-transition-leave-active
        transition all 0.5s ease-in

    .yes-button
        justify-self center

    .now-touching
        font-size 3.8vh
        text-align center
        font-family sans-serif
        hyphens auto
        padding 50px
        position fixed
        top 35vh
        animation wiggle 10s infinite
        user-select none

    .title {
        font-size 4vh
        text-shadow: 0 0 20px white,
                    0 0 20px white,
                    0 0 20px white;
    }
    @keyframes wiggle {
        0% {
            transform: rotate(0deg);
        }
        33% {
            transform: rotate(10deg);
        }
        66% {
            transform: rotate(-10deg);
        }
        100% {
            transform: rotate(0deg);
        }
    }
</style>