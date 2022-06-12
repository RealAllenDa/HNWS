<template>
  <div>
    <div class='title-container'>
      <span class='main-title'>{{ chineseTitle }}</span>
      <span class='secondary-title'>{{ englishTitle }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InformationIndex',
  props: {
    'chineseTitle': {
      type: String,
      required: true
    },
    'englishTitle': {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.title-container {
  margin-top: 25px;
  width: 770px;
  height: 135px;
  padding-top: 5px;
  padding-left: 25px;
  background: var(--information-background);
  opacity: 0.8;
  user-select: none;
}

.main-title {
  font-size: 50px;
  font-weight: bold;
  display: block;
}

.secondary-title {
  font-size: 30px;
  display: block;
}

.information {
  display: flex !important;
  flex-direction: row !important;
  justify-content: space-between !important;
}
</style>
