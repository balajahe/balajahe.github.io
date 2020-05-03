import wcmixin from './WcMixin.js'

const me = 'page-login'
customElements.define(me, class extends HTMLElement {

   connectedCallback() {
      this.innerHTML = `
         <style scoped>
            ${me} {
               height: 90%; width: 100%;
               display: flex; flex-direction: column;
               justify-content: center; align-items: center;
            }
            ${me} > form { display: flex; flex-direction: column; }
            ${me} input { width: 60vw; }
            ${me} div { width: 60vw; height: 3em;}
         </style>
         <form w-id='loginform'>
            <input w-id='userInp/user' placeholder='user'/>
            &nbsp;
            <input w-id='/password' type='password' placeholder='password'/>
         </form>
      `
      wcmixin(this)

      this.userInp.oninput = (ev) => {
         this.bubbleEvent('set-msg', 'Not logged: ' + this.user)
      }
   }

   onRoute() {
      this.userInp.focus()
      const but = document.createElement('button')
      but.innerHTML = 'Log in'
      but.onclick = async () => {
         APP.msg = 'Authorization...'
         but.disabled = true
         setTimeout(() => {
            APP.msg = 'Logged: ' + this.user
            but.disabled = false
            APP.route('page-work')
         }, 1500)
      }
      this.bubbleEvent('set-buts', { custom: [but] })
   }
})
