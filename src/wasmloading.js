function fetchAndInstantiate(url, imports = {}) {
    return WebAssembly.instantiateStreaming(fetch(url), imports).then(response => {
      return response.instance;
    }).catch(console.error);
}

async function load (url, callback) {
    let instance = await fetchAndInstantiate(url, {main: window.main.exports} );
    window.lazyInstance = instance;
    window.main.exports.run_load_callback(callback);

}

function symbol (name) {
    let i = window.main.exports.table.grow(1); //main exports table as "table"
    if (!lazyInstance.exports[name]) {
        throw new Error("Unknown Function name: "+name);
    }
    window.main.exports.table.set(i, lazyInstance.exports[name])
    return i;
}