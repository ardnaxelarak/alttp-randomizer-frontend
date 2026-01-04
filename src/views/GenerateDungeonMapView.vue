<script>
import { defineComponent } from "vue";

import axios from "axios";
import { Modal } from "bootstrap";

import SettingsPage from "@/components/SettingsPage.vue";

export default defineComponent({
  components: {
    SettingsPage,
  },
  data() {
    return {
      set: {},
    };
  },
  mounted() {
    document.title = "ALttPRandomizer"
  },
  methods: {
    async generate(race) {
      const settings = {
        randomizer: "dungeon_map",
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
    <div id="settings" class="accordion accordion-flush">
      <SettingsPage v-model="set" generator="dungeon_map" prefix="dungeon-maps-" />
    </div>
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

