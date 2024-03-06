import { ref } from "vue"
import Templates, { Index } from "./components/Templates.mjs"

const ComposeTemplate = {
    components: { Templates },
    template:`<Templates :templates="[Index['kmp-desktop']]" />`,
    setup() {
        return { Index }
    }
}

export default {
    install(app) {
    },
    components: {
        ComposeTemplate,
    },
    setup() {
        return { }
    }
}
