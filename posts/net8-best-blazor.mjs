import { ref } from "vue"
import Templates, { Index } from "./components/Templates.mjs"

const BlazorTemplate = {
    components: { Templates },
    template:`<Templates :templates="[Index['blazor']]" />`,
    setup() {
        return { Index }
    }
}

const BlazorVueTemplate = {
    components: { Templates },
    template:`<Templates :templates="[Index['blazor-vue']]" />`,
    setup() {
        return { Index }
    }
}

const IdentityAuthTemplates = {
    components: { Templates },
    template:`<Templates :templates="[Index['blazor'], Index['blazor-vue'], Index['razor'], Index['mvc'], Index['razor-bootstrap'], Index['mvc-bootstrap']]" hide="demo" />`,
    setup() {
        return { Index }
    }
}

const Counter = {
    template: `
        <p class="my-4">Current count: {{currentCount}}</p>

        <PrimaryButton @click="incrementCount">Click me</PrimaryButton>
    `,
    setup() {
        const currentCount = ref(0)
        const incrementCount = () => currentCount.value++

        return { currentCount, incrementCount }
    }
}

export default {
    install(app) {
    },
    components: {
        BlazorTemplate,
        BlazorVueTemplate,
        IdentityAuthTemplates,
        Counter,
    },
    setup() {
        return { }
    }
}
