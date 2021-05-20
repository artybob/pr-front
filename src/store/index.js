import Vue from "vue";
import Vuex from "vuex";
import storePlugins from "@/plugins/storePlugins";

Vue.use(Vuex);

const ADD_PURCHASES = "ADD_PURCHASES";
const GET_PURCHASES = "GET_PURCHASES";

export default new Vuex.Store({
    plugins: [storePlugins],
    state: {
        purchases: [],
        purchasesMeta: [],
    },
    getters: {
        sortedPurchases (state) {
            return parent._.orderBy(state.purchases, 'title', 'asc');
        },
    },
    mutations: {
        [GET_PURCHASES](state, purchases) {
            state.purchases = purchases.data;
            state.purchasesMeta = purchases.meta;
        },
        [ADD_PURCHASES](state, purchase) {
            state.purchases = [...state.purchases, purchase];
            state.purchasesMeta = purchase.meta;
        },
    },
    actions: {
        async fetchPurchases({ commit }, urlParams) {
            const purchases = await this.$api.purchases.fetch(urlParams);
            commit(GET_PURCHASES, purchases);
            console.log({ message: "Purchases from vuex", purchases });
        },

        async createPurchase({ commit }, data) {
            const purchase = await this.$api.purchases.post(data);
            commit(ADD_PURCHASES, purchase.data);
            console.log({ message: "Created purchase", purchase });
        },
    }
});