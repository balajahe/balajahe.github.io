import wcmixin from './WcMixin.js'

const me = 'page-login'
customElements.define(me, class extends HTMLElement {

   connectedCallback() {
      this.innerHTML = `
         <style scoped>
            ${me} > form { display: flex; flex-direction: column; }
            ${me} input { width: 60vw; }
         </style>

         <form w-id='loginform'>
            <input w-id='/server' placeholder='IMAP server' value='imap.gmail.com'/>
            &nbsp;
            <input w-id='userInp/user' placeholder='IMAP login'/>
            &nbsp;
            <input w-id='/password' type='password' placeholder='password'/>
         </form>
      `
      wcmixin(this)
   }

   onDisplay() {
      this.userInp.focus()
      this.ev('set-buttons', {ok: {
         text: 'Log In',
         onclick: this.login
      }})
   }

   async login(but) {
      location.hash = 'page-mail-sheet'
   }
})
