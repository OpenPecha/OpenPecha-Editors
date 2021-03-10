<template>
  <q-page padding>
    <q-card bordered flat>
      <q-toolbar>
        <q-btn flat round dense icon="menu" class="q-mr-sm">
          <q-tooltip>show all text</q-tooltip>
        </q-btn>
        <q-separator vertical inset />

        <q-btn-dropdown
          flat
          no-caps
          dense
          icon="layers"
          :style="{
            background: currentLayer.color,
            color: textColor(currentLayer.color),
          }"
          :label="currentLayer.text"
          class="q-ml-sm"
        >
          <q-list dense>
            <q-item
              v-for="layer in layers"
              :key="layer.id"
              clickable
              v-close-popup
              @click="selectLayer(layer)"
              :style="{
                background: layer.color,
                color: textColor(layer.color),
              }"
            >
              <q-item-section>
                <q-item-label>{{ layer.text }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>

        <q-btn
          unelevated
          icon="edit_off"
          text-color="grey-10"
          class="q-ml-sm"
          @click="editingBase = true"
        >
          <q-tooltip>edit base</q-tooltip>
        </q-btn>

        <q-separator vertical inset />

        <q-btn unelevated icon="get_app" class="q-ml-sm" @click="exportPecha">
          <q-tooltip>export to ebook</q-tooltip>
        </q-btn>
        <q-space />
        <q-btn unelevated icon="save" text-color="green-5" @click="save">
          <q-tooltip>save</q-tooltip>
        </q-btn>
      </q-toolbar>

      <q-separator />

      <div class="col q-pa-md content scroll overflow-auto">
        <textarea
          v-show="editingBase"
          type="text"
          :style="{ width: '100%', height: '80vh' }"
          >{{ currentDoc.text }} </textarea
        >
        <entity-item-box
          v-show="!editingBase"
          :layers="layers"
          :text="currentDoc.text"
          :entities="currentDoc.annotations"
          :currentLayer="currentLayer"
          :delete-annotation="removeEntity"
          :update-entity="updateEntity"
          :add-entity="addEntity"
        />
      </div>
    </q-card>

    <q-dialog v-model="showDownloadLink" persistent>
      <download-link-box :link="download_link" />
    </q-dialog>
  </q-page>
</template>

<script>
import { mapState } from "vuex";

import { v4 as uuidv4 } from "uuid";

import { idealColor, layerColor, getOrigin } from "src/utils";
import { getFiles, getFileContent, commit, getUser } from "src/github";

import EntityItemBox from "components/annotation/EntityItemBox";
import DownloadLinkBox from "components/Modals/DownloadLinkBox";

export default {
  name: "Annotation",

  components: {
    EntityItemBox,
    DownloadLinkBox,
  },

  data() {
    return {
      user: null,
      currentLayer: null,
      org: "OpenPecha",
      reviewBranch: "review",
      pechaCompoents: null,
      currentVol: "v001",
      editingBase: false,
      opfLayers: [], // [{id: layerId, metadata: github-metadata, content: actual-layer}]
      layers: [
        {
          id: -1,
          text: "All",
          color: "#ffffff",
        },
      ],
      currentDoc: {
        id: 8,
        text: "",
        annotations: [],
      },
      showDownloadLink: false,
      download_link: "",
    };
  },

  computed: {
    ...mapState("app", ["userAccessToken"]),

    pechaId() {
      return this.$route.params.pechaId;
    },
  },

  methods: {
    getOpfLayerIdx(layerId) {
      return this.opfLayers.findIndex((layer) => layer.id == layerId);
    },

    removeEntity(ann) {
      // remove from doc annotations
      this.currentDoc.annotations = this.currentDoc.annotations.filter(
        (item) => item.id !== ann.id
      );

      // remove from opf layer
      const opfLayerIdx = this.getOpfLayerIdx(ann.layerId);
      this.opfLayers[opfLayerIdx].annotations[ann.id].deleted = true;
      this.opfLayers[opfLayerIdx].annotations[ann.id].reviewed = false;
    },

    updateEntity(layerId, ann) {
      const index = this.currentDoc.annotations.findIndex(
        (item) => item.id === ann.id
      );
      this.currentDoc.annotations[index].layer = layerId;
    },

    addEntity(startOffset, endOffset, layerId) {
      // add to doc annotations
      const newAnn = {
        id: uuidv4().replaceAll("-", ""),
        span: { start: startOffset, end: endOffset },
        layer: layerId,
      };
      this.currentDoc.annotations.push(newAnn);

      // add to opf layer
      this.opfLayers[this.getOpfLayerIdx(layerId)].annotations[newAnn.id] = {
        span: newAnn.span,
        reviewed: false,
      };
    },

    selectLayer(layer) {
      if (this.editingBase) {
        this.updateBaseLayer();
        this.editingBase = false;
      }
      this.currentLayer = layer;
    },

    textColor(bgColor) {
      return idealColor(bgColor);
    },

    loadAnn(layer) {
      for (const [id, ann] of Object.entries(layer.annotations)) {
        this.currentDoc.annotations.push({
          id: id,
          span: ann.span,
          layer: layer.id,
        });
      }
    },

    async loadPechaComponents() {
      const response = await this.$axios.get(
        getOrigin() + "/api/v1/pechas/" + this.pechaId + "/components"
      );
      this.pechaCompoents = response.data;
    },

    addLayer(layer, layerFile) {
      // add layer for annotations
      this.layers.push({
        id: layer.id,
        text: layer.annotation_type,
        color: layerColor[layer.annotation_type],
        base: this.currentVol,
      });

      // save opf layers
      this.opfLayers.push({
        id: layer.id,
        metadata: layerFile,
        content: layer,
      });
    },

    async loadVolumeLayer() {
      this.pechaCompoents[this.currentVol].forEach(async (layerName) => {
        const response = await this.$axios.get(
          getOrigin() +
            `/api/v1/pechas/${this.pechaId}/layers/${this.currentVol}/${layerName}`
        );
        const layer = response.data;
        this.loadAnn(layer);
        this.addLayer(layer);
      });
    },

    async loadVolumeBase() {
      const response = await this.$axios.get(
        getOrigin() + `/api/v1/pechas/${this.pechaId}/base/${this.currentVol}`
      );
      this.currentDoc.text = response.data;
      console.log(this.currentDoc.text);
    },

    save() {
      this.$q.loading.show();
      this.opfLayers.forEach(async (opfLayer) => {
        const sha = await commit(
          this.org,
          this.pechaId,
          this.reviewBranch,
          opfLayer.metadata.path,
          opfLayer.content,
          opfLayer.metadata.sha,
          this.userAccessToken
        );

        opfLayer.metadata.sha = sha;
      });
      this.$q.loading.hide();
    },

    async loadUser() {
      this.user = await getUser(this.userAccessToken);
    },

    async updateBaseLayer() {
      this.$q.loading.show();
      const response = await this.$axios.put(
        getOrigin() +
          "/api/v1/pechas/" +
          this.pechaId +
          "/base/" +
          this.currentVol,
        {
          updated_base: {
            id: this.currentVol,
            content: this.currentDoc.text.slice(0, 100),
          },
          layers: this.opfLayersContent,
        }
      );
      this.$q.loading.hide();
      console.log(response["data"]);
    },

    async exportPecha() {
      this.$q.loading.show();
      const response = await this.$axios.get(
        getOrigin() +
          "/api/v1/pechas/" +
          this.pechaId +
          "/export/" +
          this.reviewBranch
      );
      this.$q.loading.hide();
      if (response["status"] == 200) {
        this.showDownloadLink = true;
        this.download_link = response.data.download_link;
      } else {
        this.$q.notify({
          type: "negative",
          message: "export failed",
        });
      }
    },
  },

  async created() {
    await this.loadPechaComponents();
    this.loadVolumeLayer();
    this.loadVolumeBase();
    this.loadUser();
    this.currentLayer = this.layers[0];
  },
};
</script>

<style lang="sass" scoped>
.q-card
  max-width: 1000px
  margin: auto
  // height: 90vh
  // overflow: hidden

.content
  font-family: 'monlam-ochan2', sans-serif
  font-size: 1.657rem
  line-heigh: 1.8
</style>