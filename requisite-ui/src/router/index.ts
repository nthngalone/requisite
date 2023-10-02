import { type RouteRecordRaw, createRouter, createWebHistory, useRoute } from 'vue-router';
import Login from '../views/Login.vue';
import Home from '../views/Home.vue';
import SignUp from '../views/SignUp.vue';
import Profile from '../views/Profile.vue';

const routes: Array<RouteRecordRaw> = [
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

export function $getCurrentRouteName(): string | undefined {
    const route = useRoute();
    return route.name?.toString();
}

export function $routeByName(
    name: string,
    params?: { [key: string]: string }
): void {
    // Check the current route.  The Vue router will throw an error if you try to
    // go to the same route you're currently on
    if (router.currentRoute.value.name !== name) {
        router.push({ name, params });
    }
}

export function $routeByPath(path: string): void {
    // Check the current route.  The Vue router will throw an error if you try to
    // go to the same route you're currently on
    if (router.currentRoute.value.path !== path) {
        router.push(path);
    }
}

export function $routeBack(): void {
    router.go(-1);
}
