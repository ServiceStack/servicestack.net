import { ref, computed, watch, onMounted, inject } from "vue"
import { rightPart } from "@servicestack/client"

export default {
    template:`
    <div class="flex gap-x-1">
        <div class="w-1/2">
            <div class="flex justify-between items-center">
                <div class="mr-4">
                    <h4 class="ml-2 text-sm font-semibold leading-7 text-gray-600">Data Models</h4>
                </div>
                <div>
                    <div class="border-b border-gray-200">
                        <nav class="-mb-px flex space-x-2" aria-label="Tabs">
                            <!-- Current: "border-indigo-500 text-indigo-600", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" -->
                            <span class="select-none mb-1 bg-gray-50 whitespace-nowrap border-b-2 border-indigo-500 px-3 py-2 text-sm font-medium text-indigo-600" aria-current="page">
                                {{tsdFileName}}
                            </span>
                        </nav>
                    </div>
                </div>
            </div>
            <div class="border max-h-[900px] overflow-auto">
                <textarea ref="refTsd" class="hidden"></textarea>
            </div>
        </div>
        <div class="w-1/2">
            <div class="flex justify-between items-center">
                <div class="mr-4">
                    <h4 class="ml-2 text-sm font-semibold leading-7 text-gray-600">Generated Files</h4>
                </div>
                <div>
                    <div class="border-b border-gray-200">
                        <nav class="-mb-px flex space-x-2 justify-end" aria-label="Tabs">
                            <!-- Current: "border-indigo-500 text-indigo-600", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" -->
                            <span v-for="file in generationFiles" v-href="{tab:file.label}" 
                                  :class="['select-none block mb-1 whitespace-nowrap bg-gray-50 border-b-2 px-3 py-2 text-sm font-medium', routes.tab === file.label || (!routes.tab && file.label === 'APIs') 
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'cursor-pointer border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700']" aria-current="page">
                                {{file.label}}
                            </span>
                        </nav>
                    </div>
                </div>
            </div>
            <div class="border max-h-[900px] h-full overflow-auto">
                <textarea ref="refGen" class="hidden"></textarea>
            </div>
        </div>
    </div>
    `,
    props: {
        gist: Object,
    },
    setup(props) {
        const routes = inject('routes')
        let cmTsd, cmGen
        const refTsd = ref()
        const refGen = ref()

        function getLabel(path) {
            return path.endsWith('index.mjs')
                ? null
                : path.endsWith('.cs') && path.includes('ServiceModel')
                    ? 'APIs'
                    : path.includes('Migration')
                        ? 'Migration'
                        : path.endsWith('.mjs')
                            ? 'Admin UI'
                            : null
        }

        const generationFiles = computed(() => {
            return Object.keys(props.gist.files).filter(x => getLabel(x)).map(path => {
                const file = props.gist.files[path]
                return Object.assign({}, file, {label: getLabel(path), path})
            })
        })

        const tsdFileName = computed(() => {
            return rightPart(Object.keys(props.gist.files).find(x => x.endsWith('.d.ts')), '/')
        })

        function setTsdContent(code) {
            if (!refTsd.value) return
            if (!cmTsd) {
                cmTsd = CodeMirror.fromTextArea(refTsd.value, {
                    lineNumbers: true,
                    //styleActiveLine : true,
                    matchBrackets: true,
                    mode: "text/typescript",
                    //theme: 'ctp-mocha',
                    readOnly: true,
                    value: ''
                })
            }
            if (code.trimStart().startsWith('/*prompt:')) {
                code = rightPart(code, '*/').trim()
            }
            cmTsd.setValue(code)
            cmTsd.setSize(null, 'auto')
            setCSharpContent('')
        }

        function updateCSharpContent() {
            //console.log('updateCSharpContent', routes.tab, generationFiles.value.length)
            generationFiles.value.forEach(file => {
                if (routes.tab === file.label || (!routes.tab && file.label === 'APIs')) {
                    setCSharpContent(file.content)
                }
            })
        }

        function setCSharpContent(code) {
            //console.log('setCSharpContent', refGen.value, code)
            if (!refGen.value) return
            if (!cmGen) {
                cmGen = CodeMirror.fromTextArea(refGen.value, {
                    lineNumbers: true,
                    //styleActiveLine : true,
                    matchBrackets: true,
                    mode: code.includes('export ') ? "text/typescript" : "text/x-csharp",
                    //theme: 'ctp-mocha',
                    readOnly: true,
                    value: ''
                })
            }
            cmGen.setValue(code)
            cmGen.setSize(null, 'auto')
        }

        watch(() => routes.tab,  updateCSharpContent)

        onMounted(() => {
            setTsdContent(props.gist.files[Object.keys(props.gist.files).find(x => x.endsWith('.d.ts'))]?.content || '')
            updateCSharpContent()
        })

        return {
            routes,
            refTsd,
            refGen,
            tsdFileName,
            generationFiles,
        }
    }
}