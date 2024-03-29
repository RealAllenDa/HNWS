<template>
  <div>
    <div id='main-container' class='main-container'>
      <InformationIndex
        :chinese-title='chineseTitle'
        :english-title='englishTitle'
        class='main-container main-overlay'
      ></InformationIndex>
      <Copyright></Copyright>
      <FloodLegends></FloodLegends>
      <div style='display: flex;'>
        <Map></Map>
        <InformationList
          :display-normal='displayNormal'
          :display-thumbnail='displayThumbnail'
          :parse-type='"floodRivers"'></InformationList>
      </div>
    </div>
    <div class='screenshot-container'>
      <b-button size='lg' variant='primary' @click='screenShot'>下载图片</b-button>
      <b-dropdown class='dropdown-screenshot' size='lg'
                  text='显示类型'
                  variant='primary'>
        <b-dropdown-item
          v-if='!displayAllRivers' href='#'
          @click='changeToAll'>指定河川
        </b-dropdown-item>
        <b-dropdown-item v-else active href='#'
                         @click='changeToAll'>指定河川
        </b-dropdown-item>
        <b-dropdown-item v-if='!displayAllRivers' active href='#'
                         @click='changeToDesignated'>所有河川
        </b-dropdown-item>
        <b-dropdown-item v-else href='#'
                         @click='changeToDesignated'>所有河川
        </b-dropdown-item>
      </b-dropdown>
      <b-form-checkbox
        v-model='displayThumbnail'
        :unchecked-value='false'
        :value='true'
        class='ml-5'
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
        显示平常
      </b-form-checkbox>
    </div>
  </div>
</template>

<script>
import logger from 'assets/logger'
import axios from 'axios'
import * as htmlToImage from 'html-to-image'
import SVGToPNG from 'assets/utilities'
import InformationIndex from '@/components/flood/InformationIndex'
import InformationList from '@/components/flood/InformationList'
import Map from '@/components/flood/Map'
import Copyright from '@/components/Copyright'
import FloodLegends from '@/components/flood/FloodLegends'

export default {
  name: 'FloodRivers',
  components: {
    InformationList,
    InformationIndex,
    Map,
    Copyright,
    FloodLegends
  },
  data() {
    return {
      displayAllRivers: this.$store.getters.getDisplayType,
      chineseTitle: this.$store.getters.getDisplayType ?
        '指定河川洪水预报' :
        '所有河川洪水预报',
      englishTitle: this.$store.getters.getDisplayType ?
        'Flood Forecast For Designated Rivers' :
        'Flood Forecast For All Rivers',
      timer: null,
      displayThumbnail: true,
      displayNormal: false
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
        this.$store.commit('flood/setFloodState', floodState.data)
      } catch (error) {
        logger.error(`Failed to set flood state: ${error}`)
      }
    },
    screenShot() {
      htmlToImage.toSvg(document.getElementById('main-container'))
        .then(data => {
          // Filename like HNWS_Flood_Rivers_YYYY_MM_DD_HH_MM_SS.png
          const infoTime = this.$store.getters.getGetInfoTime
          const filename = `HNWS_Flood_Rivers_${
              this.displayAllRivers ?
                'Designated' :
                'All'
            }_` +
            `${infoTime[0].value}_${infoTime[2].value}_${infoTime[4].value}_` +
            `${infoTime[6].value}_${infoTime[8].value}_${infoTime[10].value}.png`
          SVGToPNG.download(data, filename)
        })
    },
    changeToAll() {
      this.$store.commit('setDisplayAllRivers', true)
      this.displayAllRivers = this.$store.getters.getDisplayType
      this.chineseTitle = this.$store.getters.getDisplayType ?
        '指定河川洪水预报' :
        '所有河川洪水预报'
      this.englishTitle = this.$store.getters.getDisplayType ?
        'Flood Forecast For Designated Rivers' :
        'Flood Forecast For All Rivers'
    },
    changeToDesignated() {
      this.$store.commit('setDisplayAllRivers', false)
      this.displayAllRivers = this.$store.getters.getDisplayType
      this.chineseTitle = this.$store.getters.getDisplayType ?
        '指定河川洪水预报' :
        '所有河川洪水预报'
      this.englishTitle = this.$store.getters.getDisplayType ?
        'Flood Forecast For Designated Rivers' :
        'Flood Forecast For All Rivers'
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
  position: absolute;
  z-index: 99999999;
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
