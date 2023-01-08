import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store/index'

import BaseCard from './components/layout/BaseCard'
import BaseButton from './components/layout/BaseButton'
import BaseFader from './components/UI/BaseFader'
import ConnectionFrame from './components/UI/ConnectionFrame'
import BaseMarquee from './components/layout/BaseMarquee'
import MarqueeButton from './components/UI/MarqueeButton'
import XyPad from './components/UI/XyPad'

createApp(App)

.component('base-card', BaseCard)
.component('base-button', BaseButton)
.component('base-fader', BaseFader)
.component('connection-frame', ConnectionFrame)
.component('base-marquee', BaseMarquee)
.component('marquee-button', MarqueeButton)
.component('xy-pad', XyPad)

.use(router)
.use(store)
.mount('#app')
