import { Mark } from "tiptap";
import { toggleMark } from "tiptap-commands";
import { v4 as uuidv4 } from "uuid";

function getUUID(node) {
  if (node.attrs.id) {
    return node.attrs.id
  }
  return uuidv4().replaceAll("-", "")
}
export default class LayerMark extends Mark {
  get name() {
    return "layermark";
  }

  get defaultOptions() {
    return {
      layers: layers.map((layer) => layer.style)
    };
  }

  get schema() {
    return {
      attrs: {
        layer: {
          default: "commentry"
        },
        id: {
          default: null
        }
      },

      parseDOM: [
        {
          tag: "span",
          getAttrs: dom => {
            let layer = dom.getAttribute("class")
            let id = dom.getAttribute("id")
            return this.defaultOptions.layers.indexOf(layer) > -1 ? {layer, id} : false
          }
        },
      ],

      toDOM: mark => {
        return ["span", { class: mark.attrs.layer, id:  getUUID(mark) }];
      }
    };
  }

  commands({ type }) {
    return attrs => toggleMark(type, attrs);
  }
}

export const layers = [
        {
          name: "Book Title",
          style: "book-title",
          color: '#343233'
        },
        {
          name: "Sub Title",
          style: "sub-title",
          color: '#343233'
        },
        {
          name: "Book Number",
          style: "book-number",
          color: '#343233'
        },
        {
          name: "Author",
          style: "author",
          color: '#343233'
        },
        {
          name: "Chapter",
          style: "chapter",
          color: '#343233'
        },
        {
          name: "Root Text",
          style: "root-text",
          color: '#8b1409'
        },
        {
          name: "Citation",
          style: "citation",
          color: '#897335'
        },
        {
          name: "Sabche",
          style: "sabche",
          color: '#005e7f'
        },
        {
          name: "Yigchung",
          style: "yigchung",
          color: '#343233'
        },
      ]