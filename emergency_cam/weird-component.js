export default class extends HTMLElement {
    q(s, i) { 
        if (i === undefined)
            return this.querySelector(s)
        else
            return this.querySelectorAll(s)[i]
    }    

    generate_props() {
        for (const el of this.querySelectorAll('[elm]')) {
            Object.defineProperty(this, el.getAttribute('elm'), {
                get: () => el
            })
        }
        for (const el of this.querySelectorAll('[val]')) {
            if (el.tagName === 'INPUT') {
                Object.defineProperty(this, el.getAttribute('val'), {
                    get: () => el.value,
                    set: (val) => el.value = val
                })
            } else if (el.tagName === 'BUTTON') {
                Object.defineProperty(this, el.getAttribute('val'), {
                    get: () => el.className === 'true',
                    set: (val) => el.className = '' + val
                })
            }
        }
        for (const el of this.querySelectorAll('[inh]')) {
            Object.defineProperty(this, el.getAttribute('inh'), {
                get: () => el.innerHTML,
                set: (val) => el.innerHTML = val
            })
        }
    }
}
