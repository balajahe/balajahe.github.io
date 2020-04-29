import wcmixin from '../lib/WcMixin.js'
const SRV_URL = 'http://127.0.0.1:3000'

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
      
      this.mails = await (await fetch(SRV_URL + '/all')).json()
      this.msgdiv.remove()
      for (const mail of this.mails) {
         this.msubj = mail.subject
         this.mbody = mail.text ? mail.text : mail.html
         this.mtable.appendChild(this.mtempl)
      }
   }
})
