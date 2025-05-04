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
        randomizer: "apr2025",
        crystals_gt: "random",
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
        <SettingPicker color="primary" v-model="set.mode" name="mode" generator="apr2025" />
        <SettingPicker color="primary" v-model="set.weapons" name="weapons" generator="apr2025" />
        <SettingPicker color="primary" v-model="set.hints" name="hints" generator="apr2025" />
      </li>
      <li class="list-group-item">
        <SettingPicker color="success" v-model="set.crystals_ganon" name="crystals_ganon" generator="apr2025" />
      </li>
      <li class="list-group-item">
        <SettingPicker color="warning" v-model="set.entrance_shuffle" name="entrance_shuffle" generator="apr2025" />
      </li>
      <li class="list-group-item">
        <SettingPicker color="danger" v-model="set.small_keys" name="dungeon_item_shuffle" generator="apr2025" />
      </li>
      <li class="list-group-item">
        <SettingPicker color="primary" v-model="set.boots" name="boots" generator="apr2025" />
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
