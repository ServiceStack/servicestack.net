import { JsonApiClient } from "@servicestack/client"
import ServiceStackVue, { useMetadata } from "@servicestack/vue"
export default {
    install(app) {
        const client = JsonApiClient.create('https://blazor-gallery-api.jamstacks.net/')

        app.provide('client', client)
        app.use(ServiceStackVue)
        app.component('RouterLink', ServiceStackVue.component('RouterLink'))

        const { loadMetadata } = useMetadata()
        loadMetadata({
            olderThan: 24 * 60 * 60 * 1000, //1day
            resolvePath: '/pages/vue/metadata.json'
        })
    }
}
