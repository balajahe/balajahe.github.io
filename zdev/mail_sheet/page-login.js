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
            <input w-id='userInp/user' placeholder='IMAP user'/>
            <br>
            <input w-id='/password' type='password' placeholder='password'/>
            <br>
            <span w-id='/msg'></span>
         </form>
      `
      wcmixin(this)
      this.user = localStorage.getItem('user')
      this.password = localStorage.getItem('password')
   }

   onRoute() {
      this.userInp.focus()

      const but = document.createElement('button')
      but.innerHTML = 'Log In<br>&rArr;'
      but.onclick = async () => {
         but.disabled = true
         localStorage.setItem('user', this.user)
         localStorage.setItem('password', this.password)
         this.msg = 'IMAP authorization...'
         try {
            const res = await (await fetch(
               APP.SRV_URL + `/login?server=${this.server}&user=${this.user}&password=${this.password}`
            )).json()
            if (res.ok) {
               this.msg = ''
               APP.route('page-mail-sheet')
            } else {
               this.msg = res.err
            }
         } catch(_) {
            this.msg = `IMAP-REST server not found<br>Run: $ ts-node server.ts`
         }
         but.disabled = false
      }

      this.bubbleEvent('set-buts', { custom: [but] })
   }
})
