// WeirdComponentMixin.js
// v0.0.3
export default class {
   static bind(obj) {
      const wc = new this()
      obj.on = wc.on.bind(obj)
      obj.onAny = wc.onAny.bind(obj)
      obj.generateProps = wc.generateProps.bind(obj)
      obj.generateProps()
   }

   on(ev_type, listener, fire, options) {
      this.addEventListener(ev_type, listener, options)
      if (fire) listener()
   }

   onAny(ev_type, elements, listener, fire, options) {
      for (const el of elements) {
         el.addEventListener(ev_type, listener, options)
      }
      if (fire) listener()
   }

   generateProps() {
      const winput = (ev) => {
         const el = ev.target
         const ev1 = new Event('w-input', {"bubbles":true})
         ev1.val = el._getVal()
         el.dispatchEvent(ev1)
      }
      const wchange = (ev) => {
         const el = ev.target
         const ev1 = new Event('w-change', {"bubbles":true})
         ev1.val = el._getVal()
         el.dispatchEvent(ev1)
      }

      const generate = (el) => {
         if (el._getVal !== undefined) return

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
            } else if (el.type == 'radio') {
               el._getVal = () => el.checked ? el.value : false
               el._setVal = (v) => el.checked = v
            } else {
               el._getVal = () => el.value
               el._setVal = (v) => el.value = v
            }
            el.addEventListener('input', (ev) => winput(ev))
            el.addEventListener('change', (ev) => wchange(ev))

         } else if (el.tagName === 'SELECT') {
            if (!el.multiple) {
               el._getVal = () => el.value
               el._setVal = (v) => el.value = v
            } else {
               el._getVal = () => {
                  let res = []
                  for (const op of el.selectedOptions) res.push(op.value)
                  return res
               }
               el._setVal = (vv) => {
                  for (const op of el.querySelectorAll('option')) {
                     op.selected = vv.includes(op.value)
                  }
               }
            }
            el.addEventListener('input', (ev) => winput(ev))
            el.addEventListener('change', (ev) => wchange(ev))

         } else if (el.tagName === 'TEXTAREA') {
            el._getVal = () => el.value
            el._setVal = (v) => el.value = v
            el.addEventListener('input', (ev) => winput(ev))
            el.addEventListener('blur', (ev) => wchange(ev))

         } else if (el.tagName === 'BUTTON') {
            el._val = false
            el._getVal = () => el._val
            el._setVal = (v) => el._val = v
            el.addEventListener('click', (ev) => {
               el._val = !el._val
               winput(ev)
               wchange(ev)
            })

         } else if (el.tagName === 'TEMPLATE') {
            el._getVal = () => el.content.cloneNode(true)
            el._setVal = (v) => el.content = v
            el.addEventListener('input', (ev) => winput(ev))
            el.addEventListener('blur', (ev) => wchange(ev))

         } else {
            el._getVal = () => el.innerHTML
            el._setVal = (v) => el.innerHTML = v
            el.addEventListener('input', (ev) => winput(ev))
            el.addEventListener('blur', (ev) => wchange(ev))
         }

         try {
            Object.defineProperty(el, 'val', {
               get: () => el._getVal(),
               set: (v) => {
                  el._setVal(v)
                  let ev1 = new Event('w-input', {"bubbles":true})
                  ev1.val = el._getVal()
                  el.dispatchEvent(ev1)
                  ev1 = new Event('w-change', {"bubbles":true})
                  ev1.val = el._getVal()
                  el.dispatchEvent(ev1)
               }
            })
         } catch(e) { console.error(e) }

         const [wname, wval, wval1] = el.getAttribute('w-name').split('/')
         if (wname) {
            try {
               Object.defineProperty(this, wname, { get: () => el })
            } catch(e) { console.error(e) }

            if (el.on === undefined) {
               el.on = (ev_type, listener, fire, options) => {
                  el.addEventListener(ev_type, listener, options)
                  if (fire) listener()
               }
            }

            if (el.display === undefined) {
               el.display = (par = true) => {
                  if (par) {
                     el.style.display = (par === true ? el._oldDisplay !== undefined ? el._oldDisplay : '' : par)
                  } else {
                     el._oldDisplay = el.style.display
                     el.style.display = 'none'
                  }
               }
            } else { throw 'Method "display" already exists in element "' + el.getAttribute('w-name') +'" ' }
         }

         if (wval) {
            try {
               Object.defineProperty(this, wval, {
                  get: () => el.val,
                  set: (v) => el.val = v
               })
            } catch(e) { console.error(e) }
         }

         if (wval1) {
            el.addEventListener('w-change', (ev) =>
               ev.target[wval1] = ev.target.val
            )
         }
      }

      for (const el of this.querySelectorAll('[w-name]')) {
         generate(el)
         if (el.tagName === 'TEMPLATE') {
            for (const el1 of el.content.querySelectorAll('[w-name]')) {
               generate(el1)
            }
         }
      }
   }
}
