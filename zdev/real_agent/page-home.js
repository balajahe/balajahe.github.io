import wcMixin from '/WcMixin/WcMixin.js'

const me = 'page-home'
customElements.define(me, class extends HTMLElement {

   connectedCallback() {
      this.innerHTML = `
         <style scoped>
            ${me} #listDiv > div {
               border-bottom: 1px solid silver;
               overflow: auto;
            }
            center { margin-bottom: 1em; }
         </style>
         <div w-id='listDiv'></div>
         <template w-id='/objTempl'>
            <div>
               <div w-id='/objLabels'></div>
               <div w-id='/objDesc'></div>
               <div w-id='objMedias'></div>
            </div>
         </template>
         <center>
            <br/>Real Agent is a database of arbitrary objects with geolocation, photos and videos !
         </center>
      `
      wcMixin(this)
   }

   _refreshList() {
      this.listDiv.innerHTML = ''
      APP.db.transaction("Objects").objectStore("Objects").openCursor(null,'prev').onsuccess = (ev) => {
         const cursor = ev.target.result
         if (cursor) {
            const obj = cursor.value
            this.objDesc = obj.desc
            this.objLabels = obj.labels
            this.objMedias.innerHTML = ''
            for (const media of obj.medias) {
               const el = document.createElement(media.tagName)
               el.src = URL.createObjectURL(media.blob)
               el._blob = media.blob
               el.className = 'smallMedia'
               if (el.tagName === 'IMG') {
                  el.addEventListener('click', (ev) => {
                     console.log(ev)
                     APP.imgShow(el)
                  })
               } else {
                  el.controls = true
               }
               this.objMedias.append(el)
            }
            this.listDiv.append(this.objTempl)
            cursor.continue()
         }
      }
   }

   onRoute() {
      APP.setBar({
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
            const db = ev.target.result
            db.createObjectStore("Objects", { keyPath: "created" })
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
