<template>
  <div>
    <div id='main-container' class='main-container'>
      <InformationIndex
        :chinese-title='chineseTitle'
        :english-title='englishTitle'
        class='main-container main-overlay'
      ></InformationIndex>
      <Copyright></Copyright>
      <FloodStationLegends></FloodStationLegends>
      <FloodChart></FloodChart>
      <div style='display: flex;'>
        <Map></Map>
        <InformationList
          ref='infoList'
          :display-normal='displayNormal'
          :display-thumbnail='displayThumbnail'
          :parse-type='"floodStations"'
        ></InformationList>
      </div>
    </div>
    <div class='screenshot-container'>
      <b-button size='lg' variant='primary' @click='screenShot'>下载图片</b-button>
      <b-form-checkbox
        v-model='displayThumbnail'
        :unchecked-value='false'
        :value='true'
        class='ml-lg-5'
        size='lg'
      >
        显示缩略图
      </b-form-checkbox>
      <b-form-checkbox
        v-model='displayNormal'
        :unchecked-value='false'
        :value='true'
        class='ml-lg-5'
        size='lg'
      >
        显示平常水位站
      </b-form-checkbox>
    </div>
    <div class='screenshot-container date-container'>
      <label class='mr-3 label' for='date-start'>图表开始时间</label>
      <b-input-group style='width: 200px;'>
        <b-form-input
          id='date-start'
          v-model='startDate'
          autocomplete='off'
          placeholder='YYYY-MM-DD'
          type='text'
        ></b-form-input>
        <b-input-group-append>
          <b-form-datepicker
            v-model='startDate'
            button-only
            locale='en-US'
            right
            style='z-index: 999999'
            @context='updateDate'
          ></b-form-datepicker>
        </b-input-group-append>
      </b-input-group>
      <label class='mr-3 ml-5 label' for='date-end'>图表结束时间</label>
      <b-input-group style='width: 200px;'>
        <b-form-input
          id='date-end'
          v-model='endDate'
          autocomplete='off'
          placeholder='YYYY-MM-DD'
          type='text'
        ></b-form-input>
        <b-input-group-append>
          <b-form-datepicker
            v-model='endDate'
            button-only
            locale='en-US'
            right
            style='z-index: 999999'
            @context='updateDate'
          ></b-form-datepicker>
        </b-input-group-append>
      </b-input-group>
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
import FloodChart from '@/components/flood/FloodChart'

export default {
  name: 'FloodStations',
  components: {
    FloodChart,
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
      timer: null,
      displayThumbnail: true,
      displayNormal: false,
      startDate:
        `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`,
      endDate:
        `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`
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
    updateDate() {
      this.$store.commit('flood/setChartStartDate', this.startDate)
      this.$store.commit('flood/setChartEndDate', this.endDate)
      this.$refs.infoList.updateStationStatus()
    },
    async fetchFloodState() {
      const floodState = await axios.get(
        `${logger.apiUrl}/warning/flood_state`
      ).catch((error) => {
        logger.error(`Failed to fetch flood state: ${error}`)
      })
      try {
        this.$store.commit('flood/setFloodState', floodState.data)
      } catch (error) {
        logger.error(`Failed to set flood state: ${error}`)
      }
    },
    screenShot() {
      htmlToImage.toSvg(document.getElementById('main-container'))
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
  z-index: 99999;
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

.date-container {
  top: 1170px;
}

.label {
  font-size: 20px;
  margin-bottom: 0;
}
</style>
