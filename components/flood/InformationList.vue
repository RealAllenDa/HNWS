<template>
  <div class='information-container'>
    <Information
      v-if='!displayThumbnail'
      ref='information'
      :display-normal='displayNormal'
      :parse-type='parseType'
      class='full-height'
    ></Information>
    <Information
      v-else
      ref='information'
      :display-normal='displayNormal'
      :parse-type='parseType'
    ></Information>
    <Thumbnail v-if='displayThumbnail'></Thumbnail>
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
    },
    displayThumbnail: {
      type: Boolean,
      required: true
    },
    displayNormal: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    updateStationStatus() {
      this.$refs.information.updateStationDetail()
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

.full-height {
  height: 1920px;
}
</style>
