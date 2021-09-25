<template>
  <div>
    <div id='main-container' class='main-container'>
      <InformationIndex
        class='main-container main-overlay'
        :chinese-title='chineseTitle'
        :english-title='englishTitle'
      ></InformationIndex>
      <Copyright></Copyright>
      <FloodStationLegends></FloodStationLegends>
      <div style='display: flex;'>
        <Map></Map>
        <InformationList :parse-type='"floodStations"'></InformationList>
      </div>
    </div>
    <div class='screenshot-container'>
      <b-button variant='primary' style='font-size: 20px' @click='screenShot'>下载图片</b-button>
    </div>
  </div>
</template>

<script>
import logger from 'assets/logger'
import axios from 'axios'
import SVGToPNG from 'assets/utilities'
import * as htmlToImage from 'html-to-image'
import InformationIndex from '@/components/flood/InformationIndex'
import Copyright from '@/components/Copyright'
import FloodStationLegends from '@/components/flood/FloodStationLegends'
import Map from '@/components/flood/Map'
import InformationList from '@/components/flood/InformationList'

export default {
  name: 'FloodStations',
  components: {
    InformationIndex,
    Copyright,
    FloodStationLegends,
    Map,
    InformationList
  },
  data() {
    return {
      chineseTitle: '水位观测站一览',
      englishTitle: 'Water Level Observation Stations Overview',
      timer: null
    }
  },
  head() {
    return {
      title: this.chineseTitle + ' - HNWS'
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
        logger.error(`Failed to fetch flood state: ${error}`)
      })
      try {
        this.$store.commit('setFloodState', floodState.data)
      } catch (error) {
        logger.error(`Failed to set flood state: ${error}`)
      }
    },
    screenShot() {
      htmlToImage.toSvg(document.getElementById("main-container"))
      .then(data => {
        // Filename like HNWS_Flood_Stations_YYYY_MM_DD_HH_MM_SS.png
        const infoTime = this.$store.getters.getGetInfoTime
        const filename = `HNWS_Flood_Stations_` +
        `${infoTime[0].value}_${infoTime[2].value}_${infoTime[4].value}_` +
        `${infoTime[6].value}_${infoTime[8].value}_${infoTime[10].value}.png`
        SVGToPNG.download(data, filename)
      })
    }
  }
}
</script>
<style>
@import "../../assets/colors.css";
</style>
<style scoped>
.main-container {
  width: 1920px;
  height: 1080px;
  z-index: 99999999;
  position: absolute;
  top: 0;
  left: 0;
}

.main-overlay {
  height: auto;
  pointer-events: none;
  border: none;
}

.screenshot-container {
  border: 1px solid white;
  width: 1920px;
  height: 50px;
  position: absolute;
  top: 1100px;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
