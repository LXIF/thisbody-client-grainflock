import { createRouter, createWebHistory } from 'vue-router'
// import store from './store/index'

import UserView from './pages/UserView'
import AndriView from './pages/AndriView'


const routes = [
    {
        path: '/',
        component: UserView,
    },
    {
        path: '/andri',
        component: AndriView,
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;