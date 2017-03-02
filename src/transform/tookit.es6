export let replaceEmail = (source) => {
    return source.replace(/(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})/i, '')
};