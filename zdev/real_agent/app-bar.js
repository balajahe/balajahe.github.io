import wcMixin from '/WcMixin/WcMixin.js'
import './app-menu.js'

const me = 'app-bar'
customElements.define(me, class extends HTMLElement {

   connectedCallback() {
      this.innerHTML = `
         <style scoped>
            ${me} > button { height: 100%; min-width: 15%; }
            ${me} > #msgSpan {
               flex: 1 1 auto;
               margin-left: 0.5em; margin-right: 0.5em;
               display: flex; justify-content: center; align-items: center; text-align: center;
               overflow: hidden;
            }
         </style>
         <app-menu w-id='appMenu' style='display:none'></app-menu>
         <button w-id='menuBut'>&#9776;</button>
         <button w-id='backBut' disabled>Back<br>&lArr;</button>
         <small w-id='msgSpan/msg'></small>
         <button></button>
      `
      wcMixin(this)

      this.menuBut.onclick = (ev) => {
         ev.stopPropagation()
         this.appMenu.display()
         APP.onclick = () => {
            this.appMenu.display(false)
            APP.onclick = null
         }
      }

      this.backBut.onclick = () => history.go(-1)
   }

   setButs(ev) {
      this.backBut.disabled = ev.val.back === false ? true : false
      for (let b = this.msgSpan.nextSibling; b; b = this.msgSpan.nextSibling) b.remove()
      if (ev.val.custom) for (const b of ev.val.custom) this.appendChild(b)
   }

   setMsg(ev) {
      this.msg = ev.val ? ev.val : ''
   }
})
