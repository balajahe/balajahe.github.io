import WeirdComponent from './weird-component.js'

const API_KEY = 'AIzaSyDWwZB5DbLaT_11i4C7L9Ch_0rslAncDro'
const CLIENT_ID = '62101814784-23re0bkiiihnb99sid30pgt21spu9ubk.apps.googleusercontent.com'

customElements.define('video-sender',
   class extends WeirdComponent {

      connectedCallback() {
         this.innerHTML = `
            <a style="display:none"></a>
            <div ih="log"></div>
         `
         this.genGetSet()
      }

      async connect() {
         await import('https://apis.google.com/js/api.js')
         await new Promise((resolve, reject) => {
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
                  resolve()
               } catch(e) {
                  reject(e)
               }
            })
         })
      }

      async send(to, subject, name, chunk) {
         const a = this.querySelector('a')
         URL.revokeObjectURL(a.href)
         try {
            const reader = new FileReader()
            reader.readAsDataURL(chunk)
            const chunk64 = await new Promise((resolve, reject) => {
               reader.onloadend = () => resolve(reader.result.split(',')[1])
            })
            await this._send_mail(to, subject, 'video/webm; name="' + name + '"', chunk64)
            localStorage.setItem('email', to)
            this.log += '&uarr;'
         } catch(e) {
            console.error(e)
            console.warn('Cannot send email, saving locally !')
            a.href = URL.createObjectURL(chunk)
            a.download = name
            a.click()
            this.log += '&darr;'
         }
      }

      async _send_mail(to, subject, mime_type, body) {
         const headers = {
            'From': '',
            'To': to,
            'Subject': 'Emergency Cam: ' + subject,
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
               if (!res.code) resolve() 
               else reject(res)
            })
         })
      }
   }
)
