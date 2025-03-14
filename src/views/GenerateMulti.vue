<script>
import { defineComponent } from "vue";

import axios from "axios";
import localforage from "localforage";
import { Modal } from "bootstrap";

import SettingsPage from "@/components/SettingsPage.vue";

export default defineComponent({
  components: {
    SettingsPage,
  },
  data() {
    return {
      worlds: [{}, {}, {}],
      worldCount: 3,
    };
  },
  async mounted() {
    document.title = "ALttPR Multiworld"

    await new Promise(r => setTimeout(r, 100));

    for (var i = 0; i < this.worldCount; i++) {
      this.worlds[i].player_name = await localforage.getItem(`world_${i + 1}_setting_player_name`);
    }
  },
  methods: {
    async playerNameUpdated(num) {
      await localforage.setItem(`world_${num + 1}_setting_player_name`, this.worlds[num].player_name);
    },
    async generate(race) {
      const settings = [];
      for (var i = 0; i < this.worldCount; i++) {
        const world = {
          randomizer: "base",
          race: race ? "race" : "normal"
        };
        for (const setting of Object.keys(this.worlds[i])) {
          world[setting] = this.worlds[i][setting];
        }
        if (!world.player_name) {
          world.player_name = `Player ${i + 1}`;
        }
        settings.push(world);
      }

      await axios.post("/multiworld", settings)
        .then(response => {
          const id = response.data;
          this.$router.push(`/multi/${id}`);
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
      Generate Multiworld
    </div>
    <ul class="nav nav-tabs">
      <li v-for="(n, idx) in worldCount" class="nav-item" role="presentation">
        <button class="nav-link" :class="{active: idx == 0}" data-bs-toggle="tab"
            :data-bs-target="`#world_page_${n}`" type="button" role="tab">
          {{ worlds[idx]?.player_name ?? n }}
        </button>
      </li>
    </ul>
    <div class="tab-content">
      <template v-for="(n, idx) in worldCount">
        <div :id="`world_page_${n}`" class="tab-pane fade"
            :class="{show: idx == 0, active: idx == 0}" role="tabpanel">
          <div class="input-group ms-3 me-3 mt-3" style="width: inherit;">
            <label class="input-group-text" :for="`player_${n}_name`">
              Player {{ n }} Name:
            </label>
            <input type="text" class="form-control" :placeholder="`Player ${n}`"
                id="`player_${n}_name`" v-model="worlds[idx].player_name"
                @change="playerNameUpdated(idx)" />
          </div>
          <div id="settings" class="accordion accordion-flush">
            <SettingsPage v-model="worlds[idx]" :prefix="`world_${n}_`" />
          </div>
        </div>
      </template>
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
