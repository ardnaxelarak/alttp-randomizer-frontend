<script>
import { defineComponent } from "vue";

import { Base64 } from "js-base64";
import axios from "axios";

export default defineComponent({
  data() {
    return {
      multidata: null,
      worlds: {},
      error: null,
    };
  },
  props: {
    id: "",
  },
  async mounted() {
    document.title = `ALttPR Multiworld: ${this.id}`;
    await this.fetchMulti();
  },
  computed: {
    permalink() {
      return `/multi/${this.id}`;
    },
  },
  methods: {
    async fetchMulti() {
      await axios.get(`/multi/${this.id}`)
        .then(response => {
          if (response && response.data && response.data.multidata) {
            const multi = response.data;
            this.multidata = Base64.toUint8Array(multi.multidata);
            this.worlds = multi.worlds;
          } else {
            this.error = "Error loading multiworld.";
          }
        })
        .catch(error => {
          if (error.response?.status == 409) {
            // still generating, try again
            setTimeout(this.fetchMulti.bind(this), 10000);
          } else {
            this.error = "Multiworld not found. :(";
          }
        });
    },
    async downloadMultidata() {
      const blob = new Blob([this.multidata], { type: 'octet/stream' });
      const link = document.getElementById('downloader');
      link.href = URL.createObjectURL(blob);
      link.download = `GK_${this.id}_multidata`;
      link.click();
    },
  }
});
</script>

<template>
  <div class="mw-30">
    <div v-if="multidata" class="card content-div m-3">
      <div class="card-header">
        Permalink: <a :href="permalink">{{ permalink }}</a>
      </div>
      <ul class="list-group list-group-flush">
        <li v-for="world in worlds" class="list-group-item">
          {{ world.name }}: <a :href="`/seed/${world.id}`">/seed/{{ world.id }}</a>
        </li>
        <li class="list-group-item">
          <button type="submit" class="btn btn-primary submit-btn" :disabled="!multidata" @click="downloadMultidata">
            Download Multidata!
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
