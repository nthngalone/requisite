import { type RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Home from '../views/Home.vue';
import SignUp from '../views/SignUp.vue';
import Profile from '../views/Profile.vue';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Login',
        component: Login
    },
    {
        path: '/home',
        name: 'Home',
        component: Home
    },
    {
        path: '/sign-up',
        name: 'SignUp',
        component: SignUp
    },
    {
        path: '/profile',
        name: 'Profile',
        component: Profile
    }
    // ,
    // {
    //     path: '/about',
    //     name: 'About',
    //     // route level code-splitting
    //     // this generates a separate chunk (about.[hash].js) for this route
    //     // which is lazy-loaded when the route is visited.
    //     component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    // }
];

const router = createRouter({
    history: createWebHistory('/'),
    routes
});

export default router;
