<template>
  <div>
    <div class='title-container'>
      <span class='main-title'>{{ chineseTitle }}</span>
      <span class='secondary-title'>{{ englishTitle }}</span>
    </div>
    <div class='time-container'>
      20xx年x月x日 xx:xx
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

<style>
.title-container {
  margin-top: 25px;
  width: 770px;
  height: 135px;
  padding-top: 5px;
  padding-left: 25px;
  background: var(--information-background);
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

.time-container {
  font-size: 30px;
  margin-left: 25px;
  margin-top: 5px;
  user-select: none;
}
</style>
