import { createRouter, createWebHistory } from 'vue-router'
// import store from './store/index'

import UserView from './pages/UserView'
import AndriView from './pages/AndriView'
import MidiView from './pages/MidiView'
import UploadView from './pages/UploadView'


const routes = [
    {
        path: '/',
        component: UserView,
    },
    {
        path: '/andri',
        component: AndriView,
    },
    {
        path: '/midi',
        component: MidiView
    },
    {
        path: '/upload',
        component: UploadView
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;