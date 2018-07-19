#![feature(use_extern_macros, wasm_custom_section, wasm_import_module)]
#![feature(proc_macro)]

extern crate wasm_bindgen;

use wasm_bindgen::prelude::*;
pub type UntypedFnPointer = *mut();
#[wasm_bindgen]
extern{
    pub fn load(url: &str, callback: UntypedFnPointer);
    pub fn symbol(name: &str) -> UntypedFnPointer;
}
#[wasm_bindgen]
pub fn run_load_callback(f: UntypedFnPointer) {
    let f = f as *mut fn();
    unsafe { (*f)() }
}