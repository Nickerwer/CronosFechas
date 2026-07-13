export const Storage = {
    get: (key, fallback) => JSON.parse(localStorage.getItem(key)) ?? fallback,
    set: (key, val) => localStorage.setItem(key, JSON.stringify(val))
};