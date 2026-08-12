import TabbedFeatureShowcase from "./components/TabbedFeatureShowcase.mjs"

const AiChatPlatform = {
    components: { TabbedFeatureShowcase },
    template: `<TabbedFeatureShowcase eyebrow="Modular by design" title="Shape AI Chat for every audience" :tabs="tabs" />`,
    setup() {
        const tabs = [
            { name:'Everyday AI', icon:'✦', title:'A polished multimodal workspace', description:'Give users a familiar, capable AI experience inside the application they already use.', features:[
                {title:'Multi-provider chat',text:'Use the best approved model for reasoning, writing, coding or media.'},
                {title:'Voice & attachments',text:'Work naturally with text, images, audio, files and PDFs.'},
                {title:'Profiles & projects',text:'Save focused assistants, instructions and working context.'},
                {title:'Themes & galleries',text:'A complete product experience rather than a developer demo.'},
            ]},
            { name:'Enterprise', icon:'E', title:'Private intelligence grounded in your organization', description:'Integrated Auth and scoped extensions turn general AI into a governed workspace for employees and customers.', features:[
                {title:'Integrated Auth',text:'Existing users, roles, permissions and tenant boundaries carry into AI Chat.'},
                {title:'Gemini File Search',text:'Managed enterprise RAG over approved document collections at compelling storage economics.'},
                {title:'API Tools',text:'Let models safely discover and use the business capabilities already in your App.'},
                {title:'Analytics',text:'Understand adoption, activity, token usage and cost across users and models.'},
            ]},
            { name:'Platform', icon:'⚙', title:'Composable extensions instead of a monolith', description:'Every major capability is an encapsulated building block that can contribute server routes, tools, UI and navigation.', features:[
                {title:'Install what fits',text:'Enable the capabilities appropriate for each application and audience.'},
                {title:'Custom modules',text:'Add organization-specific tools and experiences without maintaining a fork.'},
                {title:'MCP endpoint',text:'Make approved capabilities available to external AI assistants as well.'},
                {title:'ServiceStack native',text:'Reuse dependency injection, configuration, APIs, Auth and deployment.'},
            ]},
        ]
        return { tabs }
    }
}

export default { components: { AiChatPlatform } }
