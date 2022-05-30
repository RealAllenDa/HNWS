<template>
  <div class='show-detail'>
    <div class='show-detail-title'>{{ title }}</div>
    <div>{{ text }}</div>
  </div>
</template>

<script>
export default {
  name: 'ShowDetail',
  props: {
    text: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.show-detail {
  position: absolute;
  top: 400px;
  left: 375px;
  background: var(--information-background);
  width: 740px;
  z-index: 9999999999;
  opacity: 0.8;
  font-size: 30px;
  padding: 10px;
  text-align: center;
}
.show-detail-title {
  font-size: 35px;
  font-weight: bold;
}
</style>
