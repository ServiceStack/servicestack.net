import TabbedFeatureShowcase from "./components/TabbedFeatureShowcase.mjs"
import LiveSchemaFrame from "./components/LiveSchemaFrame.mjs"

const LiveAutoQueryExample = {
    components: { LiveSchemaFrame },
    template: `<LiveSchemaFrame
        eyebrow="One model, a complete CRUD surface"
        title="A live Booking UI generated from one AutoQuery Schema"
        description="The model envelope combines its Query and authorized CRUD APIs so one generic component can provide the grid, filters, paging and data forms."
        ui-url="https://blazor-gallery.servicestack.net/auto/Booking"
        schema-url="https://blazor-gallery.servicestack.net/auto/Booking.json"
        :height="620" />`,
}

const AutoQueryAppShowcase = {
    components: { TabbedFeatureShowcase },
    template: `<TabbedFeatureShowcase eyebrow="One model, a complete data App" title="Explore the capabilities encoded by AutoQuery" :tabs="tabs" />`,
    setup() {
        const tabs = [
            { name:'Query', icon:'Q', title:'Fast, typed data exploration', description:'The model schema gives /auto everything needed to present a capable query experience without a custom page.', features:[
                {title:'Data grid',text:'Responsive columns, formatting and metadata-aware values out of the box.'},
                {title:'Filtering',text:'Use the query conventions already supported by the AutoQuery API.'},
                {title:'Sorting & paging',text:'Navigate large datasets without downloading them into the browser.'},
                {title:'Preferences',text:'Users choose visible columns and page size for the task at hand.'},
            ]},
            { name:'Create', icon:'+', title:'Create records from schema-generated forms', description:'Create DTO metadata becomes a rich form with the right fields, descriptions, validation and referenced data.', features:[
                {title:'Validation',text:'Required fields and constraints are visible before the request reaches the server.'},
                {title:'Enums & options',text:'Finite choices render as intentional controls instead of free-form text.'},
                {title:'Reference lookups',text:'Foreign keys become searchable lookup experiences for related records.'},
                {title:'Server authority',text:'The ordinary AutoQuery CRUD Service still owns validation and persistence.'},
            ]},
            { name:'Edit & delete', icon:'✎', title:'Safe administration without bespoke CRUD screens', description:'Update and delete capabilities appear only when their APIs and authorization rules make them available.', features:[
                {title:'Partial updates',text:'Edit the relevant fields using the generated update contract.'},
                {title:'Guarded deletes',text:'Consequential operations are explicit and confirmable.'},
                {title:'Role scoped',text:'Users see actions appropriate to their roles and permissions.'},
                {title:'Consistent errors',text:'Validation and API failures return through the same structured experience.'},
            ]},
        ]
        return { tabs }
    }
}

export default { components: { AutoQueryAppShowcase, LiveAutoQueryExample } }
