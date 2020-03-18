// weird-component.js

export default class extends HTMLElement {
   q(s, i) {
      if (i === undefined) return this.querySelector(s)
      else return this.querySelectorAll(s)[i]
   }

   generate_props() {
      for (const el of this.querySelectorAll('[val]')) {
         const name = el.getAttribute('val')
         const ch = (v) => el.dispatchEvent(new CustomEvent('ch', { val: v }))
         Object.defineProperty(this, name + '_el', {
            get: () => el
         })

         if (el.tagName === 'INPUT') {

            if (el.type == 'number') {
               Object.defineProperty(this, name, {
                  get: () => Number(el.value),
                  set: (v) => { el.value = v; ch(v) }
               })
               el.addEventListener('input', (ev) => el.dispatchEvent(new CustomEvent('ch', { val: Number(el.value) })))

            } else if (el.type == 'date') {
               Object.defineProperty(this, name, {
                  get: () => Date.parse(el.value),
                  set: (v) => { el.value = v; ch(v) }
               })
               el.addEventListener('input', (ev) => el.dispatchEvent(new CustomEvent('ch', { val: Date.parse(el.value) })))

            } else if (el.type == 'checkbox') {
               Object.defineProperty(this, name, {
                  get: () => el.checked,
                  set: (v) => { el.checked = v; ch(v) }
               })
               el.addEventListener('input', (ev) => el.dispatchEvent(new CustomEvent('ch', { val: el.checked })))

            } else {
               Object.defineProperty(this, name, {
                  get: () => el.value,
                  set: (v) => { el.value = v; ch(v) }
               })
               el.addEventListener('input', (ev) => el.dispatchEvent(new CustomEvent('ch', { val: el.value })))
            }

         } else if (el.tagName === 'BUTTON') {
            Object.defineProperty(this, name, {
               get: () => el.className === 'true',
               set: (v) => { el.className = '' + v; ch(v) }
            })
            el.addEventListener('click', (ev) => {
               el.className = '' + el.className !== 'true'
               el.dispatchEvent(new CustomEvent('ch', { val: el.className === 'true' }))
            })

         } else if (el.tagName === 'SELECT') {
            const val = (el) => {
               let res = []
               for (const op of el.selectedOptions) res.push(op.value)
               return res
            }
            if (el.multiple) {
               Object.defineProperty(this, name, {
                  get: () => val(el),
                  set: (v) => {
                     // доделать !!! el.value = v
                     ch(v)
                  }
               })
               el.addEventListener('input', (ev) => el.dispatchEvent(new CustomEvent('ch', { val: val(el) })))
            } else {
               Object.defineProperty(this, name, {
                  get: () => el.value,
                  set: (v) => { el.value = v; ch(v) } // !!!
               })
               el.addEventListener('input', (ev) => el.dispatchEvent(new CustomEvent('ch', { val: el.value })))
            }

         } else {
            Object.defineProperty(this, name, {
               get: () => el.innerHTML,
               set: (v) => { el.innerHTML = v; ch(v) }
            })
            el.addEventListener('input', (ev) => el.dispatchEvent(new CustomEvent('ch', { val: el.innerHTML })))
         }
      }
   }
}
