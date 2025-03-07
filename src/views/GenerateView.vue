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
      mode: null,
      goal: null,
      weapons: null,
      crystals_ganon: null,
      crystals_gt: null,
      entrance_shuffle: null,
      skull_woods: null,
      linked_drops: null,
    };
  },
  computed: {
    settings() {
      return settingsData.base;
    },
  },
  methods: {
    async generate(race) {
      const settings = { race: race ? "race" : "normal" };
      for (const setting of Object.keys(this.$data)) {
        settings[setting] = this.$data[setting];
      }
      await axios.post("/generate", {settings: settings})
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
        <SettingPicker v-model="mode" name="mode" :settings="settings.mode" />
        <SettingPicker v-model="weapons" name="weapons" :settings="settings.weapons" />
      </li>
      <li class="list-group-item">
        <SettingPicker v-model="goal" name="goal" :settings="settings.goal" />
        <SettingPicker v-if="['ganon', 'fast_ganon'].includes(this.goal)" 
            v-model="crystals_ganon" name="crystals_ganon" :settings="settings.crystals_ganon" />
        <SettingPicker v-model="crystals_gt" name="crystals_gt" :settings="settings.crystals_gt" />
      </li>
      <li class="list-group-item">
        <SettingPicker v-model="entrance_shuffle" name="entrance_shuffle" :settings="settings.entrance_shuffle" />
        <SettingPicker v-if="this.entrance_shuffle != 'vanilla'"
            v-model="skull_woods" name="skull_woods" :settings="settings.skull_woods" />
        <SettingPicker v-if="this.entrance_shuffle != 'vanilla'"
            v-model="linked_drops" name="linked_drops" :settings="settings.linked_drops" />
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
