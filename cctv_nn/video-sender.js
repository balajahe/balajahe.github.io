import WC from './weird-component.js'

const API_KEY = 'AIzaSyDWwZB5DbLaT_11i4C7L9Ch_0rslAncDro'
const CLIENT_ID = '62101814784-23re0bkiiihnb99sid30pgt21spu9ubk.apps.googleusercontent.com'

customElements.define('video-sender', class extends WC {
   async init() {
      this.innerHTML = `
         <nav el='nav' style="display:none">
            <input vl='email' type='email' required placeholder='Email to send...'/>
         </nav>
         <div ih='msg'>Connecting to Gmail...<br></div>
         <a el='a' style="display:none"></a>
      `
      this.generate_props()
      this.email = localStorage.getItem('email')

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
            this.msg = ''
            this.nav.style.display = ''
         } catch(e) {
            this.msg = 'Gmail authorization error: ' + JSON.stringify(e, null, 2) + '<br>'
         }
      })
   }

   async send(type, name, chunk) {
      URL.revokeObjectURL(this.a.href)
      try {
         const reader = new FileReader()
         reader.readAsDataURL(chunk)
         const chunk64 = await new Promise((resolve, reject) => {
            reader.onloadend = () => resolve(reader.result.split(',')[1])
         })
         await this.send_mail(type, 'video/webm; name="' + name + '"', chunk64)
         localStorage.setItem('email', this.email)
         this.msg += '&uarr;'
      } catch(e) {
         console.error(e)
         console.warn('Cannot send email, saving locally !')
         this.a.href = URL.createObjectURL(chunk)
         this.a.download = name
         this.a.click()
         this.msg += '&darr;'
      }
   }

   async send_mail(subject, mime_type, body) {
      const headers = {
         'From': '',
         'To': this.email,
         'Subject': 'Balajahe CCTV: ' + subject,
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
})
