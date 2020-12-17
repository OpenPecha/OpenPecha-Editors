<template>
  <div class="container">
    <q-card class="image-card">
      <img
        src="https://i0.wp.com/www.dontwasteyourtime.co.uk/wp-content/uploads/2012/07/screenshot_2012-07-26T15_37_48-0100.gif?ssl=1"
      />
    </q-card>

    <div class="edit">
      <div class="edit__select">
        <q-btn-group outline>
          <q-btn
            outline
            no-caps
            size="0.75rem"
            color="grey-9"
            label="Google"
            id="google-btn"
            class="bg-blue-3"
            @click="selectEditor('google', 'google-btn')"
          />
          <q-btn
            outline
            no-caps
            size="0.75rem"
            color="grey-6"
            label="Namsel"
            id="namsel-btn"
            @click="selectEditor('namsel', 'namsel-btn')"
          />
        </q-btn-group>
        <q-btn-group outline>
          <q-btn
            outline
            no-caps
            size="0.75rem"
            color="grey-6"
            label="Google Note"
            id="google-note-btn"
            @click="selectEditor('google-note', 'google-note-btn')"
          />
          <q-btn
            outline
            no-caps
            size="0.75rem"
            color="grey-6"
            label="Namsel Note"
            id="namsel-note-btn"
            @click="selectEditor('namsel-note', 'namsel-note-btn')"
          />
        </q-btn-group>
      </div>
      <div class="edit__editors">
        <editor
          id="google"
          class="edit__editor active"
          textAreaIdProp="google-textarea"
          currentLayerProp="google"
          :loadText="loadText"
          :getTextList="getTextList"
          :extraTools="false"
        />
        <editor
          id="namsel"
          class="edit__editor"
          textAreaIdProp="namsel-textarea"
          currentLayerProp="namsel"
          :loadText="loadText"
          :getTextList="getTextList"
          :extraTools="false"
        />
        <editor
          id="google-note"
          textAreaIdProp="google-note-textarea"
          class="edit__editor"
          currentLayerProp="google"
          :loadText="loadText"
          :getTextList="getTextList"
          :extraTools="false"
        />
        <editor
          id="namsel-note"
          class="edit__editor"
          textAreaIdProp="namsel-note-textarea"
          currentLayerProp="namsel"
          :loadText="loadText"
          :getTextList="getTextList"
          :extraTools="false"
        />
      </div>
    </div>
    <div class="preview">Preview</div>
  </div>
</template>

<script>
export default {
  name: "PedurmaEditorPage",
  data() {
    return {
      currentPageNo: 1,
      editor: "google",
      pages: {
        google: [
          {
            id: 1,
            name: "Page 1",
            page_no: 1,
            content: "Google Page 1 example text",
            durchen_id: 1,
          },
          {
            id: 2,
            name: "Page 2",
            page_no: 2,
            content: "Google Page 2 example text",
            durchen_id: 1,
          },
        ],
        namsel: [
          {
            id: 1,
            name: "Page 1",
            page_no: 1,
            content: "Namsel Page 1 example text",
            durchen_id: 1,
          },
          {
            id: 2,
            name: "Page 2",
            content: "Namsel Page 2 example text",
            durchen_id: 1,
          },
        ],
      },
      durchens: {
        google: {
          1: {
            page_no: 100,
            content: "Durchen page 1 example",
          },
        },
        namsel: {
          1: {
            page_no: 100,
            content: "Durchen page 1 example",
          },
        },
      },
    };
  },

  components: {
    editor: require("components/Editor/Editor.vue").default,
  },

  methods: {
    async getTextList(textType) {
      return this.pages[textType];
    },

    loadText(page) {
      this.currentPageNo = page.page_no;
      return page.content;
    },

    saveText() {
      console.log("Save text");
    },

    selectEditor(editorName, btnId) {
      // active the editor
      const currentActivedEditor = document.querySelector(
        ".edit__editor.active"
      );
      currentActivedEditor.classList.remove("active");
      const toActivateEditor = document.querySelector("#" + editorName);
      toActivateEditor.classList.add("active");

      // add ative style to button
      const nonActiveCls = "text-grey-6";
      const activeCls = "text-grey-9";
      const activeClsBg = "bg-blue-3";
      const btnGroups = document
        .querySelector(".edit__select")
        .querySelectorAll(".q-btn-group");
      btnGroups.forEach(function (btnGroup) {
        const currentActivedBtn = btnGroup.querySelector(".q-btn.bg-blue-3");
        if (currentActivedBtn) {
          currentActivedBtn.classList.remove(activeCls, activeClsBg);
          currentActivedBtn.classList.add(nonActiveCls);
        }
      });

      const toActivateBtn = document.querySelector("#" + btnId);
      toActivateBtn.classList.add(activeCls, activeClsBg);
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  margin: 1rem;
  justify-content: space-between;
  justify-items: center;
  align-items: flex-start;
}

.image-card {
  width: 25%;
  margin-right: 0.625rem;
}

.edit {
  width: 50%;
  margin-right: 0.625rem;

  &__select {
    display: flex;
    justify-content: space-between;
  }

  &__editors {
    width: 100%;
    margin-top: 5px;
  }

  &__editor {
    display: none;

    &.active {
      display: block;
    }
  }
}

.preview {
  width: 25%;
}
</style>