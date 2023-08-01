import { ref, onMounted } from "vue"
import { addScript } from "@servicestack/client"

const addChartsJs = await addScript('../js/chart.js')

const ChartJs = {
    template:`
        <div>
            <canvas ref="chart"></canvas>
        </div>
    `,
    props:['type','data','options'],
    setup(props) {
        const chart = ref()
        onMounted(async () => {
            await addChartsJs

            const options = props.options || {
                responsive: true,
                legend: {
                    position: "top"
                }
            }
            new Chart(chart.value, {
                type: props.type || "bar",
                data: props.data,
                options,
            })

        })
        return { chart }
    }
}

export default {
    components: { ChartJs }
}

