<template>
  <div class='information'>
    <div>
      <div class='current-alarm-title'>目前生效的预警：</div>
      <div v-for='i in warningStates' :key='i.name'>
        <div class='state' :class='i.class'>{{ i.name }}</div>
      </div>
    </div>
  </div>
</template>

<!--suppress JSUnresolvedVariable -->
<script>
export default {
  name: 'Information',
  data() {
    return {
      floodWarningState: this.$store.getters['flood/getFloodWarningState'],
      warningStates: []
    }
  },
  watch: {
    '$store.state.flood.floodWarningState'() {
      this.floodWarningState = this.$store.getters['flood/getFloodWarningState']
      this.initializeInformation()
    }
  },
  mounted() {
    this.initializeInformation()
  },
  methods: {
    switchClass(level) {
      switch (level) {
        case 1:
          return "blue"
        case 2:
          return "yellow"
        case 3:
          return "orange"
        case 4:
          return "red"
        default:
          return ""
      }
    },
    convertName(level) {
      switch (level) {
        case 1:
          return "蓝色"
        case 2:
          return "黄色"
        case 3:
          return "橙色"
        case 4:
          return "红色"
        default:
          return ""
      }
    },
    parseTextFloodLevel(level) {
      switch (level) {
        case 1:
          return "Ⅳ"
        case 2:
          return "Ⅲ"
        case 3:
          return "Ⅱ"
        case 4:
          return "Ⅰ"
        default:
          return ""
      }
    },
    initializeInformation() {
      this.warningStates = [];
      if (this.floodWarningState.flood !== 0) {
        const level = this.parseTextFloodLevel(this.floodWarningState.flood)
        this.warningStates.push({
          "class": this.switchClass(this.floodWarningState.flood),
          "name": `防汛防台${level}级应急响应行动`
        })
      }
      if (this.floodWarningState.water_level !== 0) {
        this.warningStates.push({
          "class": this.switchClass(this.floodWarningState.water_level),
          "name": `黄浦江高潮位${this.convertName(this.floodWarningState.water_level)}预警`
        })
      }
    }
  }
}
</script>

<!--suppress CssUnusedSymbol -->
<style scoped>
.information {
  height: 1080px;
}

.blue {
  color: black;
  background: var(--rain-little-color);
}

.yellow {
  color: black;
  background: var(--rain-medium-color);
}

.orange {
  color: black;
  background: var(--rain-big-color);
}

.red {
  background: var(--rain-heavy-color);
}

</style>
