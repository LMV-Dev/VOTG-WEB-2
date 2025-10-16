// import { removeSessionStorageIncludeWord } from '@utils/session-control'
// removeSessionStorageIncludeWord(globalThis.sessionStorage, 'svcd-')
export const removeSessionStorageIncludeWord = (sessionStorage, value) => {
    for (let i = 0; i < sessionStorage.length; i++) {
        let key = sessionStorage.key(i)
        if (key.includes(value)) {
            sessionStorage.removeItem(key)
        }
    }
}
