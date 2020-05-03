import wcmixin from './WcMixin.js'

const me = 'page-login'
customElements.define(me, class extends HTMLElement {
   _but = null

   connectedCallback() {
      this.innerHTML = `
         <style scoped>
            ${me} {
               height: 90%; width: 100%;
               display: flex; flex-direction: column;
               justify-content: center; align-items: center;
            }
            ${me} input { width: 60vw; }
         </style>
         <input w-id='userInp/user' placeholder='user'/>
         &nbsp;
         <input w-id='passInp/pass' type='password' placeholder='password'/>
      `
      wcmixin(this)

      this.userInp.oninput = (ev) => {
         this.bubbleEvent('set-msg', 'Not logged: ' + this.user)
      }

      this.passInp.onkeypress = (ev) => {
         if (ev.key === 'Enter') this.login()
      }
   }

   onRoute() {
      this.userInp.focus()
      this._but = document.createElement('button')
      this._but.innerHTML = 'Log in<br>&rArr;'
      this._but.onclick = this.login.bind(this)
      this.bubbleEvent('set-buts', { custom: [this._but] })
   }

   async login() {
      APP.msg = 'Authorization...'
      this._but.disabled = true
      setTimeout(() => {
         this._but.disabled = false
         if (this.user) {
            APP.msg = 'Logged: ' + this.user
            APP.route('page-work')
         } else {
            APP.msg = 'Empty user !'
            this.userInp.focus()
         }
      }, 1500)
   }
})
