export const createResourceId = () => {
    const arr = new Uint8Array(12)
    globalThis.crypto.getRandomValues(arr)
    return Array.from(arr, (v) => v.toString(16).padStart(2, '0')).join('')
}

export const createResourceCode = () => {
    const arr = new Uint8Array(8)
    globalThis.crypto.getRandomValues(arr)
    return Array.from(arr, (v) => v.toString(16).padStart(2, '0')).join('')
}
