import WC from '/weird_components/WeirdComponentMixin.js'

const API_KEY = 'AIzaSyDWwZB5DbLaT_11i4C7L9Ch_0rslAncDro'
const CLIENT_ID = '62101814784-23re0bkiiihnb99sid30pgt21spu9ubk.apps.googleusercontent.com'

customElements.define('video-sender', class extends HTMLElement {
   mails = []
   sending = false

   connectedCallback() {
      this.innerHTML = `
         <div w-name='/log'></div>
         <a w-name='a' style='display:none'></a>
      `
      WC.bind(this)
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
      URL.revokeObjectURL(this.a.href)
      this.a.href = URL.createObjectURL(chunk)
      this.a.download = name
      this.a.click()
      this.log += '&darr;'
      if (to) {
         const reader = new FileReader()
         reader.readAsDataURL(chunk)
         const chunk64 = await new Promise((resolve, reject) => {
            reader.onloadend = () => resolve(reader.result.split(',')[1])
         })
         this.mails.push({subject, name, body: chunk64})
         this._send_all()
      }
   }

   async _send_all() {
      if (!this.sending) {
         this.sending = true
         while(this.mails.length > 0) {
            const mail = this.mails[0]
            try {
               await this._send_mail(mail.subject, mail.name, mail.body)
               this.mails.shift()
               this.log += '&uarr;'
            } catch(e) {
               console.warn(e)
               await new Promise((res, _) => setTimeout(res, 2000))
            }
         }
         this.sending = false
      }
   }

   async _send_mail(subject, name, body) {
      const headers = {
         'From': '',
         'To': document.querySelector('video-recorder').email,
         'Subject': 'Emergency Cam: ' + subject,
         'Content-Type': 'video/webm; name="' + name + '"',
         'Content-transfer-encoding': 'base64'
      }
      let head = ''
      for (const [k, v] of Object.entries(headers)) head += k + ': ' + v + '\r\n'

      const request = gapi.client.gmail.users.messages.send({
         'userId': 'me',
         'resource': {'raw': btoa(head + '\r\n' + body)}
      })
      return new Promise((resolve, reject) => {
         request.execute((res) => {
            if (!res.code) resolve()
            else reject(res)
         })
      })
   }
})
