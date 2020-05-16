import wcMixin from '/WcMixin/WcMixin.js'
import './app-menu.js'

const me = 'app-bar'
customElements.define(me, class extends HTMLElement {

   connectedCallback() {
      this.innerHTML = `
         <style scoped>
            ${me} {
               display: flex; flex-flow: row nowrap;
               overflow: hidden;
            }
            ${me} > button {
               height: calc(100% - var(--margin1) * 2);
               min-width: 20%;
            }
            ${me} > #_msgSpan {
               flex: 1 1 auto;
               margin-left: 0.5em; margin-right: 0.5em;
               display: flex; justify-content: center; align-items: center;
               text-align: center;
               overflow: hidden;
            }
         </style>
         <app-menu w-id='_appMenu' style='display:none'></app-menu>
         <button w-id='_menuBut'>&#9776;</button>
         <small w-id='_msgSpan'></small>
         <button w-id='_backBut' disabled>Back<br>&lArr;</button>
         <button></button>
      `
      wcMixin(this)

      this._menuBut.onclick = (ev) => {
         ev.stopPropagation()
         this._appMenu.display()
         APP.onclick = () => {
            this._appMenu.display(false)
            APP.onclick = null
         }
      }

      this._backBut.onclick = () => history.go(-1)
   }

   setMsg(ev) {
      this._msgSpan.val = ev.val ? ev.val : ''
   }

   setButs(ev) {
      this._backBut.disabled = ev.val.back === false ? true : false
      for (let b = this._backBut.nextSibling; b; b = this._backBut.nextSibling) b.remove()
      if (ev.val.buts) for (const b of ev.val.buts) this.appendChild(b)
   }

   setBar(ev) {
      this._msgSpan.val = ev.val.msg ? ev.val.msg : ''
      this._backBut.disabled = ev.val.back === false ? true : false
      for (let b = this._backBut.nextSibling; b; b = this._backBut.nextSibling) b.remove()
      if (ev.val.buts) for (const b of ev.val.buts) {
         const but = document.createElement('button')
         but.innerHTML = b.html
         but.onclick = b.click
         this.appendChild(but)
      }
   }
})
