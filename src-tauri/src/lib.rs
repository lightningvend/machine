use std::time::Duration;

use tokio::time::sleep;

#[tauri::command]
async fn get_lightning_invoice(_product_id: String) -> String {
    // TODO: Implement via fedimint client.
    sleep(Duration::from_secs(1)).await;
    "lnbc2500u1pvjluezpp5qqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqqqsyqcyq5rqwzqfqypqdq5xysxxatsyp3k7enxv4jsxqzpuaztrnwngzn3kdzw5hydlzf03qdgm2hdq27cqv3agm2awhz5se903vruatfhq77w3ls4evs3ch9zw97j25emudupq63nyw24cg27h2rspfj9srp".to_string()
}

#[tauri::command]
async fn get_products() -> Vec<Product> {
    // TODO: Implement via fedimint client.
    sleep(Duration::from_secs(1)).await;
    vec![
        Product {
            id: "1".to_string(),
            name: "Coca Cola".to_string(),
            price: 100,
            image: "https://www.1001spirits.com/tuotekuvat/1200x1200/Coca%20Cola%20Classic%2024x0%2C33%20l.png".to_string(),
        },
        Product {
            id: "2".to_string(),
            name: "Fiji Water".to_string(),
            price: 80,
            image: "https://m.media-amazon.com/images/I/61jGvBW0nSL._SL1500_.jpg".to_string(),
        }
    ]
}

#[derive(Clone, serde::Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
struct Product {
    id: String,
    name: String,
    price: i32,
    image: String,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            get_lightning_invoice,
            get_products
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
