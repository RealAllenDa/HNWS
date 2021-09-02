<template>
  <div class='information-container'>
    <Information :parse-type='parseType'></Information>
    <Thumbnail></Thumbnail>
  </div>
</template>

<script>
export default {
  name: 'InformationList',
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
  height: 1076px;
  display: flex;
  flex-direction: column;
}
</style>
