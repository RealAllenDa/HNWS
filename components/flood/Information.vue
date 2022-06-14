<template>
  <div class='information'>
    <div v-if='parseType==="floodRivers"'>
      <div v-for='(i, j) in WARNING_LEVEL_FLOOD' :key='j'>
        <div v-if='riverState[j].length !== 0'>
          <div :class='i.id' class='state'>{{ i.name }}</div>
          <div class='state-text-container'>
            <div v-for='k in riverState[j]' :key='k' class='state-text'>
              <span v-if='k==="more"' class='more'>
                （更多...）
              </span>
              <span v-else>{{ k }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if='parseType==="floodStations"'>
      <div v-for='(i, j) in WARNING_LEVEL_STATION' :key='j'>
        <div v-if='stationState[j].length !== 0'>
          <div :class='i.id' class='state'>{{ i.name }}</div>
          <div class='state-text-container'>
            <div v-for='k in stationState[j]' :key='k' class='state-text'
                 @click='() => showStationDetail(k)'>
              <span v-if='k==="more"' class='more'>
                （更多...）
              </span>
              <span v-else-if='k===previousStation' class='more'>{{ k }}</span>
              <span v-else>{{ k }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<!--suppress JSUnresolvedVariable -->
<script>
import axios from 'axios'
import logger from '../../assets/logger'

export default {
  name: 'Information',
  props: {
    parseType: {
      type: String,
      required: true
    },
    displayNormal: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      floodState: this.$store.getters['flood/getFloodState'],
      displayAllRivers: this.$store.getters.getDisplayType,
      previousStation: '',
      riverState: {
        0: [],
        1: [],
        2: [],
        3: [],
        4: []
      },
      stationState: {
        0: [],
        1: [],
        2: [],
        3: [],
        4: []
      },
      WARNING_LEVEL_FLOOD: {
        4: {
          'id': 'occur',
          'name': '发生泛滥'
        },
        3: {
          'id': 'danger',
          'name': '泛滥危险'
        },
        2: {
          'id': 'warning',
          'name': '泛滥警戒'
        },
        1: {
          'id': 'caution',
          'name': '泛滥注意'
        }
      },
      WARNING_LEVEL_STATION: {
        4: {
          'id': 'occur',
          'name': '到达发生泛滥水位'
        },
        3: {
          'id': 'danger',
          'name': '到达泛滥危险水位'
        },
        2: {
          'id': 'warning',
          'name': '到达泛滥警戒水位'
        },
        1: {
          'id': 'caution',
          'name': '到达泛滥注意水位'
        }
      }
    }
  },
  watch: {
    '$store.state.flood.floodState'() {
      this.floodState = this.$store.getters['flood/getFloodState']
      this.initializeInformation()
    },
    '$store.state.displayAllRivers'() {
      this.displayAllRivers = this.$store.getters.getDisplayType
      this.parseFloodRivers()
    },
    'displayNormal'() {
      if (this.displayNormal) {
        this.WARNING_LEVEL_STATION[0] = {
          'id': 'normal',
          'name': '平常水位'
        }
        this.WARNING_LEVEL_FLOOD[0] = {
          'id': 'normal',
          'name': '正常'
        }
      } else {
        delete this.WARNING_LEVEL_FLOOD[0]
        delete this.WARNING_LEVEL_STATION[0]
      }
      this.initializeInformation()
    }
  },
  mounted() {
    this.initializeInformation()
  },
  methods: {
    initializeInformation() {
      if (this.parseType === 'floodRivers') {
        this.parseFloodRivers()
      } else if (this.parseType === 'floodStations') {
        this.parseFloodStations()
      }
    },
    parseFloodRivers() {
      this.riverState = {
        0: [],
        1: [],
        2: [],
        3: [],
        4: []
      }
      for (const i in this.floodState.flood) {
        let maximumLevelPerRiver = 0
        if (!this.floodState.flood[i].important &&
          this.displayAllRivers) {
          continue
        }
        for (const j in this.floodState.flood[i]) {
          if (j === 'important') {
            continue
          }
          const stationCurrentState = this.floodState.flood[i][j]
          if (stationCurrentState === 0) {
            continue
          }
          if (stationCurrentState > maximumLevelPerRiver) {
            maximumLevelPerRiver = stationCurrentState
          }
        }
        this.riverState[maximumLevelPerRiver].push(i)
        /* if (this.riverState[maximumLevelPerRiver].length > 8) {
          this.riverState[maximumLevelPerRiver][8] = 'more'
        } else if (!(this.riverState[maximumLevelPerRiver].length > 9)) {
          this.riverState[maximumLevelPerRiver].push(i)
        } */
      }
      for (const i in this.riverState) {
        this.riverState[i].sort((a, b) => a.length - b.length)
      }
    },
    parseFloodStations() {
      this.stationState = {
        0: [],
        1: [],
        2: [],
        3: [],
        4: []
      }
      for (const i in this.floodState.station) {
        const stationCurrentState = this.parseWarningState(
          this.floodState.station[i]
        )
        this.stationState[stationCurrentState].push(i)
        /* if (this.stationState[stationCurrentState].length > 8) {
          this.stationState[stationCurrentState][8] = "more"
        } else if (!(this.stationState[stationCurrentState].length > 9)) {
        } */
      }
      for (const i in this.stationState) {
        this.stationState[i].sort((a, b) => a.length - b.length)
      }
    },
    parseWarningState(station) {
      const currentLevel = station.current_level
      if (station.levee_crown !== null) {
        if (currentLevel >= parseFloat(station.levee_crown)) {
          return 4
        }
      }
      if (station.danger_level !== null) {
        if (currentLevel >= parseFloat(station.danger_level)) {
          return 3
        }
      }
      if (station.historical_highest !== null) {
        if (currentLevel >= parseFloat(station.historical_highest)) {
          return 3
        }
      }
      if (station.warning_level !== null) {
        if (currentLevel >= parseFloat(station.warning_level)) {
          return 2
        }
        if (currentLevel >= parseFloat(station.warning_level) - 0.25) {
          return 1
        }
      }
      return 0
    },
    updateStationDetail() {
      if (this.$store.getters['flood/getMapShown']) {
        this.showStationDetail(this.previousStation, true)
      }
    },
    showStationDetail(station, hasDateChanged = false) {
      if (this.previousStation === station && !hasDateChanged) {
        this.$store.commit('flood/setMapShown', false)
        this.previousStation = ''
        return
      } else {
        this.previousStation = station
      }
      const startDate = this.$store.getters['flood/getChartStartDate']
      const endDate = this.$store.getters['flood/getChartEndDate']
      axios.get(
        `${logger.apiUrl}/warning/previous_flood_state?` +
        `start_time=${startDate}&end_time=${endDate}&is_station=true`
      ).catch((error) => {
        console.error(`Failed to fetch previous flood state`, error)
      }).then((content) => {
        const stationState = {
          'station': {},
          'detail': {}
        }
        for (const i in content.data) {
          if (content.data[i][station] !== undefined) {
            stationState.detail[i] = content.data[i][station]
          }
        }
        stationState.station = content.data[Object.keys(content.data)[0]][station]
        this.$store.commit('flood/setDetailedStationState', stationState)
        this.$store.commit('flood/setMapShown', true)
      })
    }
  }
}
</script>

<!--suppress CssUnusedSymbol -->
<style scoped>
.caution {
  color: black;
  background: var(--flood-caution-color);
}

.normal {
  background: var(--flood-normal-color);
}

.warning {
  background: var(--flood-warning-color);
}

.danger {
  background: var(--flood-danger-color);
}

.occur {
  border: 3px solid yellow;
  color: yellow;
  background: var(--flood-occur-color);
}
</style>
