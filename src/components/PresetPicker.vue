<script>
import { defineComponent } from 'vue';

import localforage from "localforage";
import settingsData from "@/data/settings.yaml";
import generatorSettings from "@/data/generator-settings.yaml";
import presets from "@/data/presets.yaml";

export default defineComponent({
  data() {
    return {
      selected: "custom",
      localPresets: [],
    };
  },
  emits: [
    "selected",
    "save",
  ],
  props: {
    generator: null,
  },
  async mounted() {
    this.localPresets = await localforage.getItem("local_presets") ?? [];
  },
  computed: {
    settings() {
      const settings = {};
      for (const name of Object.keys(generatorSettings[this.generator])) {
        var generatorValue = generatorSettings[this.generator][name]
        if (generatorValue == "all") {
          settings[name] = settingsData[name];
        } else if (Array.isArray(generatorValue)) {
          const { values, ...newObj } = settingsData[this.name];
          newObj.values = {};
          for (const value of generatorValue) {
            newObj.values[value] = values[value];
          }
          settings[name] = newObj;
        } else {
          settings[name] = generatorValue;
        }
      }
      return settings;
    },
    presets() {
      const filledPresets = {};
      for (const presetName of Object.keys(presets[this.generator])) {
        const preset = {};
        preset.display = presets[this.generator][presetName].display;
        for (const settingName of Object.keys(this.settings)) {
          preset[settingName] = presets[this.generator][presetName][settingName] ?? this.settings[settingName].default;
        }
        filledPresets[presetName] = preset;
      }
      return filledPresets;
    },
  },
  methods: {
    change() {
      if (this.selected && this.selected != "custom") {
        if (this.selected.startsWith("local_")) {
          this.$emit("selected", this.localPresets[this.selected.substring(6)]);
        } else {
          this.$emit("selected", this.presets[this.selected]);
        }
      }
    },
    settingsMatch(newSettings, preset) {
      for (const settingName of Object.keys(newSettings)) {
        if (preset[settingName] != newSettings[settingName]) {
          return false;
        }
      }
      return true
    },
    settingChanged(newSettings) {
      for (const presetName of Object.keys(this.presets)) {
        const preset = this.presets[presetName];
        if (this.settingsMatch(newSettings, preset)) {
          this.selected = presetName;
          return;
        }
      }
      for (const [idx, preset] of this.localPresets.entries()) {
        if (this.settingsMatch(newSettings, preset)) {
          this.selected = `local_${idx}`;
          return;
        }
      }
      this.selected = "custom";
    },
    saveClicked() {
      this.$emit("save", this.localPresets.map(s => s.display));
    },
    async deleteClicked() {
      const idx = this.selected.substring(6);
      this.localPresets.splice(idx, 1);
      this.selected = "custom";
      await this.updateLocalPresets();
    },
    async savePreset(idx, settings) {
      if (idx == null) {
        idx = this.localPresets.length;
        this.localPresets.push(settings);
      } else {
        this.localPresets[idx] = settings;
      }
      this.selected = `local_${idx}`;
      await this.updateLocalPresets();
    },
    async updateLocalPresets() {
      const copy = JSON.parse(JSON.stringify(this.localPresets));
      await localforage.setItem("local_presets", copy);
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
        <template v-for="name of Object.keys(presets)">
          <option :value="name">
            {{ presets[name].display }}
          </option>
        </template>
      </optgroup>
      <optgroup v-if="localPresets.length" label="Local Presets">
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
