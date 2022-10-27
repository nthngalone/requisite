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
import User from '@requisite/model/lib/user/User';
import HeaderNavigationStateManager from '../state-managers/HeaderNavigationStateManager';
import { isNotBlank } from '@requisite/utils/lib/lang/StringUtils';
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
    setup(props, context): Record<string, unknown> {

        // Reactive data
        const headerNavigationStateManager = reactive(new HeaderNavigationStateManager());

        // Computed getters
        const user = computed((): User => {
            return headerNavigationStateManager.user;
        });
        const viewName = computed((): string | undefined => {
            return $getCurrentRouteName();
        });
        const name = computed((): string => {
            return headerNavigationStateManager.user &&
                   headerNavigationStateManager.user.name
                ? `${headerNavigationStateManager.user.name.firstName} ${headerNavigationStateManager.user.name.lastName}`
                : '';
        });
        const initials = computed((): string => {
            return headerNavigationStateManager.user &&
                headerNavigationStateManager.user.name &&
                isNotBlank(headerNavigationStateManager.user.name.firstName) &&
                isNotBlank(headerNavigationStateManager.user.name.lastName)
                ? `${headerNavigationStateManager.user.name.firstName[0]}${headerNavigationStateManager.user.name.lastName[0]}`
                : '';
        });

        // Watchers
        watch(
            () => headerNavigationStateManager.systemError,
            (isSystemError: boolean) => {
                context.emit('system-error', isSystemError);
            }
        );

        // Methods
        const profile = (): void => {
            $routeByName('Profile');
        };

        const logout = async (): Promise<void> => {
            await headerNavigationStateManager.logout();
            $routeByName('Login');
        };

        onMounted(() => {
            headerNavigationStateManager.initialize(props.secured);
        });

        return {
            headerNavigationStateManager,
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
