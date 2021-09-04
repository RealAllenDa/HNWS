<template>
  <div class='information-container'>
    <Information :parse-type='parseType'></Information>
    <Thumbnail></Thumbnail>
  </div>
</template>

<script>
import Information from '@/components/flood/Information'
import Thumbnail from '@/components/Thumbnail'

export default {
  name: 'InformationList',
  components: {
    Information,
    Thumbnail
  },
  props: {
    parseType: {
      type: String,
      required: true
    }
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
