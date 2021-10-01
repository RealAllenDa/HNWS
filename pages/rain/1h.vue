<template>
  <div>
    <div id='main-container' class='main-container'>
      <InformationIndex
        class='main-container main-overlay'
        :chinese-title='chineseTitle'
        :english-title='englishTitle'
      ></InformationIndex>
      <RainLegends :type='displayType'></RainLegends>
      <Copyright></Copyright>
      <div style='display: flex;'>
        <Map :type='displayType'></Map>
        <InformationList
          :parse-type='selectedType'
          :display-type='displayType'
        ></InformationList>
      </div>
    </div>
    <div class='screenshot-container'>
      <b-button variant='primary' @click='screenShot'>下载图片</b-button>
      <b-dropdown text="显示类型" class="dropdown-screenshot"
      variant='primary'>
        <b-dropdown-item v-if='selectedType==="areaLevels"'
          active href="#"
          @click='changeToArea'>区域</b-dropdown-item>
        <b-dropdown-item v-else href="#"
                         @click='changeToArea'>区域</b-dropdown-item>
        <b-dropdown-item v-if='selectedType==="stationLevels"' active href="#"
                         @click='changeToStation'>站点</b-dropdown-item>
        <b-dropdown-item v-else href="#"
                         @click='changeToStation'>站点</b-dropdown-item>
      </b-dropdown>
    </div>
  </div>
</template>

<script>
import logger from 'assets/logger'
import SVGToPNG from 'assets/utilities'
import * as htmlToImage from 'html-to-image'
import axios from 'axios'
import InformationIndex from '@/components/rain/InformationIndex'
import Map from '@/components/rain/Map'
import RainLegends from "@/components/rain/RainLegends"
import InformationList from '@/components/rain/InformationList'

export default {
  name: 'Rain1h',
  components: {
    InformationIndex,
    Map,
    RainLegends,
    InformationList
  },
  data() {
    return {
      selectedType: "areaLevels",
      chineseTitle: this.selectedType !== "areaLevels" ?
                      '1小时区域降水量一览' :
                      '1小时站点降水量一览',
      englishTitle: this.selectedType !== "areaLevels" ?
                    '1H Precipitation Nowcasts for Districts' :
                    '1H Precipitation Nowcasts for Stations',
      timer: null,
      displayType: "rainLevel"
    }
  },
  head() {
    return {
      title: this.chineseTitle + ' - HNWS'
    }
  },
  mounted() {
    logger.initialize()
    this.timer = setInterval(this.fetchRainState, 60000)
  },
  destroyed() {
    clearInterval(this.timer)
  },
  methods: {
    async fetchRainState() {
      const rainState = await axios.get(
        `${logger.apiUrl}/warning/rain_state_1h`
      ).catch((error) => {
        logger.error(`Failed to fetch rain state: ${error}`)
      })
      try {
        this.$store.commit('rain/setRainState', rainState.data)
      } catch (error) {
        logger.error(`Failed to set rain state: ${error}`)
      }
    },
    changeToArea() {
      this.selectedType = "areaLevels"
      this.chineseTitle = this.selectedType === "areaLevels" ?
        '1小时区域降水量一览' :
        '1小时站点降水量一览'
       this.englishTitle = this.selectedType === "areaLevels" ?
        '1H Precipitation Nowcasts for Districts' :
        '1H Precipitation Nowcasts for Stations'
    },
    changeToStation() {
      this.selectedType = "stationLevels"
      this.chineseTitle = this.selectedType === "areaLevels" ?
        '1小时区域降水量一览' :
        '1小时站点降水量一览'
      this.englishTitle = this.selectedType === "areaLevels" ?
        '1H Precipitation Nowcasts for Districts' :
        '1H Precipitation Nowcasts for Stations'
    },
    screenShot() {
      htmlToImage.toSvg(document.getElementById("main-container"))
        .then(data => {
          // Filename like HNWS_Flood_Stations_YYYY_MM_DD_HH_MM_SS.png
          const infoTime = this.$store.getters.getGetInfoTime
          const filename = `HNWS_1H_Rain_${this.selectedType}_` +
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
