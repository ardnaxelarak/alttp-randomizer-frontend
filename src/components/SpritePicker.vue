<script>
import { defineComponent } from 'vue';

import ZSPR from "@/ZSPR.js";
import localforage from "localforage";

export default defineComponent({
  data() {
    return {
      sprite: null,
      sprite_error: null,
    };
  },
  async mounted() {
  },
  computed: {
  },
  methods: {
    uploadSprite(file) {
      console.log(file);
      if (!file) {
        this.sprite_error = null;
        this.sprite = null;
        return;
      }

      const reader = new FileReader();
      reader.onload = function() {
        const buffer = new Uint8Array(reader.result);
        const zspr = new ZSPR(buffer);

        if (!zspr.valid) {
          this.sprite_error = "Invalid sprite file";
          this.sprite = null;
          return;
        }

        this.sprite_error = null;
        this.sprite = zspr;
        localforage.setItem("sprite", file);
        this.$emit("spriteUpdate", this.sprite);
      }.bind(this);
      reader.readAsArrayBuffer(file);
    },
  }
});
</script>

<template>
  <div>
    <label for="sprite-input" class="form-label">
      Custom Sprite:
      <template v-if="sprite">
        {{ sprite.spriteName }} by {{ sprite.spriteAuthor }}
      </template>
    </label>
    <input id="sprite-input" class="form-control" type="file" accept=".zspr" @change="uploadSprite($event.target.files[0])" />
    <div v-if="sprite_error" class="invalid">
      {{ sprite_error }}
    </div>
  </div>
</template>
