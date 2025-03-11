<script>
import { defineComponent } from 'vue';

import ZSPR from "@/ZSPR.js";
import localforage from "localforage";
import officialSprites from "@/data/sprites.json";
import axios from "axios";

import vSelect from "vue-select";

export default defineComponent({
  components: {
    vSelect,
  },
  data() {
    return {
      uploadedZspr: null,
      sprite_error: null,
      spriteType: null,
      officialSprite: null,
    };
  },
  async mounted() {
    const spriteType = await localforage.getItem("selected_sprite_type") ?? "default";
    this.officialSprite = await localforage.getItem("selected_official_sprite");
    const uploaded = await localforage.getItem("uploaded_sprite");
    if (uploaded) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(uploaded);
      document.getElementById("sprite-input").files = dataTransfer.files;
      await this.uploadSprite(uploaded, false);
    }
    this.spriteType = spriteType;
  },
  watch: {
    async spriteType(newValue, oldValue) {
      await localforage.setItem("selected_sprite_type", newValue);
    },
    async officialSprite(newValue, oldValue) {
      if (newValue) {
        this.spriteType = "official";
      } else {
        this.spriteType = "default";
      }
      await localforage.setItem("selected_official_sprite", JSON.parse(JSON.stringify(newValue)));
    },
  },
  computed: {
    spriteList() {
      return officialSprites;
    },
  },
  methods: {
    async patch(rom) {
      if (this.spriteType == "custom" && this.uploadedZspr != null) {
        this.uploadedZspr.apply(rom);
      } else if (this.spriteType == "official" && this.officialSprite
          && this.officialSprite.file) {
        await axios.get(this.officialSprite.file, { responseType: "arraybuffer" })
            .then(response => {
              const buffer = new Uint8Array(response.data);
              const zspr = new ZSPR(buffer);

              if (!zspr.valid) {
                throw "Downloaded sprite invalid";
                return;
              }

              zspr.apply(rom);
            })
            .catch(error => {
              console.log(error);
            });
      }
    },
    uploadSprite(file, updateType) {
      if (!file) {
        this.sprite_error = null;
        this.uploadedZspr = null;
        if (updateType) {
          this.spriteType = "default";
        }
        return;
      }

      const reader = new FileReader();
      reader.onload = async function() {
        const buffer = new Uint8Array(reader.result);
        const zspr = new ZSPR(buffer);

        if (!zspr.valid) {
          this.sprite_error = "Invalid sprite file";
          this.uploadedZspr = null;
          if (updateType) {
            this.spriteType = "default";
          }
          return;
        }

        this.sprite_error = null;
        this.uploadedZspr = zspr;
        if (updateType) {
          this.spriteType = "custom";
        }
        await localforage.setItem("uploaded_sprite", file);
      }.bind(this);
      reader.readAsArrayBuffer(file);
    },
    getSpriteClass(name) {
      return "icon-custom-" + name.replace(/\W/g, "");
    },
  },
});
</script>

<template>
  <div>
    <div class="input-group mt-2">
      <div class="input-group-text">
        <input name="spriteType" v-model="spriteType" value="default" class="mt-0" type="radio">
      </div>
      <label class="input-group-text">
        Default Link Sprite
      </label>
    </div>
    <div class="input-group mt-2">
      <div class="input-group-text">
        <input name="spriteType" v-model="spriteType" value="official" class="mt-0" type="radio">
      </div>
      <label class="input-group-text" for="spriteSelector">
        Sprite:
      </label>
      <vSelect label="name" :options="spriteList" class="form-control"
          id="spriteSelector" v-model="officialSprite">
        <template #option="option">
          <div class="icon-custom sprite-preview-icon" :class="getSpriteClass(option.name)"></div>
          <span class="sprite-preview-name">{{ option.name }}</span>
        </template>
        <template #selected-option="option">
          <div class="icon-custom sprite-preview-icon" :class="getSpriteClass(option.name)"></div>
          <span class="sprite-preview-name">{{ option.name }}</span>
        </template>
      </vSelect>
    </div>
    <div class="input-group mt-2">
      <div class="input-group-text">
        <input name="spriteType" v-model="spriteType" value="custom" class="mt-0" type="radio">
      </div>
      <input id="sprite-input" class="form-control" type="file" accept=".zspr" @change="uploadSprite($event.target.files[0], true)" />
    </div>
    <div v-if="sprite_error" class="invalid">
      {{ sprite_error }}
    </div>
  </div>
</template>

<style>
#spriteSelector {
  padding: 0;
  --vs-border-style: none;
}
</style>
