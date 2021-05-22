import Vue from 'vue'

Vue.mixin({
    methods: {
        hasAuth(perm) {
            const permissions = this.$store.state.menus.permissions;
            return permissions.indexOf(perm) > -1
        }
    }
})
