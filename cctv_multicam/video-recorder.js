import WC from '/weird_components/WeirdComponentMixin.js'

const SIGNAL_IP = '127.0.0.1'
const STUN_SRVS = [
   'stun:stun.voipcheap.co.uk:3478',
   'stun:stun.voipcheap.com:3478',
   'stun:stun.voipbuster.com:3478',
   'stun:stun.voipbusterpro.com:3478'
]
const CHUNK_DURATION = 10

customElements.define('video-recorder', class extends HTMLElement {
   rtc = null
   side = ''
   sid = ''
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
            <nav style="white-space:nowrap">
               <label>Signaling IP:<input w-name='/signal_ip'/></label>
               <label>My IP:<input w-name='/my_ip'/></label>
            </nav>
            <button w-name='start_srv'>Start DVR (server)</button>
            <button w-name='start_cli'>Start Videcam (client)</button>
         </nav>
         <template w-name='recdiv'>
            <div class='recdiv'>
               <div w-name='msgdiv/msg'></div>
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
         </template>
      `
/*
      <div w-name='locdiv' id='locdiv' style='display:none; flex-flow:column; position:fixed; top:0; left:0; width:100vw; height:100vh'>
         <button w-name='unlock' style='width:100%; height:4%'>Unlock</button>
         <iframe src='https://ru.wikipedia.org' style='width:100%; height:96%' sandbox='allow-forms allow-scripts'></iframe>
      </div>
*/
      WC.bind(this)
      this.signal_ip = localStorage.getItem('signal_ip')
      if (!this.signal_ip) this.signal_ip = SIGNAL_IP
      this.email = localStorage.getItem('email')


      this.start_srv.on('w-change', async () => {
         this.start()
         this.msg = 'waiting clients...'
         this.side = 'srv'
         const {sid, ip, data: offer} = await this.signal()
         console.log(offer)
         this.sid = sid
         this.my_ip = ip
         //this.rtc = new RTCPeerConnection()
         this.rtc = new RTCPeerConnection({"iceServers": [{"urls": STUN_SRVS}]})
         this.rtc.ontrack = (ev) => {
            console.log(ev)
            this.video.srcObject = ev.streams[0]
         }
         await this.rtc.setRemoteDescription({type: 'offer', sdp: offer})

         const answer = await this.rtc.createAnswer()
         await this.rtc.setLocalDescription(answer)
         const {ok} = await this.signal(encodeURI(answer.sdp))

         this.msgdiv.remove()
         this.exchange_ice()
      })


      this.start_cli.on('w-change', async () => {
         this.start()
         this.msg = 'connecting cam...'
         const stream = await navigator.mediaDevices.getUserMedia(
            {video: {facingMode: {ideal: "environment"}}, audio: true}
         )
         this.video.srcObject = stream

         this.msg = 'connecting signaling server...'
         this.rtc = new RTCPeerConnection({"iceServers": [{"urls": STUN_SRVS}]})
         //this.rtc = new RTCPeerConnection()
         stream.getTracks().forEach(track => this.rtc.addTrack(track, stream))
         const offer = await this.rtc.createOffer()
         await this.rtc.setLocalDescription(offer)
         this.side = 'cli'
         const {sid, ip, ok} = await this.signal(encodeURI(offer.sdp))
         this.sid = sid
         this.my_ip = ip

         const {data: answer} = await this.signal()
         console.log(answer)
         await this.rtc.setRemoteDescription({type: 'answer', sdp: answer})

         this.msgdiv.remove()
         this.exchange_ice()
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
   }

   start() {
      //this.querySelector('#start').remove()
      this.insertAdjacentHTML('beforeend', this.recdiv.innerHTML)
      WC.bind(this)
      localStorage.setItem('signal_ip', this.signal_ip)

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
      }
   }

   async signal(data) {
      let url = `http://${this.signal_ip}:3000/?side=${this.side}&sid=${this.sid}`
      if (data) url += '&data=' + data
      return (await fetch(url)).json()
   }

   async exchange_ice() {
      this.rtc.onicecandidate = async (ev) => {
         if (ev.candidate) {
            //const {ok} = await this.signal(encodeURI(JSON.stringify(ev.candidate)))
            //console.log(ev.candidate)
         }
      }
      const ip = this.side === 'cli' ? this.signal_ip : this.my_ip
      const candidate = {
         candidate: `candidate:2539918381 1 tcp 1518280447 ${ip} 9 typ host tcptype active generation 0 ufrag Zjzo network-id 1 network-cost 50`,
         sdpMid: "0",
         sdpMLineIndex: 0
      }
      this.signal(encodeURI(JSON.stringify(candidate)))
      while (true) {
         const {data: ice} = await this.signal()
         await this.rtc.addIceCandidate(JSON.parse(ice))
         console.log(JSON.parse(ice))
      }
   }
})
