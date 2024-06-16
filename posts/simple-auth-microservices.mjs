import Templates, { Index, template } from "./components/Templates.mjs"

const AuthTemplates = {
    components: { Templates },
    template:`<Templates :templates="templates" hide="demo" />`,
    setup() {
        
        const templates = [
            template('web', 'SQLite', 'ServiceStack', ['sqlite','apikeys'], null, ['sqlite','apikeys-auth']),
            template('web', 'PostgreSQL', 'ServiceStack', ['postgres','apikeys'], null, ['postgres','apikeys-auth']),
            template('web', 'MySQL', 'ServiceStack', ['mysql','apikeys'], null, ['mysql','apikeys-auth']),
            template('web', 'SQL Server', 'ServiceStack', ['sqlserver','apikeys'], null, ['sqlserver','apikeys-auth']),
        ]
        
        return { Index, templates }
    }
}

export default {
    install(app) {
    },
    components: {
        AuthTemplates,
    },
    setup() {
        return { }
    }
}
