import { ref, computed } from "vue"

export default {
    template:`
    <div class="flex items-center justify-between border-gray-200 bg-white dark:bg-black py-3">
        <div v-if="pages > 1 && total > 0 && total > pageSize" class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
                <p class="text-sm text-gray-700 flex gap-x-1">
                    <span class="hidden lg:inline">Showing</span>
                    <span class="font-medium">{{page < 2 ? 1 : 1 + (page * pageSize)}}</span>
                    to
                    <span class="font-medium">{{(page < 2 ? 1 : page * pageSize) + pageSize}}</span>
                    of
                    <span class="font-medium">{{total}}</span>
                    <span class="hidden lg:inline">results</span>
                </p>
            </div>
            <div class="hidden md-rename:block">
                <span class="isolate inline-flex rounded-md shadow-sm">
                    <span v-for="size in pageSizes" v-href="{page:1, pageSize:size}" :class="getClass(size)">{{size}}</span>
                </span>
            </div>
            <div>
                <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <span v-if="startPage > 1" v-href="{page:1,pageSize}" class="cursor-pointer relative inline-flex items-center px-2 py-2 text-gray-400 hover:text-gray-500" title="First Page">
                        <span class="sr-only">First</span>
                        <svg class="h-5 w-5 " xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M8.5 5v14h-2V5zm9.164 1.75L12.414 12l5.25 5.25l-1.414 1.414L9.586 12l6.664-6.664z"/></svg>
                    </span>
                    <span v-if="page > 1" v-href="{page:page-1,pageSize}" class="cursor-pointer relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                        <span class="sr-only">Previous</span>
                        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd"/>
                        </svg>
                    </span>
                    <span v-for="pageNo in getPages()" v-href="{page:pageNo, pageSize}" 
                        :class="['cursor-pointer relative items-center px-4 py-2 text-sm font-semibold', page == pageNo 
                            ? 'z-10 inline-flex bg-indigo-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                            : 'hidden text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex']" aria-current="page">
                            {{pageNo}}
                    </span>
                    <template v-if="pages > endPage">
                        <span class="relative hidden lg:inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">...</span>
                        <span v-href="{page:pages,pageSize}" class="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">{{pages}}</span>
                    </template>
                    <span v-if="page < pages" v-href="{page:page+1,pageSize}" class="cursor-pointer relative hidden lg:inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
                        <span class="sr-only">Next</span>
                        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd"/>
                        </svg>
                    </span>
                </nav>
            </div>
        </div>
        <div v-else class="-mt-8">
            <p class="text-sm text-gray-700">
                Showing
                <span class="font-medium">{{total}}</span>
                results:
            </p>
        </div>
    </div>    
    `,
    props: {
        path: String,
        page: Number,
        total: Number,
        pageSize: {
            type: Number,
            default: 10
        }
    },
    setup(props) {
        const pageSizes = ref([10, 25, 50])
        const pages = computed(() => Math.ceil(props.total / props.pageSize))
        const endPage = computed(() => Math.min(startPage.value + 5, pages.value))
        const startPage = computed(() => props.page > 1 ? Math.max(0, props.page - 3) : 0)

        function getPages() {
            const pages = []
            for (let i = startPage.value; i < endPage.value; i++) {
                pages.push(i + 1)
            }
            return pages
        }

        function getClass(size) {
            const cls = (size === 10
                    ? "rounded-l-md "
                    : size === 50
                        ? "rounded-r-md "
                        : "")
                + (size === props.pageSize
                    ? "cursor-pointer relative z-10 inline-flex items-center bg-indigo-600 px-4 py-2 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    : "cursor-pointer relative inline-flex items-center bg-white dark:bg-black px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10")
            return cls
        }

        return {
            pageSizes,
            pages,
            endPage,
            startPage,
            getClass,
            getPages,
        }
    }
}