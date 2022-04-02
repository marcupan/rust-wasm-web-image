use base64::{decode, encode};
use image::{load_from_memory, DynamicImage, ImageFormat};
use wasm_bindgen::prelude::*;

use std::io::Cursor;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(js_namespace = console)]
    fn log(s: &str);
}

fn load_image(encoded_file: &str) -> DynamicImage {
    log("init");

    let base64_to_vector = decode(encoded_file).unwrap();
    log("file decoded");

    let image = load_from_memory(&base64_to_vector).unwrap();
    log("file loaded");

    image
}

fn get_data_url(image: DynamicImage, img_format: &str) -> String {
    let image_output_format = ImageFormat::from_extension(img_format).unwrap();

    let mut buffer = Cursor::new(Vec::new());
    image.write_to(&mut buffer, image_output_format).unwrap();
    log("image written");

    let encoded_img = encode(&buffer.get_ref());
    let data_url = format!("data:image/{};base64,{}", img_format, encoded_img);

    data_url
}

#[wasm_bindgen]
pub fn grayscale(encoded_file: &str, img_format: &str) -> String {
    let image = load_image(encoded_file).grayscale();
    log("grayscale applied");

    get_data_url(image, img_format)
}

#[wasm_bindgen]
pub fn flipv(encoded_file: &str, img_format: &str) -> String {
    let image = load_image(encoded_file).flipv();
    log("flipv applied");

    get_data_url(image, img_format)
}

#[wasm_bindgen]
pub fn blur(encoded_file: &str, img_format: &str, sigma: f32) -> String {
    let image = load_image(encoded_file).blur(sigma);
    log("blur applied");

    get_data_url(image, img_format)
}
