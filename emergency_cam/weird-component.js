export default class extends HTMLElement {
    q(s) {
        return this.querySelector(s)
    }
    
    qq(s, i) {
        return this.querySelectorAll(s)[i]
    }

    genGetSet() {
        for (const el of this.querySelectorAll('[el]')) {
            Object.defineProperty(this, el.getAttribute('el'), {
                get: () => el
            })
        }
        for (const el of this.querySelectorAll('[vl]')) {
            if (el.tagName === 'INPUT') {
                Object.defineProperty(this, el.getAttribute('vl'), {
                    get: () => el.value,
                    set: (val) => el.value = val
                })
            } else if (el.tagName === 'BUTTON') {
                Object.defineProperty(this, el.getAttribute('vl'), {
                    get: () => el.className === 'true',
                    set: (val) => el.className = '' + val
                })
            }
        }
        for (const el of this.querySelectorAll('[ih]')) {
            Object.defineProperty(this, el.getAttribute('ih'), {
                get: () => el.innerHTML,
                set: (val) => el.innerHTML = val
            })
        }
    }
}
