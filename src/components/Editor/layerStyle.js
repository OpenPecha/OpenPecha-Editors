import { Mark } from "tiptap";
import { updateMark } from "tiptap-commands";

export default class LayerStyle extends Mark {
  get name() {
    return "layerstyle";
  }

  get defaultOptions() {
    return {
      levels: ["book-title", "author", "chapter", "citation", "commentry"]
    };
  }

  get schema() {
    return {
      attrs: {
        level: {
          default: "commentry"
        }
      },
      parseDOM: [
        {
          tag: "span.custom-style",
          getAttrs(dom) {
            console.log(dom.classList[1]);
            return { level: dom.classList[1] };
          }
        }
      ],
      toDOM: mark => {
        return ["span", { class: `custom-style ${mark.attrs.level}` }, 0];
      }
    };
  }

  commands({ type }) {
    return attrs => updateMark(type, attrs);
  }
}
