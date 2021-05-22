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
                        :sort-by.sync="sortBy"
                        :sort-desc.sync="sortDesc"
                        :server-items-length="purchasesMeta.total"
                        hide-default-footer
                        dense
                        class=""
                >
                    <template v-slot:top>
                        <v-toolbar flat>
                            <v-toolbar-title>Purchases</v-toolbar-title>
                            <v-divider
                                    class="mx-4"
                                    inset
                                    vertical
                            ></v-divider>
                            <v-spacer></v-spacer>
                            <v-dialog
                                    v-model="dialog"
                                    max-width="500px"
                            >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-btn
                                            color="primary"
                                            dark
                                            class="mb-2"
                                            v-bind="attrs"
                                            v-on="on"
                                    >
                                        New Item
                                    </v-btn>
                                </template>
                                <v-card>
                                    <v-card-title>
                                        <span class="headline">Create new purchase</span>
                                    </v-card-title>
                                    <v-form v-model="valid"
                                            ref="form"
                                            @submit.prevent="submit"
                                            name="purchasesForm">
                                        <v-card-text>
                                            <v-container class="">
                                                    <div style="max-width: 400px" class="ma-auto mb-6">
                                                        <v-row>
                                                            <v-col
                                                                    cols="12"
                                                            >
                                                                <v-text-field
                                                                        id="title"
                                                                        v-model="title"
                                                                        type="text"
                                                                        name="title"
                                                                        :rules="titleRules"
                                                                        :counter="100"
                                                                        label="Purchase title"
                                                                        required
                                                                ></v-text-field>
                                                            </v-col>
                                                            <v-col
                                                                    cols="12"
                                                            >
                                                                <v-text-field
                                                                        id="specId"
                                                                        v-model="specId"
                                                                        name="specId"
                                                                        :rules="specIdRules"
                                                                        label="Specification Id"
                                                                        required
                                                                ></v-text-field>
                                                            </v-col>
                                                        </v-row>
                                                    </div>
                                                </v-container>
                                        </v-card-text>

                                        <v-card-actions>
                                        <v-spacer></v-spacer>
                                            <v-btn
                                                    color="blue darken-1"
                                                    text
                                                    @click="close"
                                            >
                                                Cancel
                                            </v-btn>
                                            <v-btn
                                                    text
                                                    :disabled=!valid
                                                    @click="submit"
                                                    type="submit"
                                            >
                                                Save
                                            </v-btn>
                                        </v-card-actions>
                                    </v-form>
                                </v-card>
                            </v-dialog>
                        </v-toolbar>
                    </template>

                    <template v-slot:item.created_at="{ item }">
                        <span>{{ new Date(item.created_at).toLocaleString() }}</span>
                    </template>

                </v-data-table>
                <div class="text-center pt-2">
                    <v-pagination
                            :disabled="loading"
                            v-model="page"
                            :length="purchasesMeta.last_page"
                    ></v-pagination>
                </div>
            </div>

        </div>

        <v-snackbar
                v-model="snackbar"
                :timeout="timeout"
                :color="snackColor"
        >{{alertMessage}}
            <template v-slot:action="{ attrs }">
                <v-btn
                        color="white"
                        text
                        v-bind="attrs"
                        @click="snackbar = false"
                >
                    Close
                </v-btn>
            </template>
        </v-snackbar>
    </div>
</template>
<script>
    import {mapActions, mapState} from 'vuex'
    import {eventBus} from '@/main'

    export default {
        name: "Purchases",
        data() {
            return {
                dialog: false,
                snackbar: false,
                snackColor: 'success',
                alertMessage: '',
                timeout: 10000,
                sortDesc: true,
                sortBy: 'created_at',
                sortType: 'asc',
                page: 1,
                title: '',
                specId: '',
                valid: false,
                loading: true,
                options: {},
                headers: [
                    {
                        text: 'Id',
                        sortable: false,
                        align: 'start',
                        value: 'id',
                    },
                    {
                        text: 'Title',
                        align: 'start',
                        value: 'title',
                    },
                    {   text: 'Created',
                        value: 'created_at',
                        align: 'end',
                    },
                ],
                specIdRules: [
                    v => !!v || 'Specification Id is required',
                    v => v.length >= 4 || 'Specification Id must be least than 4 characters',
                    v => /^[A-Za-z0-9]+$/.test(v) || 'Only Latin letters and numbers are allowed.',
                ],
                titleRules: [
                    v => !!v || 'title is required',
                    v => v.length >= 4 || 'Title must be least than 4 characters',
                    v => v.length <= 100 || 'Title must be less than 100 characters',
                ],
            }
        },
        created() {
            eventBus.$on('api-error', response => {
                this.alertMessage = response;
                this.alertSnack('error')
            })
        },
        beforeDestroy() {
            eventBus.$off('api-error');
        },
        watch: {
            options: {
                handler () {
                    this.sortType = this.sortDesc ? 'asc' : 'desc';
                    this.getPurchases();
                },
                deep: true,
            },
            dialog (val) {
                val || this.close()
            },
        },
        computed:
            mapState([
            'purchase',
            'purchases',
            'purchasesMeta'
        ]),
        methods: {
            ...mapActions([
                'fetchPurchases',
                'createPurchase',
            ]),
            toggleOrder () {
                this.sortDesc = !this.sortDesc;
            },
            nextSort () {
                let index = this.headers.findIndex(h => h.value === this.sortBy)
                index = (index + 1) % this.headers.length
                this.sortBy = this.headers[index].value
            },
            close () {
                this.dialog = false;
            },
            alertSnack(snackColor) {
                this.snackColor = snackColor;
                this.snackbar = true;
            },
            async getPurchases (page, sortBy, sortType) {
                this.loading = true
                this.fetchPurchases({
                    getParams:{
                        page: page || this.page,
                        sortBy: sortBy || this.sortBy,
                        sortType: sortType || this.sortType
                    }
                }).then(()=> {
                    this.loading = false;
                });
            },
            async addPurchase(data) {
                this.loading = true
                this.createPurchase(data).then(()=> {
                    this.alertMessage = `Purchase ${this.purchase.title} was successfully created at ${ new Date(this.purchase.created_at).toLocaleString() }`;
                    this.alertSnack('success');
                    this.dialog = false;
                    this.loading = false;
                });
            },
            submit: async function () {
                this.$refs.form.validate();

                const formData = new FormData(document.forms.namedItem("purchasesForm"));
                this.addPurchase(formData).then(()=> {
                    this.getPurchases(this.purchasesMeta.last_page,'created_at', 'asc').then(()=> {
                    });
                })
            },

        },
    }

</script>

<style scoped>

</style>