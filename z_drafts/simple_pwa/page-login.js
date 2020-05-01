import wcmixin from './WcMixin.js'

const me = 'page-login'
customElements.define(me, class extends HTMLElement {

   connectedCallback() {
      this.innerHTML = `
         <style scoped>
            ${me} > form { display: flex; flex-direction: column; }
            ${me} input { width: 60vw; }
            ${me} span { width: 60vw; }
         </style>

         <form w-id='loginform'>
            <input w-id='/server' placeholder='IMAP server' value='imap.gmail.com'/>
            <br>
            <input w-id='elUser/user' placeholder='IMAP user'/>
            <br>
            <input w-id='/password' type='password' placeholder='password'/>
            <br>
            <span w-id='/status'></span>
         </form>
      `
      wcmixin(this)
   }

   onDisplay() {
      this.status = ''
      this.elUser.focus()

      const but = document.createElement('button')
      but.innerHTML = 'Log In<br>&rArr;'
      but.onclick = async () => {
         but.disabled = true
         this.status = 'IMAP authorization...'
         try {
            const res = await (await fetch(dom('app-app').SRV_URL
               + `/login?server=${this.server}&user=${this.user}&password=${this.password}`)).json()
            if (res.ok) {
               location.hash = 'page-mail-sheet'
            } else {
               this.status = res.err
            }
         } catch(_) {
            this.status = `IMAP-REST server not found<br>Run: $ ts-node server.ts`
         }
         but.disabled = false
      }
      this.ev('set-butts', { custom: [but] })
   }
})
