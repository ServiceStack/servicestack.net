import WorkflowShowcase from "./components/WorkflowShowcase.mjs"
import ScreenshotsGallery from "./components/ScreenshotsGallery.mjs"
import Screenshot from "./components/Screenshot.mjs"

const ApiToolsJourney = {
    components: { WorkflowShowcase },
    template: `<WorkflowShowcase eyebrow="Progressive discovery" title="Three small tools unlock every approved API" :steps="steps" />`,
    setup() {
        const steps = [
            { name: 'Ask', caption: 'Natural language intent', title: 'The user describes an outcome', description: 'The model starts with intent—not a route name, DTO or hand-written tool definition. It can ask for a coffee order, a booking, a report or any workflow exposed by the application.', tags: ['User intent', 'Authenticated'] },
            { name: 'Search', caption: 'api_search', title: 'Find only the APIs relevant to the task', description: 'api_search returns compact candidates ranked from ServiceStack metadata, tags, descriptions, keywords and tool guidance. The model avoids loading the application’s entire API surface into context.', tags: ['Low context', 'Ranked results'] },
            { name: 'Learn', caption: 'api_describe', title: 'Load the exact contract just in time', description: 'api_describe supplies the selected request schema, response shape, validation, safety and workflow metadata only when it is needed.', tags: ['JSON Schema', 'Validation'] },
            { name: 'Review', caption: 'Approval UI', title: 'Turn consequential calls into editable proposals', description: 'Calls requiring approval are rendered as schema-driven forms. Users can inspect and modify nested request data before anything is submitted.', tags: ['Human approval', 'Editable'] },
            { name: 'Call', caption: 'api_call', title: 'Execute through the normal ServiceStack pipeline', description: 'The approved request runs as the signed-in user with the same authentication, authorization, validation, filters and business logic as every other client.', tags: ['Policy enforced', 'Typed response'] },
        ]
        return { steps }
    }
}

export default {
    components: {
        ApiToolsJourney,
        Screenshot,
        ScreenshotsGallery,
    }
}
