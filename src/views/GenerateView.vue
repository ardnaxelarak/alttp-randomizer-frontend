<script>
import { defineComponent } from "vue";

import axios from "axios";

import SettingPicker from "@/components/SettingPicker.vue";

export default defineComponent({
  components: {
    SettingPicker,
  },
  data() {
    return {
      set: {},
    };
  },
  mounted() {
    document.title = "ALttPRandomizer";
  },
  methods: {
    async generate(race) {
      const settings = {
        randomizer: "base",
        race: race ? "race" : "normal"
      };
      for (const setting of Object.keys(this.set)) {
        settings[setting] = this.set[setting];
      }
      await axios.post("/generate", settings)
        .then(response => {
          const id = response.data;
          this.$router.push(`/seed/${id}`);
        })
        .catch(error => {
          console.log(error);
        });
    },
  },
});
</script>

<template>
  <div class="card content-div m-3">
    <div class="card-header">
      Generate Seed
    </div>
    <ul class="list-group list-group-flush">
      <li class="list-group-item">
        <SettingPicker color="primary" v-model="set.mode" name="mode" generator="base" />
        <SettingPicker color="primary" v-model="set.weapons" name="weapons" generator="base" />
      </li>
      <li class="list-group-item">
        <SettingPicker color="success" v-model="set.goal" name="goal" generator="base" />
        <SettingPicker color="success" v-if="['ganon', 'fast_ganon'].includes(this.set.goal)" 
            v-model="set.crystals_ganon" name="crystals_ganon" generator="base" />
        <SettingPicker color="success" v-model="set.crystals_gt" name="crystals_gt" generator="base" />
      </li>
      <li class="list-group-item">
        <SettingPicker color="warning" v-model="set.entrance_shuffle" name="entrance_shuffle" generator="base" />
        <SettingPicker color="warning" v-if="this.set.entrance_shuffle != 'vanilla'"
            v-model="set.skull_woods" name="skull_woods" generator="base" />
        <SettingPicker color="warning" v-if="this.set.entrance_shuffle != 'vanilla'"
            v-model="set.linked_drops" name="linked_drops" generator="base" />
      </li>
      <li class="list-group-item">
        <SettingPicker color="danger" v-model="set.door_shuffle" name="door_shuffle" generator="base" />
        <SettingPicker color="danger" v-if="this.set.door_shuffle != 'vanilla'"
            v-model="set.door_lobbies" name="door_lobbies" generator="base" />
        <SettingPicker color="danger" v-if="this.set.door_shuffle != 'vanilla'"
            v-model="set.door_type_mode" name="door_type_mode" generator="base" />
        <SettingPicker color="danger" v-if="this.set.door_shuffle != 'vanilla'"
            v-model="set.trap_door_mode" name="trap_door_mode" generator="base" />
      </li>
      <li class="list-group-item">
        <SettingPicker color="success" v-model="set.boss_shuffle" name="boss_shuffle" generator="base" />
        <SettingPicker color="success" v-model="set.enemy_shuffle" name="enemy_shuffle" generator="base" />
      </li>
      <li class="list-group-item">
        <SettingPicker color="warning" v-model="set.small_keys" name="small_keys" generator="base" />
        <SettingPicker color="warning" v-model="set.big_keys" name="big_keys" generator="base" />
        <SettingPicker color="warning" v-model="set.maps" name="maps" generator="base" />
        <SettingPicker color="warning" v-model="set.compasses" name="compasses" generator="base" />
      </li>
      <li class="list-group-item">
        <SettingPicker color="danger" v-model="set.shop_shuffle" name="shop_shuffle" generator="base" />
        <SettingPicker color="danger" v-model="set.drop_shuffle" name="drop_shuffle" generator="base" />
        <SettingPicker color="danger" v-model="set.pottery" name="pottery" generator="base" />
        <SettingPicker color="danger" v-model="set.prize_shuffle" name="prize_shuffle" generator="base" />
      </li>
      <li class="list-group-item">
        <SettingPicker color="primary" v-model="set.boots" name="boots" generator="base" />
        <SettingPicker color="primary" v-model="set.flute" name="flute" generator="base" />
        <SettingPicker color="primary" v-model="set.dark_rooms" name="dark_rooms" generator="base" />
      </li>
    </ul>
    <div class="card-footer">
      <div class="nav nav-pills nav-fill" role="group">
        <button type="button" class="m-1 nav-item btn btn-outline-danger"
            @click="generate(true);">
          Generate Race ROM
        </button>
        <button type="button" class="m-1 nav-item btn btn-outline-primary"
            @click="generate(false);">
          Generate ROM
        </button>
      </div>
    </div>
  </div>
</template>
