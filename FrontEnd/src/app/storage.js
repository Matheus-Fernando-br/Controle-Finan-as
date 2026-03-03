export function getStorage(remember) {
  return remember ? window.localStorage : window.sessionStorage;
}

// adapter compatível com supabase-js
export function createStorageAdapter(storage) {
  return {
    getItem: (key) => storage.getItem(key),
    setItem: (key, value) => storage.setItem(key, value),
    removeItem: (key) => storage.removeItem(key)
  };
}