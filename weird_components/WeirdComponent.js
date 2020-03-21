// WeirdComponent.js
// v0.0.1

export default class extends HTMLElement {
   q(s, i) {
      if (i === undefined) return this.querySelector(s)
      else return this.querySelectorAll(s)[i]
   }

   generateProps() {
      const winput = (el) => {
         const ev1 = new Event('w-input')
         ev1.val = el._getVal()
         el.dispatchEvent(ev1)
      }
      const wchange = (el) => {
         const ev1 = new Event('w-change')
         ev1.val = el._getVal()
         el.dispatchEvent(ev1)
      }

      for (const el of this.querySelectorAll('[w-name]')) {
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
            el.addEventListener('input', (ev) => winput(el))
            el.addEventListener('change', (ev) => wchange(el))

         } else if (el.tagName === 'SELECT') {
            if (!el.multiple) {
               el._getVal = () => el.value
               el._setVal = (v) => {
                  throw 'доделать !'
               }
            } else {
               el._getVal = () => {
                  let res = []
                  for (const op of el.selectedOptions) res.push(op.value)
                  return res
               }
               el._setVal = (v) => {
                  throw 'доделать !'
               }
            }
            el.addEventListener('input', (ev) => winput(el))
            el.addEventListener('change', (ev) => wchange(el))

         } else if (el.tagName === 'TEXTAREA') {
            el._getVal = () => el.value
            el._setVal = (v) => el.value = v
            el.addEventListener('input', (ev) => winput(el))
            el.addEventListener('blur', (ev) => wchange(el))

         } else if (el.tagName === 'BUTTON') {
            el._val = false
            el._getVal = () => el._val
            el._setVal = (v) => el._val = v
            el.addEventListener('click', (ev) => {
               el._val = !el._val
               winput(el)
               wchange(el)
            })

         } else {
            el._getVal = () => el.innerHTML
            el._setVal = (v) => el.innerHTML = v
            el.addEventListener('input', (ev) => winput(el))
            el.addEventListener('blur', (ev) => wchange(el))
         }

         Object.defineProperty(el, 'val', {
            get: () => el._getVal(),
            set: (v) => { el._setVal(v); wchange(el) }
         })

         const [wname, wval] = el.getAttribute('w-name').split('/')
         if (wname) {
            Object.defineProperty(this, wname, { get: () => el })
            el.on = (ev_name, listener) => el.addEventListener(ev_name, listener)
            el.show = (onoff = true) => {
               if (onoff) {
                  el.style.display = onoff === true ? el._saveDisplay !== undefined ? el._saveDisplay : '' : onoff
               } else {
                  el._saveDisplay = el.style.display
                  el.style.display = 'none'
               }
            }
         }
         if (wval) {
            Object.defineProperty(this, wval, {
               get: () => el.val,
               set: (v) => el.val = v
            })
         }
      }
   }

   on(ev_name, deps, listener, fire) {
      for (const dep of deps) {
         dep.addEventListener(ev_name, listener)
      }
      if (fire) listener()
   }
}
