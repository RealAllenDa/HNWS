<template>
  <div>
    <div id='main-container' class='main-container'>
      <InformationIndex
        :chinese-title='chineseTitle'
        :english-title='englishTitle'
        class='main-container main-overlay'></InformationIndex>
      <div class='information-index'>
        <Information></Information>
      </div>
    </div>
    <div class='screenshot-container'>
      <b-button variant='primary' @click='screenShot'>下载图片</b-button>
    </div>
  </div>
</template>

<script>
import * as htmlToImage from 'html-to-image'
import InformationIndex from '../components/generic/InformationIndex'
import Information from '../components/generic/Information'
import SVGToPNG from '../assets/utilities'

export default {
  name: 'Generic',
  components: {
    InformationIndex,
    Information
  },
  head() {
    return {
      title: this.chineseTitle + ' - HNWS'
    }
  },
  data() {
    return {
      chineseTitle: '警报、预报一览',
      englishTitle: 'Warnings Overview'
    }
  },
  methods: {
    screenShot() {
      htmlToImage.toSvg(document.getElementById('main-container'))
        .then(data => {
          // Filename like HNWS_Flood_Stations_YYYY_MM_DD_HH_MM_SS.png
          const infoTime = new Date()
          const filename = `HNWS_Warning_Generic_` +
            `${infoTime.getFullYear()}_${infoTime.getMonth()}_${infoTime.getDay()}_` +
            `${infoTime.getHours()}_${infoTime.getMinutes()}_${infoTime.getSeconds()}.png`
          SVGToPNG.download(data, filename)
        })
    }
  }
}
</script>

<style>
@import "../assets/colors.css";
</style>
<style scoped>
#main-container {
  background: var(--background-color) !important;
}

.main-container {
  width: 1920px;
  height: 1080px;
  z-index: 99999999;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.information-index {
  width: 100%;
  height: 100%;
  margin-top: 180px;
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

.main-overlay {
  height: auto;
  pointer-events: none;
  border: none;
}
</style>
