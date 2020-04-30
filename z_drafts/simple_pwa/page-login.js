import wcmixin from './WcMixin.js'

const me = 'page-login'
customElements.define(me, class extends HTMLElement {

   async connectedCallback() {
      this.innerHTML = `
         <style scoped>
            ${me} > form { display: flex; flex-direction: column; }
            ${me} input { width: 60vw; }
         </style>

         <form w-id='loginform'>
            <input w-id='login' placeholder='IMAP login'/>
            &nbsp;
            <input w-id='pass' type='password' placeholder='password'/>
         </form>
      `
      wcmixin(this)
      this.login.focus()

      dom('app-bar').setButs({
         ok: (el) => {
            el.innerHTML = 'Log In<br>&rArr;'
            el.onclick = () => {
               location.hash = 'page-mail-sheet'
            }
         },
         back: (el) => el.disabled = false
      })
   }
})
