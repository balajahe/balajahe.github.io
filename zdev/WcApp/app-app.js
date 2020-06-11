import WcApp from './WcApp.js'
import './app-menu.js'
import './demo-page-home.js'

const me = 'app-app'
customElements.define(me, class extends WcApp {
   user = null
   elapsed = 0

	connectedCallback() {
		super.connectedCallback()

      this.addEventListener('login-change', (ev) => {
         this.user = ev.val.logged ? ev.val.user : ''
         APP.setMessage(this.user ? `Logged as: ${this.user}` : `Not logged: ${ev.val.user}`)
      })

/*      setInterval(() => {
         this.elapsed += 1
         this.drownEvent('notify-timer', this.elapsed)
      }, 1000)
*/
		APP.route('demo-page-home')
	}
})
