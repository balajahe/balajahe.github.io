import wcMixin from '/WcMixin/WcMixin.js'

const me = 'page-home'
customElements.define(me, class extends HTMLElement {

   connectedCallback() {
      this.innerHTML = `
         <style scoped>
            ${me} img, video, audio {
               width: calc(20% - var(--margin1) * 1.5);
               margin-top: var(--margin2); margin-left: var(--margin1);
            }
         </style>
         <div w-id='_listDiv'></div>
         <template w-id='/_objTempl'>
            <hr/>
            <div>
               <div w-id='/_labels'></div>
               <div w-id='/_desc'></div>
               <div w-id='_medias'></div>
            </div>
         </template>
         <center w-id='_msg'>
            <hr/>Real Agent is a database of arbitrary objects with geolocation, photos and videos !<hr/>
         </center>
      `
      wcMixin(this)
   }

   _refreshList() {
      this._listDiv.innerHTML = ''
      APP.db.transaction("Objects").objectStore("Objects").openCursor().onsuccess = (ev) => {
         const cursor = ev.target.result
         if (cursor) {
            const obj = cursor.value
            console.log(obj)
            this._desc = obj.desc
            this._labels = obj.labels
            this._medias.innerHTML = ''
            for (const media of obj.medias) {
               const el = document.createElement(media.tagName)
               el.src = URL.createObjectURL(media.blob)
               if (media.tagName === 'IMG') {
               } else {
                  el.controls = true
               }
               this._medias.appendChild(el)
            }
            this._listDiv.appendChild(this._objTempl)
            cursor.continue()
         }
      }
   }

   onRoute() {
      this.bubbleEvent('set-bar', {
         msg: '',
         back: false,
         buts: [{
            html: 'New<br>&rArr;',
            click: () => APP.route('page-new1')
         }]
      })
      if (!APP.db) {
         const dbr = window.indexedDB.open("RealAgent", 1)
         dbr.onerror = (ev) => console.log(ev)
         dbr.onupgradeneeded = (ev) => {
            const db = event.target.result
            db.createObjectStore("Objects", { keyPath: "desc" })
         }
         dbr.onsuccess = (ev) => {
            APP.db = ev.target.result
            this._refreshList()
         }
      } else {
         this._refreshList()
      }
   }
})
