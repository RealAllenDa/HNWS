<template>
  <div class='information'>
    <ShowDetail :hidden='!isDetailShown' :text='detailText'
                :title='detailTitle'></ShowDetail>
    <div>
      <div v-for='(content, index) in areaState' :key='index'>
        <div class='district state'>{{ index }}</div>
        <div class='weather-alarm-list'>
          <div v-for='(i, index2) in sortWarningState(content)' :key='index2'
               class='weather-alarms' @click='() => warningClick(i)'>
            <div :class='i.class' class='circle'></div>
            <div v-if='selectedWarning === i'
                 class='more'
                 style='margin-left: 10px;'>{{ i.type }}
            </div>
            <div v-else style='margin-left: 10px;'>{{ i.type }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<!--suppress JSUnresolvedVariable -->
<script>
import ShowDetail from './ShowDetail'

export default {
  name: 'Information',
  components: { ShowDetail },
  data() {
    return {
      weatherWarningState: this.$store.getters['weather/getWeatherWarningState'],
      areaState: {},
      detailText: '',
      detailTitle: '',
      selectedWarning: null,
      isDetailShown: false,
      correspondingWarningLevel: {
        1: '蓝色',
        2: '黄色',
        3: '橙色',
        4: '红色'
      }
    }
  },
  watch: {
    '$store.state.weather.weatherWarningState'() {
      this.weatherWarningState = this.$store.getters['weather/getWeatherWarningState']
      this.initializeInformation()
    }
  },
  mounted() {
    this.initializeInformation()
  },
  methods: {
    initializeInformation() {
      this.areaState = {}
      for (const i in this.weatherWarningState.districts) {
        this.weatherWarningState.districts[i].forEach((content) => {
          if (this.areaState[content.name] === undefined) {
            this.areaState[content.name] = []
          }
          this.areaState[content.name].push({
            'name': content.name,
            'type': content.type,
            'class': `level-${content.level}`,
            'level': content.level,
            'detail': content.detail
          })
        })
      }
    },
    sortWarningState(arr) {
      return arr.slice().sort((a, b) => {
        return b.level - a.level
      })
    },
    warningClick(content) {
      if (this.isDetailShown) {
        if (this.detailText === content.detail) {
          this.selectedWarning = null
          this.isDetailShown = false
        } else {
          this.selectedWarning = content
          this.detailTitle = content.name + ' ' +
            content.type + this.correspondingWarningLevel[content.level] + '预警'
          this.detailText = content.detail
        }
      } else {
        this.selectedWarning = content
        this.isDetailShown = true
        this.detailTitle = content.name + ' ' +
          content.type + this.correspondingWarningLevel[content.level] + '预警'
        this.detailText = content.detail
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

.district {
  color: white;
  background: grey;
}

.weather-alarm-list {
  display: flex;
  margin-top: 5px;
}

.weather-alarms {
  width: 33%;
  display: flex;
  font-size: 18px;
  align-items: center;
  line-height: initial;
}

.circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.level-1 {
  background: var(--flood-normal-color);
}

.level-2 {
  background: var(--flood-caution-color);
}

.level-3 {
  background: orange;
}

.level-4 {
  background: red;
}

.state {
  height: 40px;
  padding: 0 5px 5px 10px;
  line-height: 41px;
}
</style>
