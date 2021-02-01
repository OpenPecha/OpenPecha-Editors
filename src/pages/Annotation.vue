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
import { idealColor } from "../utils";

export default {
  name: "Annotation",

  components: {
    EntityItemBox,
  },

  data() {
    return {
      currentLayer: null,
      layers: [
        {
          id: -1,
          text: "All",
          color: "#ffffff",
        },
        {
          id: 4,
          text: "Citation",
          prefix_key: null,
          suffix_key: "c",
          color: "#09ebdf",
        },
        {
          id: 5,
          text: "Sabche",
          prefix_key: null,
          suffix_key: "m",
          color: "#fbb028",
        },
        {
          id: 6,
          text: "Yigchug",
          prefix_key: null,
          suffix_key: "o",
          color: "#d29eea",
        },
        {
          id: 7,
          text: "Tsawa",
          prefix_key: null,
          suffix_key: "p",
          color: "#6a74b9",
        },
      ],
      currentDoc: {
        id: 8,
        text:
          "After bowling Somerset out for 83 on the opening morning at Grace Road , Leicestershire extended their first innings by 94 runs before being bowled out for 296 with England discard Andy Caddick taking three for 83 .",
        annotations: [
          {
            id: 17,
            prob: 0.0,
            layer: 4,
            start_offset: 60,
            end_offset: 70,
          },
          {
            id: 19,
            prob: 0.0,
            layer: 4,
            start_offset: 165,
            end_offset: 172,
          },
          {
            id: 16,
            prob: 0.0,
            layer: 6,
            start_offset: 14,
            end_offset: 22,
          },
          {
            id: 18,
            prob: 0.0,
            layer: 6,
            start_offset: 73,
            end_offset: 87,
          },
          {
            id: 20,
            prob: 0.0,
            layer: 7,
            start_offset: 181,
            end_offset: 193,
          },
        ],
        meta: '{"wikiPageId":2}',
        annotation_approver: null,
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
  },

  created() {
    this.currentLayer = this.layers[0];
  },
};
</script>
