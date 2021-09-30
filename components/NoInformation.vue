<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div class='no-information' v-html='text'></div>
</template>

<script>
export default {
  name: 'NoInformation',
  props: {
    text: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.no-information {
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
</style>
