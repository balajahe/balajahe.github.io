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
            <input w-id='server' placeholder='IMAP server' value='imap.gmail.com'/>
            &nbsp;
            <input w-id='login' placeholder='IMAP login'/>
            &nbsp;
            <input w-id='pass' type='password' placeholder='password'/>
         </form>
      `
      wcmixin(this)
   }

   onDisplay() {
      this.login.focus()
      this.ev('set-buttons', {ok: {
         text: 'Log In',
         onclick: () => location.hash = 'page-mail-sheet'
      }})
   }
})
