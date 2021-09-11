<template>
  <div class='information-container'>
    <Information
      :parse-type='parseType'
      :display-type='displayType'
    ></Information>
  </div>
</template>

<script>
import Information from '@/components/rain/Information'

export default {
  name: 'InformationList',
  components: {
    Information
  },
  props: {
    parseType: {
      type: String,
      required: true
    },
    displayType: {
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
