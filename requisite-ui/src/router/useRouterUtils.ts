import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export default function useRouterUtils() {
    const route = useRoute();
    const router = useRouter();
    const currentRouteName = computed(() => route.name);

    const routeByName = (
        name: string,
        params?: Record<string, string>
    ): void => {
        // Check the current route.  The Vue router will throw an error if you try to
        // go to the same route you're currently on
        if (router.currentRoute.value.name !== name) {
            router.push({ name, params });
        }
    };

    const routeByPath = (path: string): void => {
        // Check the current route.  The Vue router will throw an error if you try to
        // go to the same route you're currently on
        if (router.currentRoute.value.path !== path) {
            router.push(path);
        }
    };

    const routeBack = (): void => {
        router.go(-1);
    };

    return {
        currentRouteName,
        routeByName,
        routeByPath,
        routeBack
    };
}
