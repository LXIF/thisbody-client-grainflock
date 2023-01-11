<template>
    <div class='andri-card'>
            <div class="qr-title">
                <!-- <h3 style="color: white">howdy</h3> -->
                <qr-code scale="12" class="andri-qr"></qr-code>
            </div>
            <div :key="flocker" v-for="flocker in grainFlockerNames">
                <h3>{{ flocker }}</h3>
                <xy-pad @presence="presence(flocker, 'pos-spread', $event)" side="right"></xy-pad>
                <xy-pad @presence="presence(flocker, 'len-vol', $event)" side="left"></xy-pad>
                <hr />
            </div>
            <!-- <h3>chouwa</h3>
            <xy-pad @presence="presence('01', 'pos-spread', $event)" side="right"></xy-pad>
            <xy-pad @presence="presence('01', 'len-vol', $event)" side="left"></xy-pad>
            <hr />
            <h3>taiko</h3>
            <xy-pad @presence="presence('02', 'pos-spread', $event)" side="right"></xy-pad>
            <xy-pad @presence="presence('02', 'len-vol', $event)" side="left"></xy-pad> -->
            <!-- <grain-flocker :audioHasStarted="true"></grain-flocker> -->
    </div>
</template>

<script>

import { useStore } from 'vuex'
import { ref } from 'vue'
import QrCode from '../components/UI/QrCode.vue';
// let GrainFlocker = () => import('../components/instruments/GrainFlocker.vue')
// import { ref } from 'vue'

export default {

    setup() {
        const store = useStore();
        const grainFlockerNames = ref([]);

        fetch('http://' + process.env.VUE_APP_HOST_IP + '/sampleslist')
                .then(response => response.json())
                .then(data => {
                    grainFlockerNames.value = [...data.list];
                })

        function presence(name, controller, presence) {
            const playObject = {
                x: presence.x,
                y: presence.y,
                controller: controller,
                name: name
            };
            store.dispatch('sendPlay', playObject);
        }

        
        return {
            presence,
            grainFlockerNames
        }
    },
    components: {
        QrCode
    }
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

    .qr-title
        height 100vh
        width 100vw
    
    .andri-qr
        position absolute
        top 25vh
        margin 40px
        width 60vw
        display block


</style>