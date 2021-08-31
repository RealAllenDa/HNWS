<template>
  <div class='main-container'>
    <InformationIndex
      class='main-container main-overlay'
      :chinese-title='chineseTitle'
      :english-title='englishTitle'
    ></InformationIndex>
    <div style='display: flex;'>
      <Map></Map>
      <InformationList></InformationList>
    </div>
  </div>
</template>

<script>
import logger from 'assets/logger'

export default {
  name: 'Index',
  data () {
    return {
      chineseTitle: "指定河川洪水预报",
      englishTitle: "Flood Forecast For Designated Rivers"
    }
  },
  mounted() {
    logger.initialize()
  }
}
</script>

<style>
@import "assets/colors.css";
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
