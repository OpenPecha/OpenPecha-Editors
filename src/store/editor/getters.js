export function getEditor(state) {
    return state.editor;
}

export function getContent(state) {
    return state.editor.value();
}

export function getOptions(state) {
    return state.options
}

export function org(state) {
    return state.org;
}

export function repo(state) {
    return state.repo;
}
