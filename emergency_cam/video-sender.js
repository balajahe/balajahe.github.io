const API_KEY = 'AIzaSyDWwZB5DbLaT_11i4C7L9Ch_0rslAncDro'
const CLIENT_ID = '62101814784-23re0bkiiihnb99sid30pgt21spu9ubk.apps.googleusercontent.com'

customElements.define('video-sender',
   class extends HTMLElement {
      msg = null
      get email() { return this.querySelector('input').value }
      set email(v) { this.querySelector('input').value = v }

      async connectedCallback() {
         this.innerHTML = `
            <nav id="connect" style="display:none">
               <button style="width:100%">Connect to Gmail</button>
            </nav>
            <nav id="email" style="display:none">
               <input type="email" required placeholder="Email to send..."/>
               <button>Test</button>
            </nav>
            <div></div>
            <a style="display:none"></a>

         `
         this.msg = this.querySelector('div')
         this.email = localStorage.getItem('email')

         this.querySelector('#connect > button').onclick = async (ev) => { 
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
                  this.querySelector('#connect').style.display = 'none'
                  this.querySelector('#email').style.display = ''
               } catch(e) {
                  this.querySelector('#connect').style.display = ''
                  console.error('Gmail authorization error: ' + JSON.stringify(e, null, 2))
               }
            })
         }

         this.querySelector('#email > button').onclick = async (ev) => { 
            try {
               await this.send_mail('Test message', 'text/html; charset="UTF-8"', btoa('Test message'))
               alert('Test message sent.\nCheck your mailbox.')
            } catch(e) {
               console.error(e)
               alert('Error sending email !\n' + e.message)
            }
         }

         this.querySelector('#connect > button').click()
      }

      async send(subject, name, chunk) {
         const a = this.querySelector('a')
         URL.revokeObjectURL(a.href)
         try {
            const reader = new FileReader()
            reader.readAsDataURL(chunk)
            const chunk64 = await new Promise((resolve, reject) => {
               reader.onloadend = () => resolve(reader.result.split(',')[1])
            })
            await this.send_mail(subject, 'video/webm; name="' + name + '"', chunk64)
            this.msg.innerHTML += '&uarr;'
         } catch(e) {
            console.error(e)
            console.warn('Cannot send email, saving locally !')
            a.href = URL.createObjectURL(chunk)
            a.download = name
            a.click()
            this.msg.innerHTML += '&darr;'
         }
      }

      async send_mail(subject, mime_type, body) {
         const headers = {
            'From': '',
            'To': this.email,
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
               if (!res.code) {
                  localStorage.setItem('email', this.email)
                  resolve() 
               } else {
                  reject(res)
               }
            })
         })
      }
   }
)
