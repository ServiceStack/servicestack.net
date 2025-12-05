import { createApp, reactive, ref, computed, nextTick } from "vue"
import { JsonApiClient, $1, $$, enc } from "@servicestack/client"
import ServiceStackVue from "@servicestack/vue"
import HelloApi from "./components/HelloApi.mjs"
import { CopyLine, NuGetPackage } from "./components/CopyLine.mjs"
import GettingStarted from "./components/GettingStarted.mjs"
import ShellCommand from "./components/ShellCommand.mjs"
import VueComponentGallery from "./components/VueComponentGallery.mjs"
import VueComponentLibrary from "./components/VueComponentLibrary.mjs"
import ProjectTemplate from "./components/ProjectTemplate.mjs"
import ProjectCreator from "./components/ProjectCreator.mjs"
import { PagingNav, FileLayout, ApiReference } from "./components/Docs.mjs"
import VibeTemplate from "../posts/components/VibeTemplate.mjs"
import ScreenshotsGallery from "../posts/components/ScreenshotsGallery.mjs"

let client = null, Apps = []
let AppData = {
    init:false,
    installs:{},
}
export { client, AppData, Apps }

/** Simple inline component examples */
const Hello = {
    template: `<b>Hello, {{name}}!</b>`,
    props: { name:String }
}
const Counter = {
    template: `<b @click="count++">Counter {{count}}</b>`,
    setup() {
        let count = ref(1)
        return { count }
    }
}
const Plugin = {
    template:`<div>
        <PrimaryButton @click="show=true">Open Modal</PrimaryButton>
        <ModalDialog v-if="show" @done="show=false">
            <div class="p-8">Hello @servicestack/vue!</div>
        </ModalDialog>
    </div>`,
    setup() {
        const show = ref(false)
        return { show }
    }
}

/** Shared Components */
const Components = {
    HelloApi,
    GettingStarted,
    ShellCommand,
    CopyLine,
    NuGetPackage,
    Hello,
    Counter,
    Plugin,
    VueComponentGallery,
    VueComponentLibrary,
    ProjectTemplate,
    ProjectCreator,
    PagingNav,
    FileLayout,
    ApiReference,
    VibeTemplate,
    ScreenshotsGallery,
}
const CustomElements = [
    'lite-youtube'
]

const alreadyMounted = el => el.__vue_app__ 

/** Mount Vue3 Component
 * @param sel {string|Element} - Element or Selector where component should be mounted
 * @param component 
 * @param [props] {any} */
export function mount(sel, component, props) {
    if (!AppData.init) {
        init(globalThis)
    }
    const el = $1(sel)
    if (alreadyMounted(el)) return
    const app = createApp(component, props)
    Object.keys(Components).forEach(name => {
        app.component(name, Components[name])
    })
    app.use(ServiceStackVue)
    app.component('RouterLink', ServiceStackVue.component('RouterLink'))
    app.directive('highlightjs', (el, binding) => {
        if (binding.value) {
            el.innerHTML = enc(binding.value)
            globalThis.hljs.highlightElement(el)
        }
    })
    app.directive('hash', (el,binding) => {
        /** @param {Event} e */
        el.onclick = (e) => {
            e.preventDefault()
            location.hash = binding.value
        }
    })
    if (component.install) {
        component.install(app)
    }
    if (client && !app._context.provides.client) {
        app.provide('client', client)
    }
    app.config.compilerOptions.isCustomElement = tag => CustomElements.includes(tag)

    app.mount(el)
    Apps.push(app)
    return app
}

async function mountApp(el, props) {
    let appPath = el.getAttribute('data-component')
    if (!appPath.startsWith('/') && !appPath.startsWith('.')) {
        appPath = `../${appPath}`
    }

    const module = await import(appPath)
    unmount(el)
    mount(el, module.default, props)
}

export async function remount() {
    if (!AppData.init) {
        init({ force: true })
    } else {
        mountAll({ force: true })
    }
}

//Default Vue App that gets created with [data-component] is empty, e.g. Blog Posts without Vue components
const DefaultApp = {
    setup() {
        function nav(url) {
            window.open(url)
        }
        return { nav }
    }
}

export function unmount(el) {
    if (!el) return

    try {
        if (el.__vue_app__) {
            el.__vue_app__.unmount(el)
        }
    } catch (e) {
        console.log('force unmount', el.id)
        el._vnode = el.__vue_app__ = undefined
    }
}

export function mountAll(opt) {
    $$('[data-component]').forEach(el => {

        if (opt && opt.force) {
            unmount(el)
        } else {
            if (alreadyMounted(el)) return
        }

        let componentName = el.getAttribute('data-component')
        let propsStr = el.getAttribute('data-props')
        let props = propsStr && new Function(`return (${propsStr})`)() || {}

        if (!componentName) {
            mount(el, DefaultApp, props)
            return
        }

        if (componentName.includes('.')) {
            mountApp(el, props)
            return
        }

        let component = Components[componentName] || ServiceStackVue.component(componentName)
        if (!component) {
            console.error(`Component ${componentName} does not exist`)
            return
        }

        mount(el, component, props)
    })
    $$('[data-module]').forEach(async el => {
        let modulePath = el.getAttribute('data-module')
        if (!modulePath) return
        if (!modulePath.startsWith('/') && !modulePath.startsWith('.')) {
            modulePath = `../${modulePath}`
        }
        try {
            const module = await import(modulePath)
            if (typeof module.default?.load == 'function') {
                module.default.load()
            }
        } catch(e) {
            console.error(`Couldn't load module ${el.getAttribute('data-module')}`, e)
        }
    })
}

/** @param {any} [exports] */
export function init(exports) {
    if (AppData.init) return
    const BaseUrl = location.origin === 'https://localhost:5002'
        ? 'https://localhost:5001'
        : 'https://account.servicestack.net'
    client = JsonApiClient.create(BaseUrl)
    AppData = reactive(AppData)
    AppData.init = true
    nextTick(async () => {
        const res = await fetch(BaseUrl + '/stats/projects.json')
        const json = await res.json()
        AppData.installs = json.results || {}
    })
    mountAll()

    if (exports) {
        exports.client = client
        exports.Apps = Apps
    }
}
