<template>
    <div>
        <r-navbar
            title="Requisite"
            :subtitle="viewName"
            name="requisite-header-navigation"
        >
            <r-avatar-menu
                v-if="user.userName"
                name="avatar-menu"
                :avatar-text="initials"
                :menu-options="[{
                    name: 'user-name',
                    text: name
                }, {
                    name: 'separator-1',
                    separator: true
                }, {
                    name: 'profile-link',
                    method: profile,
                    text: 'Profile'
                }, {
                    name: 'signout-link',
                    method: logout,
                    text: 'Sign Out'
                }]">
            </r-avatar-menu>
        </r-navbar>
    </div>
</template>

<script lang="ts">
import HeaderNavigationStateManager from '../state-managers/HeaderNavigationStateManager';
import { reactive, computed, onMounted, watch, defineComponent } from 'vue';
import { $getCurrentRouteName, $routeByName } from '../router';

export default defineComponent({
    props: {
        secured: {
            type: Boolean,
            required: false,
            default: false
        }
    },
    emits: ['system-error'],
    setup(props, context) {

        // Reactive data
        const headerNavigationStateManager = reactive(new HeaderNavigationStateManager());

        // Computed getters
        const user = computed(() => {
            return headerNavigationStateManager.user;
        });
        const viewName = computed(() => {
            return $getCurrentRouteName();
        });
        const name = computed(() => {
            const firstName = headerNavigationStateManager?.user?.name?.firstName || '';
            const lastName = headerNavigationStateManager?.user?.name?.lastName || '';
            return `${firstName} ${lastName}`.trim();
        });
        const initials = computed(() => {
            const firstName = headerNavigationStateManager?.user?.name?.firstName || ' ';
            const lastName = headerNavigationStateManager?.user?.name?.lastName || ' ';
            return `${firstName[0]}${lastName[0]}`.trim();
        });

        // Watchers
        watch(
            () => headerNavigationStateManager.systemError,
            (isSystemError) => {
                context.emit('system-error', isSystemError);
            }
        );

        // Methods
        const profile = () => {
            $routeByName('Profile');
        };

        const logout = async () => {
            await headerNavigationStateManager.logout();
            $routeByName('Login');
        };

        onMounted(() => {
            headerNavigationStateManager.initialize(props.secured);
        });

        return {
            user,
            viewName,
            name,
            initials,
            profile,
            logout
        };
    }

});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">

.requisite-header-navigation {
    .navbar {
        h3 { margin: 40px 0 0; }
        ul { list-style-type: none; padding: 0; }
        li { display: inline-block; margin: 0 10px; }
        .nav-link { color: white; }
    }
}

</style>
