import { Mark } from "tiptap";
import { updateMark } from "tiptap-commands";
import { v4 as uuidv4 } from "uuid";

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
          tag: "span",
          getAttrs(dom) {
            return { level: dom.classList[1] };
          }
        }
      ],
      toDOM: mark => {
        return ["span", { class: mark.attrs.level, id:  uuidv4().replaceAll("-", "")}, 0];
      }
    };
  }

  commands({ type }) {
    return attrs => updateMark(type, attrs);
  }
}
