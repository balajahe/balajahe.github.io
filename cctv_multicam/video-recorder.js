import WC from '/weird_components/WeirdComponentMixin.js'

const CHUNK_DURATION = 10

customElements.define('video-recorder', class extends HTMLElement {
   signaling = 'http://localhost:3000/'
   rtc = null
   location = null
   recorder = {
      rec: null,
      interval: null,
      setInterval: () => {
         this.recorder.interval = setInterval(() => {
            this.recorder.rec.stop()
            this.recorder.rec.start()
         }, CHUNK_DURATION * 1000)
      },
      clearInterval: () => clearInterval(this.recorder.interval)
   }

   async connectedCallback() {
      this.innerHTML = `
         <nav id='start'>
            <button w-name='start_srv'>Start DVR (server)</button>
            <button w-name='start_cli'>Start Videcam (client)</button>
         </nav>
         <div w-name='recdiv' id='recdiv' style='display:none; flex-flow:column'>
            <video w-name='video' autoplay muted></video>
            <nav style='display:flex; flex-flow:row nowrap'>
               <button w-name='rec/recording/className' style='flex-grow:3'>Start / Stop translating</button>
               &nbsp;<button w-name='/noemail/className' style='flex-grow:1'>No email</button>
               &nbsp;<button w-name='no_chunk/nochunk/className' style='flex-grow:1'>No chunk</button>
               &nbsp;<button w-name='lock' style='flex-grow:1'>Lock</button>
            </nav>
            <button w-name='gmail' style='display:none'>Connect to Gmail</button>
            <input w-name='/email' type='email' required placeholder='Email to send...'/>
         </div>
      `
/*
      <div w-name='locdiv' id='locdiv' style='display:none; flex-flow:column; position:fixed; top:0; left:0; width:100vw; height:100vh'>
         <button w-name='unlock' style='width:100%; height:4%'>Unlock</button>
         <iframe src='https://ru.wikipedia.org' style='width:100%; height:96%' sandbox='allow-forms allow-scripts'></iframe>
      </div>
*/
      WC.bind(this)
      this.email = localStorage.getItem('email')

      this.start_srv.on('w-change', async () => {
         const {sid, data: offer} = await (await fetch(this.signaling + '?sid=srv')).json()
         this.rtc = new RTCPeerConnection(
            {configuration: {offerToReceiveAudio: true, offerToReceiveVideo: true}}
         )
         await this.rtc.setRemoteDescription({type: 'offer', sdp: offer})

         const answer = await this.rtc.createAnswer()
         await this.rtc.setLocalDescription(answer)
         const {ok} = await (await fetch(this.signaling + '?sid=' + sid + '&data=' + encodeURI(answer.sdp))).json()
/*
         this.rtc.onaddstream = (ev) => {
            console.log(ev)
            this.video.srcObject = ev.stream
         }
*/
         this.rtc.onicecandidate = async (ev) => {
            if (ev.candidate) {
               //console.log(ev.candidate)
               const {ok} = await (await fetch(this.signaling + '?sid=' + sid + '&data=' + encodeURI(JSON.stringify(ev.candidate)))).json()
            }
         }
         const {data: ice} = await (await fetch(this.signaling + '?sid=' + sid)).json()
         console.log(JSON.parse(ice))
         await this.rtc.addIceCandidate(JSON.parse(ice))
      })

      this.start_cli.on('w-change', async () => {
         const stream = await navigator.mediaDevices.getUserMedia(
            {video: {facingMode: {ideal: "environment"}}, audio: true}
         )
         this.video.srcObject = stream

         this.rtc = new RTCPeerConnection()
         stream.getTracks().forEach(track => this.rtc.addTrack(track, stream))
         const offer = await this.rtc.createOffer()
         await this.rtc.setLocalDescription(offer)
         const {sid, ok} = await (await fetch(this.signaling + '?sid=cli&data=' + encodeURI(offer.sdp))).json()

         const {data: answer} = await (await fetch(this.signaling + '?sid=' + sid)).json()
         await this.rtc.setRemoteDescription({type: 'answer', sdp: answer})

         this.rtc.onicecandidate = async (ev) => {
            if (ev.candidate) {
               //console.log(ev.candidate)
               const {ok} = await (await fetch(this.signaling + '?sid=' + sid + '&data=' + encodeURI(JSON.stringify(ev.candidate)))).json()
            }
         }
         const {data: ice} = await (await fetch(this.signaling + '?sid=' + sid)).json()
         console.log(JSON.parse(ice))
         await this.rtc.addIceCandidate(JSON.parse(ice))
      })

/*
      this.recorder.rec = new MediaRecorder(stream, {mimeType : "video/webm"})
      this.recorder.rec.ondataavailable = async (ev) => {
         const date = new Date().toISOString().replace(/:/g, '.').replace(/T/g, ', ').slice(0, -5)
         const subj = this.location?.latitude + ', ' + this.location?.longitude
         let name = '__' + date + ', ' + subj + '.webm'
         console.log(name)
         if (!this.noemail) {
            document.querySelector('video-sender').send(this.email, subj, name, ev.data)
            localStorage.setItem('email', this.email)
         } else {
            document.querySelector('video-sender').send(null, subj, name, ev.data)
         }
      }
*/

      this.gmail.on('w-change', async (_) => {
         try {
            await document.querySelector('video-sender').connect()
            this.gmail.display(false)
         } catch(e) {
            console.error(e)
            this.gmail.display()
         }
      })
      //this.gmail.click()

      this.rec.on('w-change', (_) => {
         if (this.recording) {
            this.recorder.rec.start()
            if (!this.nochunk) this.recorder.setInterval()
         } else {
            this.recorder.rec.stop()
            this.recorder.clearInterval()
         }
      })
      //this.rec.click()

      this.no_chunk.on('w-change', (ev) => {
         if (this.nochunk) {
            this.recorder.clearInterval()
         } else {
            this.recorder.setInterval()
         }
      })

      //this.lock.on('w-change', (ev) => this.locdiv.display('flex'))
      //this.unlock.on('w-change', (ev) => this.locdiv.display(false))

      navigator.geolocation.getCurrentPosition(
         (loc) => this.location = loc.coords
      )
      navigator.geolocation.watchPosition(
         (loc) => this.location = loc.coords
      )

      this.video.onloadedmetadata = (ev) => {
         //this.querySelector('#start').remove()
         this.recdiv.display('flex')
      }
   }
})
