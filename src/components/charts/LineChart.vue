<template>
  <div class="chart-parent mb-5 mt-8">
    <canvas ref="chart"></canvas>
  </div>
</template>
<script>
import Chart from 'chart.js/auto'
import 'chartjs-adapter-moment'
export default {
  mounted() {
    this.initPieChart()
  },
  props: {
    rankingData: {
      type: Object,
      required: false,
      default: function() {
        return {
          start_date: this.$moment()
            .subtract(30, 'days')
            .format('YYYY-MM-DD'),
          end_date: this.$moment().format('YYYY-MM-DD')
        }
      }
    }
  },
  data() {
    return {
      gradient: null
    }
  },
  methods: {
    initPieChart() {
      this.$nextTick(function() {
        this.gradient = this.$refs.chart
          .getContext('2d')
          .createLinearGradient(0, 0, 0, 120)

        this.gradient.addColorStop(0, 'rgba(251, 203, 241, 1)')
        this.gradient.addColorStop(0.5, 'rgba(251, 203, 241, 0.5)')
        this.gradient.addColorStop(1, 'rgba(255, 255, 255, 0.5)')

        new Chart(this.$refs.chart, {
          type: 'line',
          data: {
            labels: this.getDateRange(
              this.rankingData?.start_date,
              this.rankingData?.end_date,
              'days',
              'YYYY-MM-DD HH:mm:ss'
            ),
            datasets: [
              {
                label: '',
                data: Array(31)
                  .fill()
                  .map(() => Math.round(Math.random() * 31)),
                borderColor: '#AA158B',
                pointBackgroundColor: '#AA158B',
                pointBorderColor: '#AA158B',
                borderWidth: 1,
                tension: 0.4,
                fill: {
                  target: 'origin',
                  above: this.gradient
                }
              }
            ]
          },
          plugins: [
            {
              afterDraw: chart => {
                if (chart.tooltip?._active?.length) {
                  let x = chart.tooltip._active[0].element.x
                  let yAxis = chart.scales.y
                  let ctx = chart.ctx
                  ctx.save()
                  ctx.beginPath()
                  ctx.moveTo(x, chart.tooltip.y + 20)
                  ctx.lineTo(x, yAxis.bottom)
                  ctx.lineWidth = 1
                  ctx.strokeStyle = 'rgba(170, 21, 139, 0.2)'
                  ctx.stroke()
                  ctx.restore()
                }
              }
            }
          ],
          options: {
            interaction: {
              mode: 'index',
              intersect: false
            },
            plugins: {
              legend: {
                display: false
              },
              tooltip: {
                enabled: true,
                displayColors: false,
                backgroundColor: '#ffffff',
                bodyColor: '#AA158B',
                titleColor: '#AA158B',
                borderWidth: 1,
                borderColor: 'rgba(0,0,0,0.3)'
              }
            },
            elements: {
              point: {
                radius: 0,
                hitRadius: 4,
                hoverRadius: 4
              }
            },
            scales: {
              x: {
                grid: {
                  display: false
                },
                type: 'time', // Default: Handled by the imported "chartjs-adapter-moment" plugin
                time: {
                  displayFormats: {
                    day: 'M/D' // Here, Key: is the used unit for the time and value: to show on chart accordingly.
                  },
                  unit: 'day',
                  stepSize: 5,
                  tooltipFormat: 'M/D'
                }
              },
              y: {
                grid: {
                  color: '#e9e9e9'
                },
                ticks: {
                  // forces step size to be 50 units
                  stepSize: 10
                }
              }
            },
            responsive: true,
            maintainAspectRatio: false
          }
        })
      })
    }
  }
}
</script>
<style scoped>
#tooltip {
  opacity: 0;
  position: absolute;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 3px;
  -webkit-transition: all 0.1s ease;
  transition: all 0.1s ease;
  pointer-events: none;
  padding: 4px;
  margin: 15px;
  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
  font-size: 13px;
}
.chart-parent {
  height: 160px;
  width: 100%;
}
canvas {
  position: relative;
  width: 100%;
  height: 160px;
  z-index: 3;
}
</style>
