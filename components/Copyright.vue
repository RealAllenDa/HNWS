<template>
  <div v-if="customText === undefined" class='copyright'>
    &copy; {{ new Date().getFullYear() }} Homenetwork Warning System (HNWS) /
    Map by DataV.GeoAtlas /
    Does not necessarily reflect the views of the associated parties.
  </div>
  <!-- eslint-disable-next-line -->
  <div v-else class="copyright" v-html="customText"></div>
</template>

<script>
import logger from '@/assets/logger'

export default {
  name: 'Copyright',
  props: {
    customText: {
      required: false,
      type: String,
      default: undefined
    }
  },
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
