import OpenAiChatLangs from "/mjs/components/OpenAiChatLangs.mjs"
import { onMounted, onUnmounted, reactive } from "vue"

const OpenAiChat = {
    components: { OpenAiChatLangs },
    template: `
        <OpenAiChatLangs baseUrl="https://ai.llmspy.org" :routes="routes">
            <div class="lg:max-w-lg">
                <h2 class="text-base font-semibold leading-7 text-indigo-600">One typed API everywhere</h2>
                <p class="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                    OpenAI Chat Completions
                </p>
                <p class="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                    Select any language to see its native Service Client call the same typed
                    <code>ChatCompletion</code> API.
                </p>
                <p class="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                    The generated Request DTO describes its response type, route and HTTP method,
                    whilst each client preserves the conventions of its language.
                </p>
            </div>
        </OpenAiChatLangs>`,
    setup() {
        const getLang = () => new URLSearchParams(location.search).get('lang') || 'go'
        const routes = reactive({ lang: getLang() })
        const updateRoute = () => routes.lang = getLang()
        onMounted(() => window.addEventListener('popstate', updateRoute))
        onUnmounted(() => window.removeEventListener('popstate', updateRoute))
        return { routes }
    }
}

export default {
    components: { OpenAiChat },
}
