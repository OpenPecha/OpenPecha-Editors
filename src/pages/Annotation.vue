<template>
  <q-page padding>
    <entity-item-box
      :labels="layers"
      :text="currentDoc.text"
      :entities="currentDoc.annotations"
      :delete-annotation="removeEntity"
      :update-entity="updateEntity"
      :add-entity="addEntity"
    />
  </q-page>
</template>

<script>
import EntityItemBox from "components/annotation/EntityItemBox";

export default {
  name: "Annotation",

  components: {
    EntityItemBox,
  },

  data() {
    return {
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
            label: 4,
            start_offset: 60,
            end_offset: 70,
          },
          {
            id: 19,
            prob: 0.0,
            label: 4,
            start_offset: 165,
            end_offset: 172,
          },
          {
            id: 16,
            prob: 0.0,
            label: 6,
            start_offset: 14,
            end_offset: 22,
          },
          {
            id: 18,
            prob: 0.0,
            label: 6,
            start_offset: 73,
            end_offset: 87,
          },
          {
            id: 20,
            prob: 0.0,
            label: 7,
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
    updateEntity(labelId, annotationId) {
      const index = this.currentDoc.annotations.findIndex(
        (item) => item.id === annotationId
      );
      this.currentDoc.annotations[index].label = labelId;
    },
    addEntity(startOffset, endOffset, labelId) {
      const payload = {
        id: Math.floor(Math.random() * Math.floor(Number.MAX_SAFE_INTEGER)),
        start_offset: startOffset,
        end_offset: endOffset,
        label: labelId,
      };
      this.currentDoc.annotations.push(payload);
    },
  },
};
</script>
