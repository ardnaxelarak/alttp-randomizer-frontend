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
    };
  },
  emits: [
    'selected'
  ],
  props: {
    generator: null,
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
        this.$emit("selected", this.presets[this.selected]);
      }
    },
    settingChanged(newSettings) {
      for (const presetName of Object.keys(this.presets)) {
        const preset = this.presets[presetName];
        var matches = true;
        for (const settingName of Object.keys(newSettings)) {
          if (preset[settingName] != newSettings[settingName]) {
            matches = false;
            break;
          }
        }
        if (matches) {
          this.selected = presetName;
          return;
        }
      }
      this.selected = "custom";
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
      <option value="custom" selected>Custom</option>
      <template v-for="name of Object.keys(presets)">
        <option :value="name">
          {{ presets[name].display }}
        </option>
      </template>
    </select>
  </div>
</template>
