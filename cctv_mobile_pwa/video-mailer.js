const API_KEY = 'AIzaSyDWwZB5DbLaT_11i4C7L9Ch_0rslAncDro'
const CLIENT_ID = '62101814784-23re0bkiiihnb99sid30pgt21spu9ubk.apps.googleusercontent.com'

customElements.define('video-mailer',
   class extends HTMLElement {
      get email() { return this.querySelector('input').value }

      async init() {
         this.innerHTML = `
            <p>Connecting to Gmail...</p>
            <form style="display:none">
               <input type="email" required placeholder="Email to send..." value = "balajahe@gmail.com"/>
               <input type="submit" value="Test"/>
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
               if (!gapi.auth2.getAuthInstance().isSignedIn.je) {
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
            try {
               await this.send_mail('text/html; charset="UTF-8"', btoa('Test message'))
               alert('Test email sent.\nCheck your mailbox.')
            } catch(e) {
               console.error(e)
               alert('Error sending email !\n' + e.message)
            }
         }
      }

      async send(chunk) {
         const reader = new FileReader()
         reader.readAsDataURL(chunk)
         const chunk1 = await new Promise((resolve, reject) => {
            reader.onloadend = () => resolve(reader.result.split(',')[1])
         })
         await this.send_mail('video/webm', chunk1)
      }

      async send_mail(mime_type, body) {
         const headers = {
            'From': '',
            'To': this.email,
            'Subject': 'Balajahe CCTV: ' + new Date().toISOString(),
            'Content-Type': mime_type,
            'Content-transfer-encoding': 'base64'
         }
         let head = ''
         for (const [k, v] of Object.entries(headers)) head += k + ': ' + v + '\r\n'
         const request = gapi.client.gmail.users.messages.send({
            'userId': 'me',
            'resource': { 'raw': btoa(head + '\r\n' + body) }
         })
         return new Promise((resolve, reject) => {
            request.execute((res) => {
               if (!res.code) {
                  resolve() 
               } else { 
                  reject(res)
               }
            })
         })
      }
   }
)
