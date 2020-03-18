// weird-component.js

export default class extends HTMLElement {
   q(s, i) {
      if (i === undefined) return this.querySelector(s)
      else return this.querySelectorAll(s)[i]
   }

   generate_props() {
      for (const el of this.querySelectorAll('[val]')) {
         const name = el.getAttribute('val')
         const vch = (v) => {
            let ev = new Event('val_change')
            ev.val = v
            el.dispatchEvent(ev)
         }
         const vin = (v) => {
            let ev = new Event('val_input')
            ev.val = v
            el.dispatchEvent(ev)
         }
         Object.defineProperty(this, '_' + name, {
            get: () => el
         })

         if (el.tagName === 'INPUT') {

            if (el.type == 'number') {
               Object.defineProperty(this, name, {
                  get: () => Number(el.value),
                  set: (v) => { el.value = v; vch(v) }
               })
               el.addEventListener('input', (ev) => vin(Number(el.value)))

            } else if (el.type == 'date') {
               Object.defineProperty(this, name, {
                  get: () => Date.parse(el.value),
                  set: (v) => { el.value = v; vch(v) }
               })
               el.addEventListener('input', (ev) => vin(Date.parse(el.value)))

            } else if (el.type == 'checkbox') {
               Object.defineProperty(this, name, {
                  get: () => el.checked,
                  set: (v) => { el.checked = v; vch(v) }
               })
               el.addEventListener('input', (ev) => vin(el.checked))

            } else {
               Object.defineProperty(this, name, {
                  get: () => el.value,
                  set: (v) => { el.value = v; vch(v) }
               })
               el.addEventListener('input', (ev) => vin(el.value))
            }

         } else if (el.tagName === 'BUTTON') {
            Object.defineProperty(this, name, {
               get: () => el.className === 'true',
               set: (v) => { el.className = '' + v; vch(v) }
            })
            el.addEventListener('click', (ev) => {
               el.className = '' + el.className !== 'true'
               vin(el.className === 'true')
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
                     vch(v)
                  }
               })
               el.addEventListener('input', (ev) => vin(val(el)))
            } else {
               Object.defineProperty(this, name, {
                  get: () => el.value,
                  set: (v) => { el.value = v; vch(v) } // !!!
               })
               el.addEventListener('input', (ev) => vin(el.value))
            }

         } else {
            Object.defineProperty(this, name, {
               get: () => el.innerHTML,
               set: (v) => { el.innerHTML = v; vch(v) }
            })
            el.addEventListener('input', (ev) => vin(el.innerHTML))
         }
      }
   }
}
