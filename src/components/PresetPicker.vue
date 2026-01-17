<script>
import { defineComponent } from "vue";
import { mapState, mapActions } from "pinia";

import usePresetStore from "@/stores/preset.js";

function settingsMatch(settings, preset) {
  for (const settingName of Object.keys(settings)) {
    if (settingName == "player_name") {
      continue;
    }
    if (preset[settingName] != settings[settingName]) {
      return false;
    }
  }
  return true;
}

export default defineComponent({
  data() {
    return {
      selected: "custom",
    };
  },
  emits: [
    "selected",
    "save",
  ],
  props: {
    generator: null,
  },
  computed: {
    ...mapState(usePresetStore, {
      allGlobalPresets: "globalPresets",
      allLocalPresets: "localPresets",
    }),
    globalPresets() {
      return this.allGlobalPresets[this.generator];
    },
    localPresets() {
      return this.allLocalPresets[this.generator];
    },
  },
  methods: {
    ...mapActions(usePresetStore, ["deleteLocalPreset", "saveLocalPreset"]),
    change() {
      if (this.selected && this.selected != "custom") {
        if (this.selected.startsWith("local_")) {
          this.$emit("selected", this.localPresets[this.selected.substring(6)]);
        } else {
          this.$emit("selected", this.globalPresets[this.selected]);
        }
      }
    },
    settingChanged(newSettings) {
      for (const presetName of Object.keys(this.globalPresets)) {
        const preset = this.globalPresets[presetName];
        if (settingsMatch(newSettings, preset)) {
          this.selected = presetName;
          return;
        }
      }
      if (this.localPresets) {
        for (const [idx, preset] of this.localPresets.entries()) {
          if (settingsMatch(newSettings, preset)) {
            this.selected = `local_${idx}`;
            return;
          }
        }
      }
      this.selected = "custom";
    },
    saveClicked() {
      this.$emit("save", this.localPresets.map(s => s.display));
    },
    async deleteClicked() {
      const idx = this.selected.substring(6);
      this.selected = "custom";
      await this.deleteLocalPreset(this.generator, idx);
    },
    async savePreset(idx, preset) {
      idx = await this.saveLocalPreset(this.generator, idx, preset);
      this.selected = `local_${idx}`;
    },
  },
});
</script>

<template>
  <div class="input-group">
    <label class="input-group-text" for="presetSelector">
      Preset:
    </label>
    <select v-model="selected" class="form-select" id="presetSelector" @change="change">
      <option disabled="true" value="custom">Custom</option>
      <optgroup label="Global Presets">
        <template v-for="name of Object.keys(globalPresets)">
          <option :value="name">
            {{ globalPresets[name].display }}
          </option>
        </template>
      </optgroup>
      <optgroup v-if="localPresets && localPresets.length" label="Local Presets">
        <template v-for="(preset, idx) of localPresets">
          <option :value="`local_${idx}`">
            {{ preset.display }}
          </option>
        </template>
      </optgroup>
    </select>
    <button class="btn btn-outline-secondary" type="button" @click="saveClicked"
        :disabled="selected != 'custom'">
      Save Preset
    </button>
    <button class="btn btn-outline-danger" type="button" @click="deleteClicked"
        :disabled="!selected.startsWith('local_')">
      <i class="bi bi-trash"></i>
    </button>
  </div>
</template>
