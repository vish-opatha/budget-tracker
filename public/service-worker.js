const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/index.js",
  "/db.js",
  "/manifest.webmanifest",
  "/icons/android-icon-144x144.png",
  "/icons/favicon-96x96.png",
  "/icons/ms-icon-150x150.png",
  "/icons/apple-icon-60x60.png",
];

const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

// install
self.addEventListener("install", function (evt) {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Budget tracker files were pre-cached successfully!");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});
