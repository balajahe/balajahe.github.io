// WcMixin.js
// v0.1.0
export default function wcmixin(target) {
   target.on = on.bind(target)
   target.onAny = onAny.bind(target)
   target.bubbleEvent = bubbleEvent.bind(target)
   target.drownEvent = drownEvent.bind(target)
   target.display = display.bind(target)
   target.generateProps = generateProps.bind(target)
   target.generateProps()
}

function on(ev_type, listener, fire, options) {
   this.addEventListener(ev_type, listener, options)
   if (fire) listener()
}

function onAny(elements, ev_type, listener, fire, options) {
   for (const el of elements) {
      el.addEventListener(ev_type, listener, options)
   }
   if (fire) listener()
}

function bubbleEvent(name, val) {
   const ev = new Event(name, {"bubbles": true})
   ev.val = val
   this.dispatchEvent(ev)
}

function drownEvent(name, val) {
   const ev = new Event(name, {"bubbles": false})
   ev.val = val
   this.dispatchEvent(ev)
   for (const el of this.querySelectorAll('*')) {
      if (el.generateProps) el.dispatchEvent(ev)
   }
}

function display(par) {
   if (par === false) par = 'none'
   else if (par === true || par === null || par === undefined) par = ''
   this.style.display = par
}

function generateProps() {
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

      const [wid, wval, wval1] = el.getAttribute('w-id').split('/')
      if (wid) {
         try {
            Object.defineProperty(this, wid, { get: () => el })
         } catch(e) { console.error(e) }

         if (!el.id) {
            el.id = wid
         }

         if (el.on === undefined) {
            el.on = on.bind(el)
         }

         if (el.display === undefined) {
            el.display = display.bind(el)
         } else {
            throw 'Method "display" already exists in element "' + el.getAttribute('w-id') +'" '
         }
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

   for (const el of this.querySelectorAll('[w-id]')) {
      generate(el)
      if (el.tagName === 'TEMPLATE') {
         for (const el1 of el.content.querySelectorAll('[w-id]')) {
            generate(el1)
         }
      }
   }
}
