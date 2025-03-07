<script>
import { defineComponent } from "vue";

import axios from "axios";

import settingsData from "@/data/settings.yaml";
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
  computed: {
    settings() {
      return settingsData.base;
    },
  },
  methods: {
    async generate(race) {
      const settings = { race: race ? "race" : "normal" };
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
        <SettingPicker color="primary" v-model="set.mode" name="mode" :settings="settings.mode" />
        <SettingPicker color="primary" v-model="set.weapons" name="weapons" :settings="settings.weapons" />
      </li>
      <li class="list-group-item">
        <SettingPicker color="success" v-model="set.goal" name="goal" :settings="settings.goal" />
        <SettingPicker color="success" v-if="['ganon', 'fast_ganon'].includes(this.set.goal)" 
            v-model="set.crystals_ganon" name="crystals_ganon" :settings="settings.crystals_ganon" />
        <SettingPicker color="success" v-model="set.crystals_gt" name="crystals_gt" :settings="settings.crystals_gt" />
      </li>
      <li class="list-group-item">
        <SettingPicker color="warning" v-model="set.entrance_shuffle" name="entrance_shuffle" :settings="settings.entrance_shuffle" />
        <SettingPicker color="warning" v-if="this.set.entrance_shuffle != 'vanilla'"
            v-model="set.skull_woods" name="skull_woods" :settings="settings.skull_woods" />
        <SettingPicker color="warning" v-if="this.set.entrance_shuffle != 'vanilla'"
            v-model="set.linked_drops" name="linked_drops" :settings="settings.linked_drops" />
      </li>
      <li class="list-group-item">
        <SettingPicker color="danger" v-model="set.boss_shuffle" name="boss_shuffle" :settings="settings.boss_shuffle" />
        <SettingPicker color="danger" v-model="set.enemy_shuffle" name="enemy_shuffle" :settings="settings.enemy_shuffle" />
      </li>
      <li class="list-group-item">
        <SettingPicker color="primary" v-model="set.small_keys" name="small_keys" :settings="settings.small_keys" />
        <SettingPicker color="primary" v-model="set.big_keys" name="big_keys" :settings="settings.big_keys" />
        <SettingPicker color="primary" v-model="set.maps" name="maps" :settings="settings.maps" />
        <SettingPicker color="primary" v-model="set.compasses" name="compasses" :settings="settings.compasses" />
      </li>
      <li class="list-group-item">
        <SettingPicker color="success" v-model="set.shop_shuffle" name="shop_shuffle" :settings="settings.shop_shuffle" />
        <SettingPicker color="success" v-model="set.drop_shuffle" name="drop_shuffle" :settings="settings.drop_shuffle" />
        <SettingPicker color="success" v-model="set.pottery" name="pottery" :settings="settings.pottery" />
        <SettingPicker color="success" v-model="set.prize_shuffle" name="prize_shuffle" :settings="settings.prize_shuffle" />
      </li>
      <li class="list-group-item">
        <SettingPicker color="warning" v-model="set.boots" name="boots" :settings="settings.boots" />
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
