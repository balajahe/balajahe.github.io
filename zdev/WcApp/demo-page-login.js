import wcMixin from './WcMixin.js'

const me = 'demo-page-login'
customElements.define(me, class extends HTMLElement {

   connectedCallback() {
      this.innerHTML = `
         <style scoped>
            ${me} {
               height: 90%; width: 100%;
               display: flex; flex-direction: column;
               justify-content: center; align-items: center;
            }
            ${me} input { width: 60%; }
         </style>

         <input w-id='userInp/user' placeholder='user'/>
         &nbsp;
         <input w-id='passInp/pass' type='password' placeholder='password'/>
      `
      wcMixin(this)

      this.appBar = [
         ['sep'],
         ['back'],
         ['next', (ev) => this.login(ev)]
      ]

      this.userInp.oninput = (ev) => {
         this.bubbleEvent('login-change', { logged: false, user: this.user })
      }

      this.passInp.onkeypress = (ev) => {
         if (ev.key === 'Enter') this.login(ev)
      }
   }

   onRoute() {
      this.userInp.focus()
   }

   async login(ev) {
      APP.message('Authorization...')
      ev.target.disabled = true
      setTimeout(() => {
         ev.target.disabled = false
         if (this.user) {
            this.bubbleEvent('login-change', { logged: true, user: this.user })
            APP.route('page-work')
         } else {
            APP.message('Empty user !')
            this.userInp.focus()
         }
      }, 1500)
   }
})
