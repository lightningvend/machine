import { invoke } from "@tauri-apps/api/core";

export const getLightningInvoice = async (amountSats: number) => {
  return await invoke<string>("get_lightning_invoice", { amountSats });
};

export const getProducts = async () => {
  return await invoke<Product[]>("get_products");
};

// TODO: Derive/generate this type from the Rust code to ensure consistency.
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}
