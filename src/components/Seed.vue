<script>
import { defineComponent } from "vue";

import SpritePicker from "@/components/SpritePicker.vue";
import HeartBeepPicker from "@/components/HeartBeepPicker.vue";
import HeartColorPicker from "@/components/HeartColorPicker.vue";
import QuickswapPicker from "@/components/QuickswapPicker.vue";
import ReduceFlashingPicker from "@/components/ReduceFlashingPicker.vue";
import BackgroundMusicPicker from "@/components/BackgroundMusicPicker.vue";
import MsuResumePicker from "@/components/MsuResumePicker.vue";

import SeedSettings from "@/components/SeedSettings.vue";

import { Base64 } from "js-base64";
import * as bps from "bps";
import CRC32 from "crc-32";
import localforage from "localforage";
import axios from "axios";

export default defineComponent({
  components: {
    SeedSettings,
    SpritePicker,
    HeartBeepPicker,
    HeartColorPicker,
    QuickswapPicker,
    ReduceFlashingPicker,
    BackgroundMusicPicker,
    MsuResumePicker,
  },
  data() {
    return {
      rom_checksum: "3322EFFC",
      baserom: null,
      baserom_error: null,
      sprite: null,
      patch: null,
      error: null,
      settings: null,
    };
  },
  props: {
    id: "",
  },
  async mounted() {
    document.title = `ALttPRandomizer: ${this.id}`;
    const file = await localforage.getItem("baserom");
    if (file) {
      // const dataTransfer = new DataTransfer();
      // dataTransfer.items.add(file);
      // this.baserom_file = dataTransfer.files;
      // document.getElementById("rom-input").files = dataTransfer.files;
      this.uploadBaseRom(file);
    }

    await this.fetchSeed();

  },
  computed: {
    permalink() {
      return `/seed/${this.id}`;
    },
  },
  methods: {
    dataLoaded(patch, seedData) {
      this.patch = patch;
      this.settings = seedData.settings;
    },
    async fetchSeed() {
      await axios.get(`/seed/${this.id}`)
        .then(response => {
          if (response && response.data && response.data.patch) {
            const seedData = response.data;
            const patchArray = Base64.toUint8Array(seedData.patch);
            try {
              const { instructions, _ } = bps.parse(patchArray);
              const sourceChecksum = instructions.sourceChecksum.toString(16).toUpperCase();
              if (sourceChecksum == this.rom_checksum) {
                this.dataLoaded(instructions, seedData);
              } else {
                this.error = "Patch does not specify correct source checksum.";
              }
            } catch (error) {
              console.log(error);
              this.error = "Error parsing patch.";
            }
          } else {
            this.error = "Error loading seed.";
          }
        })
        .catch(error => {
          if (error.response.status == 409) {
            // still generating, try again
            setTimeout(this.fetchSeed.bind(this), 2000);
          } else {
            this.error = "Seed not found. :(";
          }
        });
    },
    uploadBaseRom(file) {
      if (!file) {
        this.baserom_error = null;
        this.baserom = null;
        return;
      }

      const reader = new FileReader();
      reader.onload = function() {
        const buffer = new Uint8Array(reader.result);
        const crc = (CRC32.buf(buffer, 0) >>> 0).toString(16).toUpperCase();

        if (crc != this.rom_checksum) {
          this.baserom_error = `Expected CRC ${this.rom_checksum}, but got ${crc}`;
          this.baserom = null;
          return;
        }

        this.baserom_error = null;
        this.baserom = buffer;
        localforage.setItem("baserom", file);
      }.bind(this);
      reader.readAsArrayBuffer(file);
    },
    spriteUpdate(sprite) {
      this.sprite = sprite;
    },
    async patchRom() {
      var rom = bps.apply(this.patch, this.baserom);

      if (this.sprite) {
        this.sprite.apply(rom);
      }

      this.$refs.heartbeep.patch(rom);
      this.$refs.heartcolor.patch(rom);
      this.$refs.msu_resume.patch(rom);
      this.$refs.bgm.patch(rom);
      this.$refs.reduce_flashing.patch(rom);
      this.$refs.quickswap.patch(rom);

      // Fix Checksum
      const sum = rom.reduce(function(sum, mbyte, i) {
        if (i >= 0x7fdc && i < 0x7fe0) {
          return sum;
        }
        return sum + mbyte;
      });
      const checksum = (sum + 0x01FE) & 0xFFFF;
      const inverse = checksum ^ 0xFFFF;
      rom[0x7FDC] = inverse & 0xFF;
      rom[0x7FDD] = inverse >> 8;
      rom[0x7FDE] = checksum & 0xFF;
      rom[0x7FDF] = checksum >> 8;

      const blob = new Blob([rom], { type: 'octet/stream' });
      const link = document.getElementById('downloader');
      link.href = URL.createObjectURL(blob);
      link.download = `GK_${this.id}.sfc`;
      link.click();
    }
  }
});
</script>

<template>
  <div class="mw-30">
    <div v-if="patch" class="card content-div m-3">
      <div class="card-header">
        Permalink: <a :href="permalink">{{ permalink }}</a>
      </div>
      <ul class="list-group list-group-flush">
        <li v-if="!baserom" class="list-group-item">
          <div class="mb-2">
            <label for="rom-input" class="form-label">
              The Legend of Zelda: A Link to the Past (JP 1.0) Rom:
            </label>
            <input id="rom-input" class="form-control" type="file" accept=".sfc,.smc" @change="uploadBaseRom($event.target.files[0])" />
            <div v-if="baserom_error" class="invalid">
              {{ baserom_error }}
            </div>
          </div>
        </li>
        <li v-if="settings" class="list-group-item">
          <div class="mb-1">
            <SeedSettings :settings="settings" />
          </div>
        </li>
        <li class="list-group-item">
          <div class="mb-2">
            <SpritePicker @spriteUpdate="spriteUpdate" />
          </div>
        </li>
        <li class="list-group-item">
          <div class="mb-2">
            <HeartBeepPicker ref="heartbeep" />
          </div>
        </li>
        <li class="list-group-item">
          <div class="mb-2">
            <HeartColorPicker ref="heartcolor" />
          </div>
        </li>
        <li class="list-group-item">
          <div>
            <BackgroundMusicPicker ref="bgm" />
            <MsuResumePicker ref="msu_resume" />
            <ReduceFlashingPicker ref="reduce_flashing" />
            <QuickswapPicker ref="quickswap" />
          </div>
        </li>
        <li class="list-group-item">
          <button type="submit" class="btn btn-primary submit-btn" :disabled="!baserom || !patch" @click="patchRom">
            Download Seed!
          </button>
          <a id="downloader" style="display: none;" />
        </li>
      </ul>
    </div>
    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>
    <div v-else>
      <img class="center" src="/bludormspinbig.gif" />
    </div>
  </div>
</template>

<style scoped>
.error-message {
  text-align: center;
  font-size: xx-large;
  font-weight: bold;
  margin-top: 3rem;
}
</style>
