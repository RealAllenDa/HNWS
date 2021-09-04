<template>
  <div class='information'>
    <div v-if='parseType==="floodRivers"'>
      <div v-for='(i, j) in WARNING_LEVEL_FLOOD' :key='j'>
        <div v-if='riverState[j].length !== 0'>
          <div class='flood-state' :class='i.id'>{{ i.name }}</div>
          <div class='state-text-container'>
            <div v-for='k in riverState[j]' :key='k' class='state-text'>{{ k }}</div>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if='parseType==="floodStations"'>
      <div v-for='(i, j) in WARNING_LEVEL_STATION' :key='j'>
        <div v-if='stationState[j].length !== 0'>
          <div class='flood-state' :class='i.id'>{{ i.name }}</div>
          <div class='state-text-container'>
            <div v-for='k in stationState[j]' :key='k' class='state-text'>{{ k }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<!--suppress JSUnresolvedVariable -->
<script>
export default {
  name: 'Information',
  props: {
    parseType: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      floodState: this.$store.getters.getFloodState,
      displayAllRivers: this.$store.getters.getDisplayType,
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
          "id": "occur",
          "name": "发生泛滥"
        },
        3: {
          "id": "danger",
          "name": "泛滥危险"
        },
        2: {
          "id": "warning",
          "name": "泛滥警戒"
        },
        1: {
          "id": "caution",
          "name": "泛滥注意"
        }
      },
      WARNING_LEVEL_STATION: {
        4: {
          "id": "occur",
          "name": "到达发生泛滥水位"
        },
        3: {
          "id": "danger",
          "name": "到达泛滥危险水位"
        },
        2: {
          "id": "warning",
          "name": "到达泛滥警戒水位"
        },
        1: {
          "id": "caution",
          "name": "到达泛滥注意水位"
        }
      }
    }
  },
  watch: {
    "$store.state.floodState" () {
      this.floodState = this.$store.getters.getFloodState
      this.initializeInformation()
    },
    "$store.state.displayAllRivers" () {
      this.displayAllRivers = this.$store.getters.getDisplayType
      this.parseFloodRivers()
    }
  },
  mounted() {
    this.initializeInformation()
  },
  methods: {
    initializeInformation() {
      if (this.parseType === "floodRivers") {
        this.parseFloodRivers()
      } else if (this.parseType === "floodStations") {
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
        let maximumLevelPerRiver = 0;
        if (!this.floodState.flood[i].important &&
            this.displayAllRivers) {
          continue;
        }
        for (const j in this.floodState.flood[i]) {
          if (j === "important") {continue;}
          const stationCurrentState = this.floodState.flood[i][j];
          if (stationCurrentState === 0) {continue;}
          if (stationCurrentState > maximumLevelPerRiver) {
            maximumLevelPerRiver = stationCurrentState;
          }
        }
        this.riverState[maximumLevelPerRiver].push(i)
      }
      // eslint-disable-next-line no-console
      console.log("River State: ", this.riverState)
      console.log("Raw data: ", this.floodState)
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
          );
          this.stationState[stationCurrentState].push(i);
      }
      // eslint-disable-next-line no-console
      console.log("Station State: ", this.stationState)
      console.log("Raw data: ", this.floodState)
    },
    parseWarningState(station) {
      const currentLevel = station.current_level;
      if (station.levee_crown !== null) {
        if (currentLevel >= station.levee_crown) {
          return 4;
        }
      }
      if (station.danger_level !== null) {
        if (currentLevel >= station.danger_level) {
          return 3;
        }
      }
      if (station.warning_level !== null) {
        if (currentLevel >= station.warning_level) {
          return 2;
        }
        if (currentLevel >= station.warning_level-0.25) {
          return 1;
        }
      }
      return 0;
    }
  }
}
</script>

<!--suppress CssUnusedSymbol -->
<style scoped>
.information {
  width: 420px;
  height: 690px;
  background: var(--information-background);
  padding: 0 20px 20px;
  user-select: none;
}
.flood-state {
  width: 380px;
  height: 50px;
  padding: 3px 5px 5px 10px;
  font-size: 25px;
  font-weight: bold;
  margin-top: 20px;
  line-height: 45px;
}
.state-text-container {
  width: 380px;
  height: auto;
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
  font-size: 23px;
}
.state-text {
  width: 33%;
}
.caution {
  color: black;
  background: var(--flood-caution-color);
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
