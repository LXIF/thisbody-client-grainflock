<template>
    <div class='xy-pad'>
        <svg id='xy-pad' :class="svgPosition" @pointerdown='startSetCirclePosition' @pointermove.prevent='setCirclePosition' viewBox='0 0 100 100'>
            <circle class='xy-point' v-for='(user, index) in users' :key='index' :cx='user.position.x' :cy='user.position.y' r='1' />
            <circle class='xy-cursor' :cx='touchX' :cy='touchY' r='5px'></circle>
        </svg>
        <button class="recording-button" :class="buttonMode"  @click="handleButtonClick">OWO</button>
    </div>
</template>

<script>
export default {
    emits: ['presence'],
    props: ['users', 'radius', 'side'],
    data() {
        return {
            touchX: 0,
            touchY: 100,
            touching: false,
            offsetX: 0,
            offsetY: 0,
            recordBuffer: [],
            recordArmed: false,
            recording: false,
            recordInterval: '',
            sampleIntervalMs: 30,
            isPlayingBack: false,
            playbackInterval: '',
            pointerId: ''
        }
    },
    computed: {
        presenceRadius() {
            const min = 3;
            const max = 50;
            return this.radius / 100 * max + min;
        },
        buttonMode() {
            return {
                armed: this.recordArmed,
                recording: this.recording,
                playback: this.isPlayingBack,
                right: this.side === 'left',
                left: this.side === 'right'
            }
        },
        svgPosition() {
            return {
                right: this.side === 'right',
                left: this.side === 'left',
            }
        },
    },
    watch: {
        radius() {
            this.setRadius();
        },
        touching() {
            if(this.recordArmed) {
                if(this.touching) {
                    this.recordBuffer = [];
                    this.recording = true;
                    this.recordInterval = setInterval(() => {
                        if(this.touching) {
                            this.recordBuffer.push({
                                x: this.touchX,
                                y: this.touchY
                            });
                        } else {
                            this.recording = false;
                            clearInterval(this.recordInterval);
                            this.playRecording();
                        }
                    }, this.sampleIntervalMs)
                }
            }
        }
    },
    methods: {
        startSetCirclePosition(e) {
            this.touching = true;
            this.setCirclePosition(e);
            
            this.pointerId = e.pointerId;

            const that = this;

            
            function handlePointerup(e) {

                if(e.pointerId === that.pointerId) {
                    that.endSetCirclePosition();
                    document.querySelector('html').removeEventListener('pointerup', handlePointerup);
                }
            }
            document.querySelector('html').addEventListener('pointerup', handlePointerup);
        },
        endSetCirclePosition() {
            this.touching = false;
        },
        setCirclePosition(e) {
            if(this.isPlayingBack) {
                this.stopPlayback();
            }
            if(this.touching && !this.isPlayingBack) {
                const xyPad = document.getElementById('xy-pad');
                const padWidth = xyPad.clientWidth;
                const padHeight = xyPad.clientHeight;

                let newX = e.offsetX / padWidth * 100;
                let newY = e.offsetY / padHeight * 100;

                if (newX > 100) {
                    newX = 100;
                }
                if (newX < 0) {
                    newX = 0;
                }
                if (newY > 100) {
                    newY = 100;
                }
                if (newY < 0) {
                    newY = 0;
                }

                this.touchX = newX;
                this.touchY = newY;
                this.$emit('presence', {
                        x: this.touchX,
                        y: 100 - this.touchY,
                        radius: this.presenceRadius
                    });
            }
        },
        setRadius() {
            this.$emit('presence', {
                        x: this.touchX,
                        y: this.touchY,
                        radius: this.presenceRadius
                    });
        },
        handleButtonClick() {
            if(!this.recording && !this.isPlayingBack) {
                this.recordArmed = !this.recordArmed;
            }
            if(this.isPlayingBack) {
                this.stopPlayback();
                this.recordArmed = false;
            }
        },
        playRecording() {
            this.isPlayingBack = true;
            let frame = this.recordBuffer.length - 1;
            let forward = false;
            console.log(this.recordBuffer);

            this.playbackInterval = setInterval(() => {
                this.touchX = this.recordBuffer[frame].x;
                this.touchY = this.recordBuffer[frame].y;
                this.$emit('presence', {
                        x: this.touchX,
                        y: 100 - this.touchY,
                    });
                if(!forward) {
                    frame -= 1
                    if(frame === 0) {
                        forward = true;
                    }
                } else {
                    frame += 1
                    if(frame === this.recordBuffer.length - 1) {
                        forward = false;
                    }
                }
            }, this.sampleIntervalMs);
        },
        stopPlayback() {
            this.isPlayingBack = false;
            this.recordArmed = false;
            clearInterval(this.playbackInterval);
        }
    }
}
</script>

<style lang="stylus" scoped>
    .xy-pad
        border 1px solid color-medium-light
        border-radius 10px
        margin 20px
        height 40vh
        padding 10px
        position relative

    .xy-cursor
        stroke color-medium-light
        fill transparent

    .xy-point
        stroke red
        fill red
    svg
        height 35vh
        width inherit
        background-color transparent
        border-radius 10px
        border 1px solid lime
        position absolute
        top 10px
        touch-action none

    .recording-button
        width 50px
        height 50px
        border-radius 25px
        background-color white
        border none
        box-shadow 0 0 10px white
        position absolute
        bottom 5px

    .right
        right 5px

    .left
        left 5px
           

    .armed
        background-color red
        box-shadow 0 0 10px lime

    .recording
        background-color orange
        box-shadow 0 0 10px lime

    .playback
        background-color blue
        box-shadow 0 0 10px lime

</style>