const API_KEY = 'AIzaSyDWwZB5DbLaT_11i4C7L9Ch_0rslAncDro'
const CLIENT_ID = '62101814784-23re0bkiiihnb99sid30pgt21spu9ubk.apps.googleusercontent.com'

customElements.define('video-mailer',
   class extends HTMLElement {
      async init() {
         this.innerHTML = `
            <p>Connecting to Gmail...</p>
            <form style="display:none">
               <input type="email" required placeholder="Email to send..."/>
               <input type="submit" value="Test Gmail"/>
            </form>
         `
         await import('https://apis.google.com/js/api.js')
         gapi.load('client:auth2', async () => {
            try {
               await gapi.client.init({
                  apiKey: API_KEY,
                  clientId: CLIENT_ID,
                  discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest'],
                  scope: 'https://www.googleapis.com/auth/gmail.send'
               }) 
               await gapi.auth2.getAuthInstance().signIn()
               this.querySelector('p').remove()
               this.querySelector('form').style.display = ''
            } catch(e) {
               this.querySelector('p').innerHTML = JSON.stringify(e, null, 2)
            }
         })
         this.querySelector('form').onsubmit = async (ev) => { 
            ev.preventDefault()
            alert('Check your mailbox !')
         }
      }

      async send(chunk) {
         console.log(chunk)
         throw 'Cannot send using Gmail, attempt to save locally !'
      }
   }
)
