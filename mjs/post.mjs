import { ref, onMounted } from "vue"

const ChartJs = {
    template:`
        <div>
            <canvas ref="chart"></canvas>
        </div>
    `,
    props:['type','data','options'],
    setup(props) {
        const chart = ref()
        onMounted(() => {
            
            const options = props.options || {
                responsive: true,
                legend: {
                    position: "top"
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
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
