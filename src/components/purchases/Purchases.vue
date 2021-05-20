<template>
    <div>
        <h1>Purchases list</h1>
        <div class="container">
            <div v-if="purchases">
                <v-data-table
                        :headers="headers"
                        :items="purchases"
                        :loading="loading"
                        :options.sync="options"
                        :page.sync="page"
                        :server-items-length="purchasesMeta.total"
                        class=""
                >
                    <template v-slot:item.created_at="{ item }">
                        <span>{{ new Date(item.created_at).toLocaleString() }}</span>
                    </template>
                </v-data-table>
                <div class="text-center pt-2">
                    <v-pagination
                            v-model="page"
                            :length="purchasesMeta.last_page"
                    ></v-pagination>
                </div>
                <button @click="changeSortBy('title', switchSort = !switchSort)">SortTitle</button>
                <button @click="changeSortBy('created_at', switchSort  = !switchSort)">SortCreated</button>
            </div>

            <form
                    @submit="checkForm"
                    name="purchasesForm"
                    novalidate="true"
            >

                <p v-if="errors.length">
                    <b>Пожалуйста исправьте указанные ошибки:</b>
                    <ul>
                        <li v-for="error in errors" v-bind:key="error">{{ error }}</li>
                    </ul>
                </p>

                <p>
                    <label for="title">title</label>
                    <input
                            id="title"
                            v-model="title"
                            type="text"
                            name="title"
                    >
                </p>

                <p>
                    <label for="specId">specId</label>
                    <input
                            id="specId"
                            v-model="specId"
                            name="specId"
                    >
                </p>

                <p>
                    <input
                            type="submit"
                            value="Отправить"
                    >
                </p>

            </form>
        </div>
    </div>
</template>
<script>
//    валидация обратная сортировка и ошибки и дизайн
    import {mapActions, mapState} from 'vuex'

    export default {
        name: "Purchases",
        data() {
            return {
                sortBy: 'created_at',
                sortType: 'asc',
                switchSort: false,
                page: 0,
                errors: [],
                title: null,
                specId: null,
                totalDesserts: 0,
                loading: true,
                options: {},
                headers: [
                    {
                        text: 'Title',
                        align: 'start',
                        sortable: false,
                        value: 'title',
                    },
                    { text: 'Created', value: 'created_at' },
                ],
            }
        },
        async created() {
            this.getPurchases();
        },
        watch: {
            options: {
                handler () {
                    this.getPurchases();
                },
                deep: true,
            },
        },
        computed:
            mapState([
            'purchases',
            'purchasesMeta'
        ]),
        methods: {
            ...mapActions([
                'fetchPurchases',
                'createPurchase',
            ]),
            async getPurchases (page,sortBy,sortType) {
                this.loading = true
                this.fetchPurchases({
                    getParams:{
                        page: page || this.page,
                        sortBy: sortBy || this.sortBy,
                        sortType: sortType || this.sortType
                    }
                }).then(()=> {
                    this.loading = false
                });
            },
            async addPurchase(data) {
                this.loading = true
                this.createPurchase(data).then(()=> {
                    this.loading = false
                });
            },
            changeSortBy(sortBy, switchSort){
                this.sortBy = sortBy;
                this.sortType = switchSort ? 'asc' : 'desc';
                this.getPurchases();
            },
            changePage(page) {
                this.page = page;
                this.getPurchases();
            },
            checkForm: async function (e) {
                e.preventDefault();

                this.errors = [];

                if (!this.title) {
                    this.errors.push('Требуется указать title.');
                } else if (this.title.length < 4 || this.title.length > 100) {
                    this.errors.push('Поле должно быть 4-100 символов.');
                }
                if (!this.specId) {
                    this.errors.push('Требуется указать specId.');
                } else if (! /^[A-Za-z0-9]+$/.test(this.specId)) {
                    this.errors.push('Допустимы только латинские буквы и цифры.');
                }

                if (!this.errors.length) {
                    const formData = new FormData(document.forms.namedItem("purchasesForm"));
                    // for (var pair of formData.entries()) {
                    //     console.log(pair[0]+ ', ' + pair[1]);
                    // }
                    this.getPurchases(this.purchasesMeta.last_page,'created_at', 'asc').then(()=> {
                        this.addPurchase(formData);
                    });
                }
            },

        },
    }

</script>

<style scoped>

</style>