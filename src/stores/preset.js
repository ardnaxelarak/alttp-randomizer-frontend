import { defineStore } from "pinia";

import localforage from "localforage";
import settingsData from "@/data/settings.yaml";
import generatorSettings from "@/data/generator-settings.yaml";
import presets from "@/data/presets.yaml";

function fillPreset(preset, settings) {
  for (const settingName of Object.keys(settings)) {
    if (preset[settingName] == undefined) {
      preset[settingName] = settings[settingName].default;
    }
  }
  return preset;
}

export default defineStore("preset", {
  state() {
    return {
      localPresets: {},
    };
  },
  getters: {
    settings() {
      const settings = {};
      for (const generator of Object.keys(generatorSettings)) {
        settings[generator] = {};

        for (const name of Object.keys(generatorSettings[generator])) {
          var generatorValue = generatorSettings[generator][name];
          if (generatorValue == "all") {
            settings[generator][name] = settingsData[name];
          } else if (Array.isArray(generatorValue)) {
            const { values, ...newObj } = settingsData[name];
            newObj.values = {};
            for (const value of generatorValue) {
              newObj.values[value] = values[value];
            }
            settings[generator][name] = newObj;
          } else {
            settings[generator][name] = generatorValue;
          }
        }
      }
      return settings;
    },
    globalPresets() {
      const filledPresets = {};
      for (const generator of Object.keys(generatorSettings)) {
        filledPresets[generator] = {};
        if (presets[generator]) {
          for (const presetName of Object.keys(presets[generator])) {
            const preset = { ...presets[generator][presetName] };
            fillPreset(preset, this.settings[generator]);
            filledPresets[generator][presetName] = preset;
          }
        }
      }
      return filledPresets;
    },
  },
  actions: {
    async fetchLocalPresets() {
      for (const generator of Object.keys(generatorSettings)) {
        if (this.localPresets[generator]) {
          continue;
        }

        await this.cacheLocalPresets(generator);
      }
    },
    async cacheLocalPresets(generator) {
      var generatorPresets = await localforage.getItem(`local_presets_${generator}`);

      if (!Array.isArray(generatorPresets)) {
        generatorPresets = [];
      }

      for (const preset of generatorPresets) {
        fillPreset(preset, this.settings[generator]);
      }
      this.localPresets[generator] = generatorPresets;
      await this.saveLocalPresets(generator);
    },
    async deleteLocalPreset(generator, index) {
      this.localPresets[generator].splice(index, 1);
      await this.saveLocalPresets(generator);
    },
    async saveLocalPreset(generator, index, preset) {
      if (index == null) {
        index = this.localPresets[generator].length;
        this.localPresets[generator].push(preset);
      } else {
        this.localPresets[generator][index] = preset;
      }
      await this.saveLocalPresets(generator);
      return index;
    },
    async saveLocalPresets(generator) {
      const copy = JSON.parse(JSON.stringify(this.localPresets[generator]));
      await localforage.setItem(`local_presets_${generator}`, copy);
    },
  },
});
