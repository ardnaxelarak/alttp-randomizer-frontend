<script>
import { defineComponent } from "vue";

import axios from "axios";
import { Modal } from "bootstrap";

import AccordionItem from "@/components/AccordionItem.vue";
import PresetPicker from "@/components/PresetPicker.vue";
import SettingPicker from "@/components/SettingPicker.vue";

export default defineComponent({
  components: {
    AccordionItem,
    PresetPicker,
    SettingPicker,
  },
  emits: [
    'update:modelValue'
  ],
  props: {
    modelValue: {},
    prefix: null,
  },
  data() {
    return {
      set: {},
      existingLocalPresets: [],
      newPresetName: "",
      replacePreset: null,
      modal: null,
    };
  },
  mounted() {
    this.modal = new Modal(document.getElementById("savePresetModal"), {});
  },
  watch: {
    set: {
      handler(newValue, oldValue) {
        this.$refs.preset.settingChanged(newValue);
        this.$emit("update:modelValue", this.set);
      },
      deep: true,
    }
  },
  methods: {
    async generate(race) {
      const settings = {
        randomizer: "base",
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
    presetSelected(preset) {
      for (const setting of Object.keys(this.set)) {
        if (preset[setting] != undefined) {
          this.set[setting] = preset[setting];
        }
      }
    },
    savePreset(names) {
      this.newPresetName = "";
      this.existingLocalPresets = names;
      this.modal.show();
    },
    async modalSavePreset() {
      const preset = JSON.parse(JSON.stringify(this.set));
      preset.display = this.newPresetName;
      if (this.replacePreset != null) {
        preset.display = this.existingLocalPresets[this.replacePreset];
      }
      await this.$refs.preset.savePreset(this.replacePreset, preset);
      this.modal.hide();
    },
  },
});
</script>

<template>
  <div class="modal" tabindex="-1" id="savePresetModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Save Preset</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="input-group mb-3">
            <select v-model="replacePreset" class="form-select">
              <option :value="null" selected>New</option>
              <optgroup v-if="existingLocalPresets.length" label="Overwrite Preset:">
                <template v-for="(preset, idx) of existingLocalPresets">
                  <option :value="idx">
                    {{ preset }}
                  </option>
                </template>
              </optgroup>
            </select>
          </div>
          <div class="input-group mb-3" v-if="replacePreset == null">
            <label class="input-group-text" for="new-preset-name">
              Name
            </label>
            <input type="text" class="form-control" placeholder="Display Name"
                id="new-preset-name" v-model="newPresetName" autocomplete="off" />
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            Cancel
          </button>
          <button :disabled="replacePreset == null && newPresetName.length == 0" type="button"
              class="btn btn-primary" @click="modalSavePreset">
            Save Preset
          </button>
        </div>
      </div>
    </div>
  </div>
  <div id="settings" class="accordion accordion-flush">
    <AccordionItem>
      <PresetPicker ref="preset" generator="base" @selected="presetSelected"
          @save="savePreset" />
    </AccordionItem>
    <AccordionItem :expanded="true">
      <template #header>
        <b>World:</b>
      </template>
      <SettingPicker color="primary" v-model="set.mode" name="mode" generator="base" :prefix="prefix" />
      <SettingPicker color="primary" v-model="set.weapons" name="weapons" generator="base" :prefix="prefix" />
      <SettingPicker color="primary" v-model="set.hints" name="hints" generator="base" :prefix="prefix" />
    </AccordionItem>
    <AccordionItem :expanded="true">
      <template #header>
        <b>Goal:</b>
      </template>
      <SettingPicker color="success" v-model="set.goal" name="goal" generator="base" :prefix="prefix" />
      <SettingPicker color="success" v-if="['ganon', 'fast_ganon'].includes(this.set.goal)" 
          v-model="set.crystals_ganon" name="crystals_ganon" generator="base" :prefix="prefix" />
      <SettingPicker color="success" v-model="set.crystals_gt" name="crystals_gt" generator="base" :prefix="prefix" />
    </AccordionItem>
    <AccordionItem :expanded="false">
      <template #header>
        <b>Entrance Shuffle:</b>
      </template>
      <SettingPicker color="warning" v-model="set.entrance_shuffle" name="entrance_shuffle" generator="base" :prefix="prefix" />
      <SettingPicker color="warning" v-if="this.set.entrance_shuffle != 'vanilla'"
          v-model="set.skull_woods" name="skull_woods" generator="base" :prefix="prefix" />
      <SettingPicker color="warning" v-if="this.set.entrance_shuffle != 'vanilla'"
          v-model="set.linked_drops" name="linked_drops" generator="base" :prefix="prefix" />
    </AccordionItem>
    <AccordionItem :expanded="false">
      <template #header>
        <b>Dungeon Shuffle:</b>
      </template>
      <SettingPicker color="danger" v-model="set.door_shuffle" name="door_shuffle" generator="base" :prefix="prefix" />
      <SettingPicker color="danger" v-if="this.set.door_shuffle != 'vanilla'"
          v-model="set.lobbies" name="door_lobbies" generator="base" :prefix="prefix" />
      <SettingPicker color="danger" v-if="this.set.door_shuffle != 'vanilla'"
          v-model="set.door_type_mode" name="door_type_mode" generator="base" :prefix="prefix" />
      <SettingPicker color="danger" v-if="this.set.door_shuffle != 'vanilla'"
          v-model="set.trap_door_mode" name="trap_door_mode" generator="base" :prefix="prefix" />
    </AccordionItem>
    <AccordionItem :expanded="false">
      <template #header>
        <b>Enemizer:</b>
      </template>
      <SettingPicker color="success" v-model="set.boss_shuffle" name="boss_shuffle" generator="base" :prefix="prefix" />
      <SettingPicker color="success" v-model="set.enemy_shuffle" name="enemy_shuffle" generator="base" :prefix="prefix" />
      <SettingPicker color="success" v-model="set.damage_table_shuffle" name="damage_table_shuffle" generator="base" :prefix="prefix" />
    </AccordionItem>
    <AccordionItem :expanded="false">
      <template #header>
        <b>Dungeon Item Shuffle:</b>
      </template>
      <SettingPicker color="warning" v-model="set.small_keys" name="small_keys" generator="base" :prefix="prefix" />
      <SettingPicker color="warning" v-model="set.big_keys" name="big_keys" generator="base" :prefix="prefix" />
      <SettingPicker color="warning" v-model="set.maps" name="maps" generator="base" :prefix="prefix" />
      <SettingPicker color="warning" v-model="set.compasses" name="compasses" generator="base" :prefix="prefix" />
    </AccordionItem>
    <AccordionItem :expanded="false">
      <template #header>
        <b>Other Pool Settings:</b>
      </template>
      <SettingPicker color="danger" v-model="set.shop_shuffle" name="shop_shuffle" generator="base" :prefix="prefix" />
      <SettingPicker color="danger" v-model="set.drop_shuffle" name="drop_shuffle" generator="base" :prefix="prefix" />
      <SettingPicker color="danger" v-model="set.pottery" name="pottery" generator="base" :prefix="prefix" />
      <SettingPicker color="danger" v-model="set.prize_shuffle" name="prize_shuffle" generator="base" :prefix="prefix" />
      <SettingPicker color="danger" v-model="set.follower_shuffle" name="follower_shuffle" generator="base" :prefix="prefix" />
    </AccordionItem>
    <AccordionItem :expanded="false">
      <template #header>
        <b>Item Settings:</b>
      </template>
      <SettingPicker color="primary" v-model="set.boots" name="boots" generator="base" :prefix="prefix" />
      <SettingPicker color="primary" v-model="set.flute" name="flute" generator="base" :prefix="prefix" />
      <SettingPicker color="primary" v-model="set.dark_rooms" name="dark_rooms" generator="base" :prefix="prefix" />
      <SettingPicker color="primary" v-model="set.bombs" name="bombs" generator="base" :prefix="prefix" />
      <SettingPicker color="primary" v-model="set.book" name="book" generator="base" :prefix="prefix" />
    </AccordionItem>
    <AccordionItem :expanded="false">
      <template #header>
        <b>Challenge Modes:</b>
      </template>
      <SettingPicker color="danger" v-model="set.damage_challenge" name="damage_challenge" generator="base" :prefix="prefix" />
    </AccordionItem>
  </div>
</template>

