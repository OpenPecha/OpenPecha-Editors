export default function () {
    return {
        editor: null,
        options: {
            mode: "hfml",
            lineNumbers: true,
            viewportMargin: Infinity,
            lineWrapping: true,
            theme: "default",
            extraKeys: {
                F11: function (cm) {
                cm.setOption("fullScreen", !cm.getOption("fullScreen"));
                },
                Esc: function (cm) {
                if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
                },
            },
        },
        org: "OpenPecha",
        repo: "P000100",
    }
}