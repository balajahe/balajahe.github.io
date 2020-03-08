const API_KEY = 'AIzaSyDWwZB5DbLaT_11i4C7L9Ch_0rslAncDro'
const CLIENT_ID = '62101814784-23re0bkiiihnb99sid30pgt21spu9ubk.apps.googleusercontent.com'

customElements.define('video-mailer',
   class extends HTMLElement {
      async init() {
         this.innerHTML = `
            <p>Connecting to Gmail...</p>
            <form style="display:none">
               <input type="email" required placeholder="Email to send..." value = "balajahe@gmail.com"/>
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
               if (!await gapi.auth2.getAuthInstance().isSignedIn) {
                  await gapi.auth2.getAuthInstance().signIn()
               }
               this.querySelector('p').remove()
               this.querySelector('form').style.display = ''
            } catch(e) {
               this.querySelector('p').innerHTML = 'Gmail authorization error: ' + JSON.stringify(e, null, 2)
            }
         })
         this.querySelector('form').onsubmit = async (ev) => { 
            ev.preventDefault()
            const headers = {
               'From': '',
               'To': this.querySelector('input').value,
               'Subject': 'Balajahe CCTV: ' + new Date().toISOString(),
               'Content-Type': 'text/html; charset="UTF-8"'
            }
            let mail = ''
            for (const [k, v] of Object.entries(headers))  mail += k + ': ' + v + '\r\n'
            mail += '\r\nTest'
            const request = gapi.client.gmail.users.messages.send({
               'userId': 'me',
               'resource': { 'raw': btoa(mail) }
            })
            request.execute((r) => {
               if (r.code) {
                  console.log(r)
                  alert('Error sending message:\n' + r.message)
               } else {
                  alert('Test message sent, check your mailbox !')
               }
            })
         }
      }

      async send(chunk) {
         //console.log(chunk)
         throw 'Cannot send using Gmail, attempt to save locally !'
      }
   }
)
