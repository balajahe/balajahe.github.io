import wcMixin from '/WcMixin/WcMixin.js'

const me = 'page-new'
customElements.define(me, class extends HTMLElement {

   async connectedCallback() {
      this.innerHTML = `
         <style scoped>
            ${me} {
               display: flex; flex-flow: row wrap;
            }
            ${me} > * {
               margin: 0.3em;
            }
            ${me} > #textDiv {
               min-height: 2.5em; width: 100%;
               border: solid 1px silver;
            }
            ${me} > video {
               width: calc(100% - 0.6em);
            }
         </style>
         <div w-id='textDiv/text' contenteditable='true'></div>
         <nav>
            <button>Take photo</button>
            <button>Record audio</button>
            <button>Record video</button>
         </nav>
         <video w-id='video' autoplay muted></video>
      `
      wcMixin(this)

      const stream = await navigator.mediaDevices.getUserMedia(
         {video: {facingMode: {ideal: "environment"}}, audio: true}
      )
       this.video.srcObject = stream
   }

   async onRoute() {
      this.textDiv.focus()
      //document.execCommand('selectAll',false,null)
      const but = document.createElement('button')
      but.innerHTML = 'Save<br>&rArr;'
      but.onclick = () => {
         APP.route('page-home')
         this.bubbleEvent('set-msg', 'Saved !')
      }
      this.bubbleEvent('set-buts', { custom: [but] })
      this.bubbleEvent('set-msg', 'Enter text description and take a photo, audio or video:')
   }
})
