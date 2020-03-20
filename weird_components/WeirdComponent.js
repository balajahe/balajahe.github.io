// WeirdComponent.js
// v0.0.1

export default class extends HTMLElement {
   q(s, i) {
      if (i === undefined) return this.querySelector(s)
      else return this.querySelectorAll(s)[i]
   }

   generateProps() {
      for (const el of this.querySelectorAll('[w-name]')) {
         const wchange = () => {
            let ev = new Event('w-change')
            ev.val = el._w_get_val()
            el.dispatchEvent(ev)
         }
         const winput = () => {
            let ev = new Event('w-input')
            ev.val = el._w_get_val()
            el.dispatchEvent(ev)
         }

         if (el.tagName === 'INPUT') {
            if (el.type == 'number') {
               el._w_get_val = () => Number(el.value)
               el._w_set_val = (v) => el.value = v
            } else if (el.type == 'date') {
               el._w_get_val = () => Date.parse(el.value)
               el._w_set_val = (v) => el.value = v
            } else if (el.type == 'checkbox') {
               el._w_get_val = () => el.checked
               el._w_set_val = (v) => el.checked = v
            } else {
               el._w_get_val = () => el.value
               el._w_set_val = (v) => el.value = v
            }
            el.addEventListener('input', (ev) => winput())
            el.addEventListener('change', (ev) => wchange())

         } else if (el.tagName === 'SELECT') {
            if (!el.multiple) {
               el._w_get_val = () => el.value
               el._w_set_val = (v) => {
                  throw 'доделать !'
               }
            } else {
               el._w_get_val = () => {
                  let res = []
                  for (const op of el.selectedOptions) res.push(op.value)
                  return res
               }
               el._w_set_val = (v) => {
                  throw 'доделать !'
               }
            }
            el.addEventListener('input', (ev) => winput())
            el.addEventListener('change', (ev) => wchange())

         } else if (el.tagName === 'TEXTAREA') {
            el._w_get_val = () => el.value
            el._w_set_val = (v) => el.value = v
            el.addEventListener('input', (ev) => winput())
            el.addEventListener('blur', (ev) => wchange())

         } else if (el.tagName === 'BUTTON') {
            el._w_val = false
            el._w_get_val = () => el._w_val
            el._w_set_val = (v) => el._w_val = v
            el.addEventListener('click', (ev) => {
               el._w_val = !el._w_val
               winput()
               wchange()
            })

         } else {
            el._w_get_val = () => el.innerHTML
            el._w_set_val = (v) => el.innerHTML = v
            el.addEventListener('input', (ev) => winput())
            el.addEventListener('blur', (ev) => wchange())
         }

         Object.defineProperty(el, 'val', {
            get: () => el._w_get_val(),
            set: (v) => { el._w_set_val(v); wchange() }
         })
         /*
         el.set_formula = (ev_type, deps, formula) => {
            for (const dep of deps) {
               dep.addEventListener(ev_type, (() => {
                  el.val = formula()
               }).bind(this))
            }
         }
         */
         const [wname, wval] = el.getAttribute('w-name').split('/')
         if (wname) {
            Object.defineProperty(this, wname, { get: () => el })
         }
         if (wval) {
            Object.defineProperty(this, wval, {
               get: () => el.val,
               set: (v) => el.val = v
            })
         }
      }
   }

   setFormula(var_name, ev_name, deps, formula) {
      for (const dep of deps) {
         dep.addEventListener(ev_name, (() => {
            this[var_name] = formula()
         }).bind(this))
      }
      this[var_name] = formula()
   }
}
