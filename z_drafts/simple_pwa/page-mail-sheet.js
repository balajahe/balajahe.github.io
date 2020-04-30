import wcmixin from './WcMixin.js'

const me = 'page-mail-sheet'
customElements.define(me, class extends HTMLElement {
   mails = []

   async connectedCallback() {
      this.innerHTML = `
         <div w-id='msgdiv'>Connection to the server...</div>
         <table w-id='mtable'></table>
         <template w-id='/mtempl'>
            <tr>
               <td class='mtd'>
                  <hr>
                  <span w-id='/msubj'>asd</span>
                  <br>
                  <div w-id='/mbody'></div>
               </td>
            </tr>
         </template>
      `
      wcmixin(this)

      this.mails = await (await fetch(dom('app-app').SRV_URL + '/all')).json()
      this.msgdiv.remove()
      for (const mail of this.mails) {
         this.msubj = mail.subject
         this.mbody = mail.text ? mail.text : mail.html
         this.mtable.appendChild(this.mtempl)
      }
   }

   onDisplay() {
      dom('app-bar').setButs({
         ok: (el) => el.disabled = true,
         back: (el) => el.disabled = false,
         home: (el) => el.disabled = false
      })
   }
})
