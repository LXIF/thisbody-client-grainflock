<template>
    <canvas id="qrcode">

    </canvas>
</template>

<script>
import QRCode from 'qrcode';

export default {
    data() {
        return {

        }
    },
    props: {
        scale: {
            default: 5
        }
    },
    computed: {

    },
    methods: {
        generate() {
            const canvas = document.getElementById('qrcode');
            QRCode.toCanvas(canvas, 'https://www.thisbody.xyz', {
                scale: this.scale,
                margin: 0
            });
        }
    },
    mounted() {
        this.generate();
    }
}
</script>