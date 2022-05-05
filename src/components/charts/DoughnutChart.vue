<template>
  <div class="doughnut-main-blk d-flex align-center justify-center mt-5 mb-7">
    <div class="chart-parent">
      <div class="chart-text d-flex flex-column align-center justify-center">
        <slot name="inner-text"></slot>
      </div>
      <canvas ref="chart"></canvas>
      <slot name="bottom-text"></slot>
    </div>
    <div class="ml-8" v-if="showLabels">
      <h6 class="font-10px text-666 font-Roboto">応募数</h6>
      <!-- chart labels here !!! -->
      <ul class="pa-0 ma-0">
        <li
          v-for="(label, index) in labels"
          :key="index"
          class="d-flex items-center justify-space-between my-1"
        >
          <span class="d-flex align-center">
            <div
              class="color-thumbanil mr-1 my-1"
              :style="{ background: label.color }"
            ></div>
            <span class="font-12px">{{ label.text }}</span>
          </span>
          <span class="font-18px ml-8">
            {{ label.price }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import Chart from 'chart.js/auto'
export default {
  mounted() {
    this.initPieChart()
  },
  props: {
    showLabels: {
      type: Boolean,
      required: true
    },
    labels: {
      type: Array,
      required: true
    }
  },
  methods: {
    initPieChart() {
      new Chart(this.$refs.chart, {
        type: 'doughnut',
        data: {
          // labels: Array.prototype.map.call(this.labels, val =>
          //   val?.short_text ? val.short_text : val.text
          // ),
          datasets: [
            {
              label: 'data',
              data: Array.prototype.map.call(
                this.labels,
                val => val.percentage
              ),
              // datalabels: {
              //   formatter: function(value, context) {
              //     return (
              //       context.chart.data.labels[context.dataIndex] +
              //       `\n ${value}` +
              //       `%`
              //     )
              //   }
              // },
              backgroundColor: Array.prototype.map.call(
                this.labels,
                val => val.color
              ),
              hoverOffset: 4,
              cutoutPercentage: 40
            }
          ]
        },
        options: {
          cutout: 60
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
.doughnut-main-blk {
  .color-thumbanil {
    width: 13px;
    height: 13px;
    border-radius: 3px;
  }
  .label {
    font-size: 12px;
    margin: 0;
  }
  .sublabel {
    font-size: 10px;
    transform: translateX(10px);
  }
  .chart-parent {
    height: 190px;
    width: 190px;
    border-radius: 50%;
    position: relative;
    background-color: transparent;
    .text-pie-bottom {
      position: absolute;
      bottom: -32px;
      width: 100%;
      text-align: center;
    }
  }
  .chart-text {
    position: absolute;
    z-index: 2;
    width: 100%;
    height: 100%;
    top: 4px;
    border-radius: 50%;
  }
  canvas {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 3;
  }
}
</style>
