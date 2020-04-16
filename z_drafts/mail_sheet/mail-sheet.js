import WC from '/weird_components/WeirdComponentMixin.js'

const SRV_URL = 'http://127.0.0.1:3000'

customElements.define('mail-sheet', class extends HTMLElement {
   mails = []

   async connectedCallback() {
      this.innerHTML = `
         <table w-name='mtable'></table>
         <template w-name='mtempl'>
            <tr><td>
               <hr>
               <span id='msubj'></span>
               <br>
               <div id='mhtml'></div>
            </td></tr>
         </template>
      `
      WC.bind(this)
      this.mails = await (await fetch(SRV_URL + '/all')).json()
      console.log(this.mails)
      for (const mail of this.mails) {
         const m = this.mtempl.content.cloneNode(true)
         m.querySelector('#msubj').innerHTML = mail.subject
         m.querySelector('#mhtml').innerHTML = mail.html
         this.mtable.appendChild(m)
      }
   }
})
