<template>
  <div
    v-if='showMap'
    ref='chart'
    class='flood-chart'></div>
  <div
    v-else
    ref='chart'
    class='flood-chart'
    style='display:none;'></div>
</template>

<script>
export default {
  name: 'FloodChart',
  data() {
    return {
      chart: undefined,
      showMap: this.$store.getters['flood/getMapShown']
    }
  },
  watch: {
    '$store.state.flood.mapShown'() {
      this.showMap = this.$store.getters['flood/getMapShown']
      this.chartsChange(this.$store.getters['flood/getDetailedStationState'])
    },
    '$store.state.flood.detailedStationState'() {
      this.chartsChange(this.$store.getters['flood/getDetailedStationState'])
    }
  },
  mounted() {
    this.echartsInit()
  },
  methods: {
    echartsInit() {
      this.chart = this.$echarts.init(
        this.$refs.chart,
        'dark'
      )
      window.chart = this.chart
    },
    parsePieces(station) {
      const pieces = []
      const markLines = []
      let maxLevel = 0
      let appendNormalLevel = true
      if (station.warning_level !== null) {
        maxLevel = Math.max(maxLevel, station.warning_level)
        appendNormalLevel = false
        pieces.push(
          {
            gt: 0,
            lte: (parseFloat(station.warning_level) - 0.25),
            color: '#1e90ff',
            label: '平常水位'
          },
          {
            gt: (parseFloat(station.warning_level) - 0.25),
            lte: parseFloat(station.warning_level),
            color: '#EEE414',
            label: '泛滥注意'
          }
        )
        markLines.push({
          yAxis: parseFloat(station.warning_level) - 0.25,
          lineStyle: {
            color: '#EEE414',
            type: 'solid',
            width: 2
          }
        })
      }
      if (station.warning_level !== null) {
        markLines.push({
          yAxis: parseFloat(station.warning_level),
          lineStyle: {
            color: '#FF3E1A',
            type: 'solid',
            width: 2
          }
        })
        if (station.danger_level !== null) {
          maxLevel = Math.max(maxLevel, station.danger_level)
          pieces.push(
            {
              gt: parseFloat(station.warning_level),
              lte: parseFloat(station.danger_level),
              color: '#FF3E1A',
              label: '泛滥警戒'
            }
          )
        } else if (station.historical_highest !== null) {
          maxLevel = Math.max(maxLevel, station.historical_highest)
          pieces.push(
            {
              gt: parseFloat(station.warning_level),
              lte: parseFloat(station.historical_highest),
              color: '#FF3E1A',
              label: '泛滥警戒'
            }
          )
        } else {
          pieces.push(
            {
              gt: parseFloat(station.warning_level),
              color: '#FF3E1A',
              label: '泛滥警戒'
            }
          )
        }
      }
      if (station.danger_level !== null) {
        markLines.push({
          yAxis: parseFloat(station.danger_level),
          lineStyle: {
            color: '#B31AB1',
            type: 'solid',
            width: 2
          }
        })
        if (station.levee_crown !== null) {
          maxLevel = Math.max(maxLevel, station.levee_crown)
          markLines.push({
            yAxis: parseFloat(station.levee_crown),
            lineStyle: {
              color: '#FFFFFF',
              type: 'solid',
              width: 2
            }
          })
          pieces.push(
            {
              gt: parseFloat(station.danger_level),
              lte: parseFloat(station.levee_crown),
              color: '#B31AB1',
              label: '泛滥危险'
            },
            {
              gt: parseFloat(station.levee_crown),
              color: '#FFFFFF',
              label: '发生泛滥'
            }
          )
        } else {
          pieces.push(
            {
              gt: parseFloat(station.danger_level),
              color: '#B31AB1',
              label: '泛滥危险'
            }
          )
        }
      } else if (station.historical_highest !== null) {
        maxLevel = Math.max(maxLevel, station.historical_highest)
        markLines.push({
          yAxis: parseFloat(station.historical_highest),
          lineStyle: {
            color: '#B31AB1',
            type: 'solid',
            width: 2
          }
        })
        if (station.levee_crown !== null) {
          markLines.push({
            yAxis: parseFloat(station.levee_crown),
            lineStyle: {
              color: '#FFFFFF',
              type: 'solid',
              width: 2
            }
          })
          pieces.push(
            {
              gt: parseFloat(station.historical_highest),
              lte: parseFloat(station.levee_crown),
              color: '#B31AB1',
              label: '泛滥危险'
            },
            {
              gt: parseFloat(station.levee_crown),
              color: '#FFFFFF',
              label: '发生泛滥'
            }
          )
        } else {
          pieces.push(
            {
              gt: parseFloat(station.historical_highest),
              color: '#B31AB1',
              label: '泛滥危险'
            }
          )
        }
      }
      if (appendNormalLevel) {
        pieces.push(
          {
            gt: 0,
            lte: maxLevel,
            color: '#1e90ff',
            label: '平常水位'
          }
        )
      }
      return {
        pieces,
        markLines
      }
    },
    chartsChange(stationDetail) {
      const content = stationDetail.detail
      const station = stationDetail.station
      const pieces = this.parsePieces(station)
      const startTime = this.$store.getters['flood/getChartStartDate']
      const endTime = this.$store.getters['flood/getChartEndDate']
      // noinspection JSUnresolvedVariable
      this.chart.setOption({
          backgroundColor: '#1D1D1D',
          title: {
            text: `${station.name} 水位一览 (${startTime} 00:00:00 - ${endTime} 23:59:59)`,
            left: '1%',
            top: '0.5%'
          },
          tooltip: {
            trigger: 'axis'
          },
          grid: {
            left: '5%',
            right: '15%',
            bottom: '10%'
          },
          xAxis: {
            data: Object.keys(content)
          },
          yAxis: {
            name: 'm',
            align: 'left',
            nameTextStyle: {
              color: '#aaa',
              nameLocation: 'start'
            }
          },
          toolbox: {
            right: 10,
            feature: {
              dataZoom: {
                yAxisIndex: 'none'
              },
              saveAsImage: {}
            }
          },
          dataZoom: [
            {
              startValue: Object.keys(content)[0]
            },
            {
              type: 'inside'
            }
          ],
          visualMap: [{
            textStyle: {
              fontSize: 15
            },
            top: 50,
            right: 10,
            pieces: pieces.pieces,
            outOfRange: {
              color: '#999'
            }
          }],
          series: {
            name: '水位',
            type: 'line',
            symbolSize: 10,
            data: Object.values(content)
              .map(item => {
                return item.current_level
              }),
            markArea: {
              data: [
                {
                  'type': 'min'
                },
                {
                  'type': 'max'
                }
              ]
            },
            markLine: {
              silent: true,
              lineStyle: {
                color: '#333'
              },
              data: pieces.markLines
            }
          }
        }
      )
    }
  }
}
</script>

<style scoped>
.flood-chart {
  width: 1280px;
  height: 720px;
  position: absolute;
  z-index: 999999999;
  top: 235px;
  left: 170px;
}
</style>
