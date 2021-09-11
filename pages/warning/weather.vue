<template>
  <div>
    <div id='main-container' class='main-container'>
      <InformationIndex
        class='main-container main-overlay'
        :chinese-title='chineseTitle'
        :english-title='englishTitle'
      ></InformationIndex>
      <Copyright></Copyright>
      <div style='display: flex;'>
        <Map></Map>
        <InformationList></InformationList>
      </div>
    </div>
    <div class='screenshot-container'>
      <b-button variant='primary' @click='screenShot'>下载图片</b-button>
    </div>
  </div>
</template>

<script>
import logger from 'assets/logger'
import SVGToPNG from 'assets/utilities'
import * as htmlToImage from 'html-to-image'
import axios from 'axios'
import InformationIndex from '@/components/weather_warning/InformationIndex'
import Map from '@/components/weather_warning/Map'
import InformationList from '@/components/weather_warning/InformationList'

export default {
  name: 'WeatherWarning',
  components: {
    InformationIndex,
    Map,
    InformationList
  },
  data() {
    return {
      chineseTitle: "天气预警一览",
      englishTitle: 'Weather Warnings Overview',
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
    this.timer = setInterval(this.fetchWeatherWarningState, 60000)
  },
  destroyed() {
    clearInterval(this.timer)
  },
  methods: {
    async fetchWeatherWarningState() {
      const weatherWarningState = await axios.get(
        `${logger.apiUrl}/warning/weather_warning`
      ).catch((error) => {
        // eslint-disable-next-line no-console
        console.warn('Error:', error)
      })
      try {
        this.$store.commit('setWeatherWarningState', weatherWarningState.data)
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('Error:', e)
      }
    },
    screenShot() {
      htmlToImage.toSvg(document.getElementById("main-container"))
        .then(data => {
          // Filename like HNWS_Flood_Stations_YYYY_MM_DD_HH_MM_SS.png
          const infoTime = this.$store.getters.getGetInfoTime
          const filename = `HNWS_Warning_Weather_` +
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
