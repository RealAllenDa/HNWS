<template>
  <div>
    <div class='title-container'>
      <span class='main-title'>{{ chineseTitle }}</span>
      <span class='secondary-title'>{{ englishTitle }}</span>
      <span class='secondary-title' style='margin-top: 5px'>{{ date }} 更新</span>
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
    },
    noInfoAvail: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      date: "",
      dateFormat: null,
      weatherWarningState: this.$store.getters.getWeatherWarningState
    }
  },
  watch: {
    "$store.state.weatherWarningState" () {
      this.weatherWarningState = this.$store.getters.getWeatherWarningState
      this.parseInfoTime()
    }
  },
  mounted() {
    this.parseInfoTime()
  },
  methods: {
    parseInfoTime() {
      this.dateFormat = Intl.DateTimeFormat(undefined, {
        hour12: false,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
      if (!this.noInfoAvail) {
        // noinspection JSUnresolvedVariable
        this.date = this.dateFormat.format(new Date(this.weatherWarningState.message_time))
        // noinspection JSUnresolvedVariable
        this.$store.commit("setGetInfoTime",
          this.dateFormat.formatToParts(new Date(this.weatherWarningState.message_time)))
      } else {
        this.date = "XXXX-XX-XX XX:XX:XX"
      }
    }
  }
}
</script>

<style>
.title-container {
  margin-top: 25px;
  width: 770px;
  height: 185px;
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
</style>
