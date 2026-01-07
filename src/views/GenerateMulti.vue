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
  props: {
    prefix: null,
    generator: null,
  },
  data() {
    return {
      worlds: [{}, {}],
      worldCount: 2,
    };
  },
  async mounted() {
    document.title = "ALttPR Multiworld"

    await new Promise(r => setTimeout(r, 100));

    for (var i = 0; i < this.worldCount; i++) {
      this.worlds[i].player_name = await localforage.getItem(`${this.prefix}world_${i + 1}_setting_player_name`);
    }
  },
  methods: {
    async addWorld() {
      const newname = await localforage.getItem(`${this.prefix}world_${this.worldCount + 1}_setting_player_name`);
      this.worlds.push({player_name: newname});
      this.worldCount++;

      await new Promise(r => setTimeout(r, 100));
      this.worlds[this.worldCount - 1].player_name = newname;
    },
    async removeWorld() {
      this.worldCount--;
      this.worlds.pop();
    },
    async playerNameUpdated(num) {
      await localforage.setItem(`${this.prefix}world_${num + 1}_setting_player_name`, this.worlds[num].player_name);
    },
    async generate(race) {
      const settings = [];
      for (var i = 0; i < this.worldCount; i++) {
        const world = {
          randomizer: this.generator,
          race: race ? "race" : "normal"
        };
        for (const setting of Object.keys(this.worlds[i])) {
          world[setting] = this.worlds[i][setting];
        }
        if (!world.player_name || !world.player_name.length) {
          world.player_name = `P${i + 1}`;
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
    <ul class="nav nav-tabs ps-3 pt-3 pe-3">
      <li v-for="(n, idx) in worldCount" class="nav-item" role="presentation">
        <button class="nav-link" :class="{active: idx == 0}" data-bs-toggle="tab"
            :data-bs-target="`#world_page_${n}`" type="button" role="tab">
          <template v-if="worlds[idx] && worlds[idx].player_name && worlds[idx].player_name.length">
            {{ worlds[idx].player_name }}
          </template>
          <template v-else>
            {{ n }}
          </template>
          <button v-if="n == worldCount && n > 2" @click="removeWorld"
              class="badge btn rounded-pill text-bg-danger">
            <i class="bi bi-trash"></i>
          </button>
        </button>
      </li>
      <button class="nav-link" type="button" role="tab" @click="addWorld">
        <i class="bi bi-plus"></i>
      </button>
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
            <SettingsPage v-model="worlds[idx]" :prefix="`${prefix}world_${n}_`" :generator="generator" />
          </div>
        </div>
      </template>
    </div>
    <div class="card-footer">
      <div class="nav nav-pills nav-fill" role="group">
        <button type="button" class="m-1 nav-item btn btn-outline-danger"
            @click="generate(true);">
          Generate Race Multiworld
        </button>
        <button type="button" class="m-1 nav-item btn btn-outline-primary"
            @click="generate(false);">
          Generate Multiworld
        </button>
      </div>
    </div>
  </div>
</template>
