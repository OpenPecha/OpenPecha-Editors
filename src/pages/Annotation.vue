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
                <q-item-layer>{{ layer.text }}</q-item-layer>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>

        <!-- <q-separator vertical inset /> -->

        <q-btn unelevated icon="edit_off" text-color="grey-10" class="q-ml-sm">
          <q-tooltip>edit base</q-tooltip>
        </q-btn>
        <q-space />
        <q-btn unelevated icon="save " text-color="green-5">
          <q-tooltip>save</q-tooltip>
        </q-btn>
      </q-toolbar>

      <q-separator />

      <div class="row q-pa-md">
        <entity-item-box
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
  </q-page>
</template>

<script>
import EntityItemBox from "components/annotation/EntityItemBox";
import { idealColor } from "src/utils";
import { getFiles, getFileContent } from "src/github";
import yaml from "js-yaml";

export default {
  name: "Annotation",

  components: {
    EntityItemBox,
  },

  data() {
    return {
      currentLayer: null,
      org: "OpenPecha",
      pechaId: "P000100",
      reviewBranch: "review",
      vol: "v001",
      layerColor: {
        BookTitle: "#09ebdf",
        Chapter: "#09ebdf",
        Author: "#09ebdf",
        Citation: "#09ebdf",
        Sabche: "#fbb028",
        Yigchung: "#d29eea",
        Tsawa: "#6a74b9",
      },
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
    };
  },

  methods: {
    removeEntity(annotationId) {
      this.currentDoc.annotations = this.currentDoc.annotations.filter(
        (item) => item.id !== annotationId
      );
    },

    updateEntity(layerId, annotationId) {
      const index = this.currentDoc.annotations.findIndex(
        (item) => item.id === annotationId
      );
      this.currentDoc.annotations[index].layer = layerId;
    },

    addEntity(startOffset, endOffset, layerId) {
      const payload = {
        id: Math.floor(Math.random() * Math.floor(Number.MAX_SAFE_INTEGER)),
        start_offset: startOffset,
        end_offset: endOffset,
        layer: layerId,
      };
      this.currentDoc.annotations.push(payload);
    },

    selectLayer(layer) {
      this.currentLayer = layer;
    },

    textColor(bgColor) {
      return idealColor(bgColor);
    },

    loadAnn(layer) {
      for (const [id, ann] of Object.entries(layer.annotations)) {
        this.currentDoc.annotations.push({
          id: id,
          start_offset: ann.span.start,
          end_offset: ann.span.end,
          layer: layer.id,
        });
      }
    },

    addLayer(layer) {
      this.layers.push({
        id: layer.id,
        text: layer.annotation_type,
        color: "#09ebdf",
        base: this.vol,
      });
    },

    async loadVolumeLayer() {
      const layerFiles = await getFiles(
        this.org,
        this.pechaId,
        this.reviewBranch,
        `${this.pechaId}.opf/layers/${this.vol}`
      );

      layerFiles.forEach(async (layerFile) => {
        const content = await getFileContent(
          this.org,
          this.pechaId,
          layerFile.sha
        );
        const layer = yaml.load(content);
        this.loadAnn(layer);
        this.addLayer(layer);
      });
    },

    async loadVolumeBase() {
      const baseVols = await getFiles(
        this.org,
        this.pechaId,
        this.reviewBranch,
        `${this.pechaId}.opf/base`
      );

      baseVols.forEach(async (baseVol) => {
        if (baseVol.name == `${this.vol}.txt`) {
          this.currentDoc.text = await getFileContent(
            this.org,
            this.pechaId,
            baseVol.sha
          );
        }
      });
    },
  },

  created() {
    this.loadVolumeLayer();
    this.loadVolumeBase();
    this.currentLayer = this.layers[0];
  },
};
</script>

<style scoped>
.q-card {
  max-width: 1000px;
  margin: auto;
}
</style>