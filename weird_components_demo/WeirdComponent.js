// WeirdComponent.js

export default class extends HTMLElement {
   q(s, i) {
      if (i === undefined) return this.querySelector(s)
      else return this.querySelectorAll(s)[i]
   }

   generateProps() {
      for (const el of this.querySelectorAll('[w-name]')) {
         const wname = el.getAttribute('w-name')
         const wchange = () => {
            let ev = new Event('w-change')
            ev.val = el._getVal()
            el.dispatchEvent(ev)
         }
         const winput = () => {
            let ev = new Event('w-input')
            ev.val = el._getVal()
            el.dispatchEvent(ev)
         }
         Object.defineProperty(this, '_' + wname, { get: () => el })

         if (el.tagName === 'INPUT') {
            if (el.type == 'number') {
               el._getVal = () => Number(el.value)
               el._setVal = (v) => el.value = v
            } else if (el.type == 'date') {
               el._getVal = () => Date.parse(el.value)
               el._setVal = (v) => el.value = v
            } else if (el.type == 'checkbox') {
               el._getVal = () => el.checked
               el._setVal = (v) => el.checked = v
            } else {
               el._getVal = () => el.value
               el._setVal = (v) => el.value = v
            }
            el.addEventListener('input', (ev) => winput())
            el.addEventListener('change', (ev) => wchange())

         } else if (el.tagName === 'SELECT') {
            if (!el.multiple) {
               el._getVal = () => el.value
               el._setVal = (v) => {
                  el.value = v
               }
            } else {
               el._getVal = () => {
                  let res = []
                  for (const op of el.selectedOptions) res.push(op.value)
                  return res
               }
               el._setVal = (v) => {
                  el.value = v
               }
            }
            el.addEventListener('input', (ev) => winput())
            el.addEventListener('change', (ev) => wchange())

         } else if (el.tagName === 'BUTTON') {
            el._getVal = () => el.className === 'true'
            el._setVal = (v) => el.className = '' + v === 'true'
            el.addEventListener('click', (ev) => {
               el._setVal(!el._getVal())
               winput()
               wchange()
            })

         } else {
            el._getVal = () => el.innerHTML
            el._setVal = (v) => el.innerHTML = v
            el.addEventListener('input', (ev) => winput())
            el.addEventListener('blur', (ev) => wchange())
         }

         Object.defineProperty(el, 'val', {
            get: () => el._getVal(),
            set: (v) => { el._setVal(v); wchange() }
         })

         el.addFormula = (ev_type, deps, formula) => {
            for (const dep of deps) {
               dep.addEventListener(ev_type, (() => {
                  el.val = formula()
               }).bind(this))
            }
         }

         Object.defineProperty(this, wname, {
            get: () => el.val,
            set: (v) => el.val = v
         })
      }
   }
}
