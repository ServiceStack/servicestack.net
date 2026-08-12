import TabbedFeatureShowcase from "./components/TabbedFeatureShowcase.mjs"
import LiveSchemaFrame from "./components/LiveSchemaFrame.mjs"

const LiveApiSchemaExample = {
    components: { LiveSchemaFrame },
    template: `<LiveSchemaFrame
        eyebrow="One API, described and executable"
        title="A live UI generated from the Hello API Schema"
        description="The schema describes the fields, method and execution URL. The same generic UI can therefore render the request, invoke /api/Hello and display its response."
        ui-url="https://blazor-gallery.servicestack.net/schema/Hello?Name=Schema"
        schema-url="https://blazor-gallery.servicestack.net/schema/Hello.json"
        api-url="https://blazor-gallery.servicestack.net/api/Hello?Name=Schema"
        :height="835" />`,
}

const ApiSchemaSurfaces = {
    components: { TabbedFeatureShowcase },
    template: `<TabbedFeatureShowcase eyebrow="One encapsulated contract" title="The right API schema becomes the right UI" :tabs="tabs" />`,
    setup() {
        const tabs = [
            { name:'HTML workbench', icon:'UI', title:'/schema/ApiName', description:'Open the route without .json and ServiceStack composes a complete API workbench from the selected operation’s schema.', features:[
                {title:'Generated form',text:'Nested objects, collections, enums, lookups and validation render automatically.'},
                {title:'Invoke and inspect',text:'Send the request, review generated HTTP and inspect the formatted response in one place.'},
                {title:'Authorization aware',text:'The server remains responsible for access and only executes requests the current user may call.'},
                {title:'No frontend project',text:'A useful, responsive interface exists as soon as the API does.'},
            ]},
            { name:'JSON contract', icon:'{}', title:'/schema/ApiName.json', description:'Add .json to retrieve the same rich, portable JSON Schema for code, tooling and custom user interfaces.', features:[
                {title:'Small by design',text:'Fetch one operation instead of serializing metadata for thousands of unrelated APIs.'},
                {title:'Self-contained',text:'The selected request includes the definitions and annotations required to render it.'},
                {title:'Cacheable boundary',text:'Independent screens and tools can load contracts only when users navigate to them.'},
                {title:'Framework neutral',text:'The schema can drive Vue components, other UI frameworks or external automation.'},
            ]},
            { name:'AI approval', icon:'AI', title:'Schema-driven Auto UI for assistants', description:'AI.Chat uses the same contract to turn a proposed tool call into a trustworthy, editable approval experience.', features:[
                {title:'Human-readable',text:'Descriptions and labels explain what the model intends to submit.'},
                {title:'Fully editable',text:'Users can correct nested values and collections before approving a write.'},
                {title:'Validated',text:'The request is checked by normal ServiceStack validation after submission.'},
                {title:'No duplicate forms',text:'API Explorer, custom Apps and AI assistants share the same schema foundation.'},
            ]},
        ]
        return { tabs }
    }
}

export default { components: { ApiSchemaSurfaces, LiveApiSchemaExample } }
