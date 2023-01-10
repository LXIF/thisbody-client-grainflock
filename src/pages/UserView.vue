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
            >
            Ů̹̟̣̲̥͇͎͚̲̟̅̓̂̂̓͋̂̓͐̿͐́̕̕͟W̸̡̡̬̱̤̬̬̩̫͙̻̠͕͕̣͖͔̾ͭ͑̃̾̀ͦ̏̌͊̚͘U̡͗ͮ̄ͫ͛̂̆̈ͦͫ̈́ͣ̚̚̚͘͝͏͓͕̹̥̮̳̬̬̙̟͈͕͇̗͕͘W̢̡̛̫̞̪̞̲͓̤̲͍̻̦̥̮̮̹͆̓̓̾̎ͨ̊͝Ų̤̥̳͔͍̫ͬ͗̀͑̑́̚͜Ẉ̷̶̨̛̫̖̱̪̬͓͚̜̣̮̙̫̮̬̹̎̀ͯ̓̂ͪͯ͆̇͐ͯ̂ͯ̌̐̋̐ͣ̚ͅÙ̷̘̯͓͔̞͙̟͍͕̠̗̺̫͔͙̮̆͌ͬ̍̑̇͞W̸̛͉̮͖̑ͬͤͩͩͧ͑́̐ͅỤ̵̫͙̘̹̥͎̥̑̂̍̿ͤ̆͑̆̂ͪ͋͞͡͝͡Ẇ̨̡̹̭͈͎̮̜ͥ̂̄͂̌̒ͫͧͩ̋ͨͯ̃ͭ̌̃̓ͅŰ̶͖͉͍̼͔̪̙̼ͩ͗͆͂̽͋ͤ̓ͪ̀̅̅͐ͥ̚͟
            </h3>
         </transition>
        <!-- <color-screen id='breath-display'
            :lightness='breath'
            :alpha='breath'
            @pointerdown='testTone'
        /> -->
        <color-screen id='weather-display'
            :lightness='0'
            :hue='0'
            :saturation='0'
            :alpha='0'
        />
        <qr-code class="user-qr"></qr-code>
        <connection-frame></connection-frame>
        <grain-flocker :audioHasStarted="audioIsActive"></grain-flocker>
    </div>
</template>

<script>
import ColorScreen from '../components/user/ColorScreen';
import GrainFlocker from '../components/instruments/GrainFlocker.vue';
import QrCode from '../components/UI/QrCode.vue';

export default {
    data() {
        return {
            audioIsActive: false
        }
    },
    components: {
        ColorScreen,
        GrainFlocker,
        QrCode
    },
    computed: {
        marqueeText() {
            if(this.audioIsActive) {
                return 'd(-.-)b d(-.-)b d(-.-)b d(-.-)b d(-.-)b '
            } else {
                return 'THISBODY THISBODY THISBODY '
            }
        },

    },
    methods: {
        startAudio() {
            this.audioIsActive = true;
        }
    }
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

    .user-qr
        position fixed
        bottom 50px
        right 50px
</style>