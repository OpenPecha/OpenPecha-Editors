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

      <div class="col q-pa-md content scroll overflow-auto">
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
import { idealColor, layerColor } from "src/utils";
import { getFiles, getFileContent } from "src/github";
import yaml from "js-yaml";
import { v4 as uuidv4 } from "uuid";

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
      opfLayers: {},
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
    removeEntity(ann) {
      // remove from doc annotations
      this.currentDoc.annotations = this.currentDoc.annotations.filter(
        (item) => item.id !== ann.id
      );

      // remove from opf layer
      this.opfLayers[ann.layerId].annotations[ann.id].deleted = true;
      this.opfLayers[ann.layerId].annotations[ann.id].reviewed = false;
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
      this.opfLayers[layerId].annotations[newAnn.id] = {
        span: newAnn.span,
        reviewed: false,
      };

      console.log(newAnn.id);
      console.log(this.opfLayers[layerId].annotations[newAnn.id]);
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
          span: ann.span,
          layer: layer.id,
        });
      }
    },

    addLayer(layer) {
      this.opfLayers[layer.id] = layer;
      this.layers.push({
        id: layer.id,
        text: layer.annotation_type,
        color: layerColor[layer.annotation_type],
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