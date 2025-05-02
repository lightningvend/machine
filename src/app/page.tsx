"use client";
import {
  type Product,
  getLightningInvoice,
  getProducts,
} from "@/rustInterface";
import { Moon, Sun, X } from "lucide-react";
import Image from "next/image";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useRef, useState } from "react";
import { BehaviorSubject, from, of } from "rxjs";
import { skip, switchMap } from "rxjs/operators";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [lightningInvoice, setLightningInvoice] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  const selectedProduct$ = useRef(new BehaviorSubject<Product | null>(null));

  // Feed in the selected product to the observable whenever it changes.
  useEffect(() => {
    selectedProduct$.current.next(selectedProduct);
  }, [selectedProduct]);

  // Converts the selected product to a lightning invoice.
  useEffect(() => {
    const sub = selectedProduct$.current
      .pipe(
        // Skip the initial `null` value.
        skip(1),
        // Cancel previous `getLightningInvoice` if a new product is set.
        switchMap((product) =>
          product
            ? from(getLightningInvoice(product.price)) // TODO: Handle if `getLightningInvoice` errors.
            : of(null),
        ),
      )
      .subscribe((invoice) => {
        setLightningInvoice(invoice);
      });

    return () => sub.unsubscribe();
  }, []);

  // Check system preference for dark mode on component mount and set viewport.
  useEffect(() => {
    if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
      setDarkMode(true);
    }

    // Set viewport meta tag for landscape optimization.
    const meta = document.createElement("meta");
    meta.name = "viewport";
    meta.content =
      "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
    document.getElementsByTagName("head")[0].appendChild(meta);
  }, []);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  return (
    <div
      className={`flex h-screen w-full flex-col ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} transition-colors duration-300`}
    >
      {/* Vending Machine Header */}
      <div
        className={`w-full ${darkMode ? "bg-blue-800" : "bg-blue-600"} flex items-center justify-between p-4 text-white`}
      >
        <h1 className="flex-grow text-center font-bold text-3xl">
          Bitcoin Vending Machine
        </h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="rounded-full p-3 transition-colors hover:bg-blue-700"
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <Sun size={28} /> : <Moon size={28} />}
        </button>
      </div>

      {/* Main Content - Landscape Layout */}
      <div className="flex flex-grow overflow-hidden">
        {/* Products Grid - Left Side */}
        <div className="w-3/4 overflow-y-auto p-4">
          <div className="grid grid-cols-4 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className={`${darkMode ? "bg-gray-800 hover:bg-gray-700 active:bg-gray-600" : "bg-white hover:bg-gray-50 active:bg-gray-100"} flex cursor-pointer flex-col items-center rounded-xl p-4 shadow transition-all hover:shadow-lg active:shadow-inner`}
                onClick={() => setSelectedProduct(product)}
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  width={100}
                  height={100}
                  className="mb-2 rounded-lg"
                />
                <h3
                  className={`font-semibold text-lg ${darkMode ? "text-white" : "text-gray-900"}`}
                >
                  {product.name}
                </h3>
                <p
                  className={`${darkMode ? "text-green-400" : "text-green-600"} mt-1 font-medium text-lg`}
                >
                  {formatSatsToStr(product.price)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Information Panel - Right Side */}
        <div
          className={`w-1/4 ${darkMode ? "bg-gray-800" : "bg-gray-200"} flex flex-col justify-between p-6`}
        >
          <div>
            <h2 className="mb-4 font-bold text-2xl">
              Tap any product to purchase using Bitcoin
            </h2>

            <div
              className={`${darkMode ? "bg-gray-700" : "bg-gray-300"} mb-6 rounded-lg p-4`}
            >
              <h3 className="mb-2 font-semibold">How It Works:</h3>
              <ol
                className={`${darkMode ? "text-gray-300" : "text-gray-700"} list-decimal space-y-2 pl-5`}
              >
                <li>Select product</li>
                <li>Scan QR code with your wallet</li>
                <li>Payment confirms instantly</li>
                <li>Collect your product</li>
              </ol>
            </div>
            <p>
              Don't have a lightning-enabled wallet? Try one of these options:
            </p>
            <ul>
              <li className="mt-2 flex items-center">
                <Image
                  src="https://images.crunchbase.com/image/upload/c_pad,h_170,w_170,f_auto,b_white,q_auto:eco,dpr_2/caozkrjjprnbf1yuufp7"
                  alt="Fedi"
                  width={48}
                  height={48}
                  className="mr-2 rounded-lg"
                />
                <p>Fedi</p>
              </li>
              <li className="mt-2 flex items-center">
                <Image
                  src="https://play-lh.googleusercontent.com/-COWRaEnelfOsbaatm7-DfUt_Fp6odGTngBXXdqySg4jkJ1A7eWdpV3fr0a7y9gpCuuZ=w240-h480-rw"
                  alt="Phoenix"
                  width={48}
                  height={48}
                  className="mr-2 rounded-lg"
                />
                <p>Phoenix</p>
              </li>
            </ul>
          </div>

          <div
            className={`${darkMode ? "text-gray-400" : "text-gray-600"} mt-auto text-sm`}
          >
            <p>Proudly powered by Fedimint</p>
            <p>No registration • No KYC • No BS</p>
          </div>
        </div>
      </div>

      {/* Payment Overlay */}
      {selectedProduct && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.6)" }}
        >
          {/* Payment Modal - Landscape Optimized */}
          <div
            className={`${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"} flex w-4/5 max-w-3xl rounded-xl p-6 transition-colors`}
          >
            {/* Product Details - Left Side */}
            <div className="flex w-1/2 flex-col justify-center pr-6">
              <div className="mb-8">
                <h2 className="mb-6 font-bold text-3xl">Pay with Lightning</h2>
                <div className="mb-6 flex items-center">
                  <Image
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    width={100}
                    height={100}
                    className="mr-4 rounded-lg"
                  />
                  <div>
                    <h3 className="mb-2 font-semibold text-2xl">
                      {selectedProduct.name}
                    </h3>
                    <p
                      className={`${darkMode ? "text-green-400" : "text-green-600"} font-bold text-2xl`}
                    >
                      {formatSatsToStr(selectedProduct.price)}
                    </p>
                  </div>
                </div>
                <p
                  className={`${darkMode ? "text-gray-300" : "text-gray-700"} mb-2 text-lg`}
                >
                  Scan the QR code with your Lightning wallet
                </p>
                <p
                  className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  Invoice expires in 10 minutes
                </p>
              </div>

              <button
                onClick={() => setSelectedProduct(null)}
                className={`${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"} mt-auto flex items-center justify-center rounded-xl p-3 transition-colors`}
              >
                <X size={24} className="mr-2" />
                <span className="font-medium">Cancel Purchase</span>
              </button>
            </div>

            {/* QR Code - Right Side */}
            <div className="flex w-1/2 items-center justify-center">
              <div className="rounded-xl bg-white p-6 drop-shadow-xl/40">
                {lightningInvoice ? (
                  <QRCodeCanvas size={300} value={lightningInvoice} />
                ) : (
                  <div className="size-[300px] animate-pulse rounded-lg bg-gray-200" />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const formatSatsToStr = (sats: number) => {
  return `${sats} sats`;
};
