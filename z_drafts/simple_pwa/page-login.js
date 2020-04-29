import mix from './WcMixin.js'

const me = 'page-login'
customElements.define(me, class extends HTMLElement {

   async connectedCallback() {
      this.innerHTML += `
         <style scoped>
            ${me} > form { display: flex; flex-direction: column; }
            ${me} input { width: 70vw; }
         </style>

         <form w-id='loginform'>
            <input w-id='/login' placeholder='IMAP login'/>
            &nbsp;
            <input w-id='/pass' type='password' placeholder='password'/>
            &nbsp;
            <input type='submit' value='Log in'/>
         </form>
      `
      mix(this)

      this.loginform.on('submit', (ev) => {
         ev.preventDefault()
         window.location.hash = 'page-login'
      })
   }
})