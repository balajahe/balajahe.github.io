import wcmixin from './WcMixin.js'

const me = 'page-mail-sheet'
customElements.define(me, class extends HTMLElement {
   mails = []

   connectedCallback() {
      this.innerHTML = `
         <div w-id='msgdiv'>Receiving emails...</div>
         <table w-id='mtable'></table>
         <template w-id='/mtempl'>
            <tr>
               <td class='mtd'>
                  <hr>
                  <strong w-id='/msubj'></strong>
                  <br>
                  <div w-id='/mbody'></div>
               </td>
            </tr>
         </template>
      `
      wcmixin(this)
   }

   async onDisplay() {
      this.ev('set-butts', {})
      this.mails = await (await fetch(dom('app-app').SRV_URL + '/get_all')).json()
      this.msgdiv.remove()
      for (const mail of this.mails) {
         this.msubj = mail.subject
         this.mbody = mail.text ? mail.text : mail.html
         this.mtable.appendChild(this.mtempl)
      }
   }
})
