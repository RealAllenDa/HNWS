<template>
  <div class='copyright'>
    ©2022 Homenetwork Warning System (HNWS) /
    ©2022 Allen Da /
    ©Data by officials /
    Map by DataV.GeoAtlas /
    HNWS {{ version }} - mighty-nuxt-core {{ coreVersion }}
  </div>
</template>

<script>
import logger from '@/assets/logger'

export default {
  name: 'Copyright',
  data() {
    return {
      coreVersion: logger.coreVersion,
      version: logger.version
    }
  }
}
</script>

<style scoped>
.copyright {
  color: var(--information-background);
  width: 1500px;
  height: 25px;
  position: absolute;
  z-index: 99999999;
  top: 1050px;
  left: 10px;
  font-size: 20px;
  user-select: none;
}
</style>
