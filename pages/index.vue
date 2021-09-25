<template>
  <div></div>
</template>

<script>
import logger from 'assets/logger'
export default {
  name: 'Index',
  head () {
    return {
      title: "HNWS"
    }
  },
  mounted() {
    if (!(logger.mode === "development")) {
      window.location.href = "https://www.daziannetwork.com"
    }
  }
}
</script>

<style scoped>

</style>
