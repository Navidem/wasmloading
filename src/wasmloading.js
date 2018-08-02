function fetchAndInstantiate(url, imports = {}) {
    return WebAssembly.instantiateStreaming(fetch(url), imports).then(response => {
      return response.instance;
    }).catch(console.error);
}

function readString(addr, len) {    
    const strBuf = new Uint8Array(window.main.exports.memory.buffer, addr, len);
    console.log(strBuf);
    const str = new TextDecoder("utf-8").decode(strBuf);
    console.log("Read string: "+ str);
    return str;
}

async function load (url_addr, url_len , callback) {
    console.log("callBack func Addr = " + callback);
    let url = readString(url_addr, url_len);
    let instance = await fetchAndInstantiate(url, {main: window.main.exports, env: {load, symbol, console_log_u32: res => console.log("Lazy foo Result: " + res),
        console_log_f64: res => console.log("Lazy bar Result: " + res)}});
    window.lazyInstance = instance;
    window.main.exports.run_load_callback(callback);

}

function symbol (name_addr, name_len) {
    let name = readString(name_addr, name_len);
    let i = window.main.exports.table.grow(1); //main exports table as "table"
    if (!lazyInstance.exports[name]) {
        throw new Error("Unknown Function name: "+name);
    }
    console.log("setting index i of table: " + i)
    console.log("name is: " + lazyInstance.exports[name]);
    window.main.exports.table.set(i, lazyInstance.exports[name])
    return i;
}
