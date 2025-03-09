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
    isEnemizer() {
      return (this.settings.enemy_shuffle && this.settings.enemy_shuffle != "vanilla")
          || (this.settings.boss_shuffle && this.settings.boss_shuffle != "vanilla");
    },
    dungeonItemsShuffled() {
      return (this.settings.small_keys && this.settings.small_keys != "dungeons")
          || (this.settings.big_keys && this.settings.big_keys != "dungeons")
          || (this.settings.maps && this.settings.maps != "dungeons")
          || (this.settings.compasses && this.settings.compasses != "dungeons")
          || (this.settings.compasses && this.settings.compasses != "dungeons")
          || (this.settings.prize_shuffle && this.settings.prize_shuffle != "vanilla");
    }
  },
  methods: {
  }
});
</script>

<template>
  <div v-if="settings.randomizer && settingsDisplay.randomizer[settings.randomizer]">
    {{ settingsDisplay.randomizer[settings.randomizer] }}
    <hr class="mt-2 mb-2" />
  </div>
  <div v-if="settings.goal">
    Goal: {{ settingsDisplay.goal[settings.goal] }}
  </div>
  <div v-if="settings.crystals_gt">
    Ganon's Tower Entry: {{ settingsDisplay.crystals_gt[settings.crystals_gt] }}
  </div>
  <div v-if="settings.weapons">
    Weapons: {{ settingsDisplay.weapons[settings.weapons] }}
  </div>
  <div v-if="settings.entrance_shuffle && settings.entrance_shuffle != 'vanilla'">
    <hr class="mt-2 mb-2" />
    <div>
      {{ settingsDisplay.entrance_shuffle[settings.entrance_shuffle] }}
    </div>
  </div>
  <div v-if="settings.door_shuffle && settings.door_shuffle != 'vanilla'">
    <hr class="mt-2 mb-2" />
    <div>
      {{ settingsDisplay.door_shuffle[settings.door_shuffle] }}
    </div>
    <div v-if="settings.door_lobbies && settings.door_lobbies != 'vanilla'">
      {{ settingsDisplay.door_lobbies[settings.door_lobbies] }}
    </div>
  </div>
  <div v-if="isEnemizer">
    <hr class="mt-2 mb-2" />
    <div v-if="settings.enemy_shuffle && settings.enemy_shuffle != 'vanilla'">
      {{ settingsDisplay.enemy_shuffle[settings.enemy_shuffle] }}
    </div>
    <div v-if="settings.boss_shuffle && settings.boss_shuffle != 'vanilla'">
      {{ settingsDisplay.boss_shuffle[settings.boss_shuffle] }}
    </div>
  </div>
  <div v-if="dungeonItemsShuffled">
    <hr class="mt-2 mb-2" />
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
    <div v-if="settings.prize_shuffle && settings.prize_shuffle != 'vanilla'">
      {{ settingsDisplay.prize_shuffle[settings.prize_shuffle] }}
    </div>
  </div>
</template>
