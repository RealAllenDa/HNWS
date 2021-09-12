<template>
  <div class='information-container'>
    <Information></Information>
  </div>
</template>

<script>
import Information from '@/components/wind/Information'

export default {
  name: 'InformationList',
  components: {
    Information
  }
}
</script>

<style scoped>
.information-container {
  width: 420px;
  height: 1080px;
  display: flex;
  flex-direction: column;
}
</style>
