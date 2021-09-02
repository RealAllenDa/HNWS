<template>
  <div class='main-container'>
    <InformationIndex
      class='main-container main-overlay'
      :chinese-title='chineseTitle'
      :english-title='englishTitle'
    ></InformationIndex>
    <Copyright></Copyright>
    <FloodLegends></FloodLegends>
    <div style='display: flex;'>
      <Map></Map>
      <InformationList :parse-type='"floodRivers"'></InformationList>
    </div>
  </div>
</template>

<script>
import logger from 'assets/logger'
import axios from 'axios'

export default {
  name: 'FloodRivers',
  data() {
    return {
      chineseTitle: '指定河川洪水预报',
      englishTitle: 'Flood Forecast For Designated Rivers',
      timer: null
    }
  },
  head () {
    return {
      title: this.chineseTitle + " - HNWS"
    }
  },
  mounted() {
    logger.initialize()
    this.timer = setInterval(this.fetchFloodState, 60000)
  },
  destroyed() {
    clearInterval(this.timer)
  },
  methods: {
    async fetchFloodState() {
      const floodState = await axios.get(
        `${logger.apiUrl}/warning/flood_state`
      ).catch((error) => {
        // eslint-disable-next-line no-console
        console.warn('Error:', error)
      })
      try {
        this.$store.commit("setFloodState", floodState.data)
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn("Error:", e)
      }
    }
  }
}
</script>

<style>
@import "../../assets/colors.css";

.main-container {
  width: 1920px;
  height: 1080px;
  border: 1px solid white;
  position: absolute;
  z-index: 99999999;
}

.main-overlay {
  height: auto;
  pointer-events: none;
  border: none;
}
</style>
