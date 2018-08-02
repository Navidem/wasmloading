#![feature(use_extern_macros, wasm_custom_section, wasm_import_module)]


pub type UntypedFnPointer = *mut ();
extern{
    pub fn load(url_addr: *const u8, url_len: usize, callback: fn());
    pub fn symbol(name_addr: *const u8, name_len: usize) -> UntypedFnPointer;
}
#[no_mangle]
pub extern "C" fn run_load_callback(f: fn()) {
    f()
}