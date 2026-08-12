import WorkflowShowcase from "./components/WorkflowShowcase.mjs"

const PdfLifecycle = {
    components: { WorkflowShowcase },
    template: `<WorkflowShowcase eyebrow="Design to production" title="One governed PDF lifecycle" :steps="steps" />`,
    setup() {
        const steps = [
            { name:'Design', caption:'PDF Studio', title:'Create against representative data', description:'Start from Typst, a reusable library template, an uploaded document or an AI-assisted draft. Form and Code views keep the document data visible and editable.', tags:['Visual preview','Typst'] },
            { name:'Refine', caption:'AI + editor', title:'Iterate with natural language and source control', description:'Ask AI to change the layout, typography or structure, then inspect and refine the generated Typst directly. Every saved revision remains explicit.', tags:['AI assisted','Editable source'] },
            { name:'Publish', caption:'Promotion gate', title:'Validate before production', description:'Publish is a controlled boundary that validates templates and fixtures before promoting an immutable version into Admin PDF.', tags:['Validation','Contract fixtures'] },
            { name:'Integrate', caption:'Typed C#', title:'Generate the production data contract', description:'Generate strongly typed C# models from the template data so application code and document design share a compile-time contract.', tags:['Typed DTOs','IntelliSense'] },
            { name:'Operate', caption:'Admin PDF', title:'Render, audit and roll back safely', description:'Production rendering uses the published template history with administrative visibility, reversible rollback and the controls expected in a multi-user ServiceStack App.', tags:['History','Rollback'] },
        ]
        return { steps }
    }
}

export default { components: { PdfLifecycle } }
