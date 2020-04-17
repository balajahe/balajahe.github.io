import WC from '/weird_components/WeirdComponentMixin.js'

const SRV_URL = 'http://127.0.0.1:3000'

customElements.define('mail-sheet', class extends HTMLElement {
   mails = []

   async connectedCallback() {
      this.innerHTML = `
         <div w-name='msgdiv'>Connection to the server...</div>
         <table w-name='mtable'></table>
         <template w-name='/mtempl'>
            <tr>
               <td class='mtd'>
                  <hr>
                  <span w-name='/msubj'>asd</span>
                  <br>
                  <div w-name='/mbody'></div>
               </td>
            </tr>
         </template>
      `
      WC.bind(this)
      this.mails = await (await fetch(SRV_URL + '/all')).json()
      this.msgdiv.remove()
      for (const mail of this.mails) {
         this.msubj = mail.subject
         this.mbody = mail.text ? mail.text : mail.html
         this.mtable.appendChild(this.mtempl)
      }
   }
})
