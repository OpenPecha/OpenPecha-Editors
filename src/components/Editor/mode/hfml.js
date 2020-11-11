import CodeMirror from "codemirror";

CodeMirror.defineSimpleMode("hfml", {
    // The start state contains the rules that are intially used
    start: [
        // The regex matches the token, the token property contains the type
        { regex: /\[.*?\]/, token: "string" }, // pagination
        { regex: /\{.*?\}/, token: "number" }, // text id
        { regex: /<.*?,.*?>/, token: "property" }, // text id
    ]
});