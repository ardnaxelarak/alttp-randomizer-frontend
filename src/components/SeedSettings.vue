<script>
import { defineComponent } from "vue";

import settingsData from "@/data/settings-display.yaml";
import mustache from "mustache";

export default defineComponent({
  props: {
    settings: {},
  },
  computed: {
    settingsDisplay() {
      const rendered = {};
      for (const setting of Object.keys(settingsData)) {
        rendered[setting] = {};
        for (const option of Object.keys(settingsData[setting])) {
          rendered[setting][option] = mustache.render(settingsData[setting][option], this.settings);
        }
      }
      return rendered;
    },
  },
  methods: {
  }
});
</script>

<template>
  <div v-if="settings.goal">
    Goal: {{ settingsDisplay.goal[settings.goal] }}
  </div>
  <div v-if="settings.crystals_gt">
    Ganon's Tower Entry: {{ settingsDisplay.crystals_gt[settings.crystals_gt] }}
  </div>
  <div v-if="settings.weapons">
    Weapons: {{ settingsDisplay.weapons[settings.weapons] }}
  </div>
  <hr />
  <div v-if="settings.entrance_shuffle && settings.entrance_shuffle != 'vanilla'">
    {{ settingsDisplay.entrance_shuffle[settings.entrance_shuffle] }}
  </div>
  <div v-if="settings.enemy_shuffle && settings.enemy_shuffle != 'vanilla'">
    {{ settingsDisplay.enemy_shuffle[settings.enemy_shuffle] }}
  </div>
  <div v-if="settings.boss_shuffle && settings.boss_shuffle != 'vanilla'">
    {{ settingsDisplay.boss_shuffle[settings.boss_shuffle] }}
  </div>
  <div v-if="settings.small_keys && settings.small_keys != 'dungeon'">
    {{ settingsDisplay.dungeon_items[settings.small_keys] }} Small Keys
  </div>
  <div v-if="settings.big_keys && settings.big_keys != 'dungeon'">
    {{ settingsDisplay.dungeon_items[settings.big_keys] }} Big Keys
  </div>
  <div v-if="settings.maps && settings.maps != 'dungeon'">
    {{ settingsDisplay.dungeon_items[settings.maps] }} Maps
  </div>
  <div v-if="settings.compasses && settings.compasses != 'dungeon'">
    {{ settingsDisplay.dungeon_items[settings.compasses] }} Compasses
  </div>
</template>
