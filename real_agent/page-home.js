import wcMixin from '/WcMixin/WcMixin.js'

const me = 'page-home'
customElements.define(me, class extends HTMLElement {

   connectedCallback() {
      this.innerHTML = `
         <style scoped>
            ${me} > #listDiv > div {
               border-bottom: 1px solid silver;
               overflow: auto;
            }
            ${me} > center { margin: 1em; }
         </style>
         <div w-id='listDiv'></div>
         <center>Real Agent is a database of arbitrary objects with geolocation, photos and videos.</center>
         <template w-id='/objTempl'>
            <div>
               <div id='objLabels'></div>
               <div id='objDesc'></div>
               <div id='objMedias'></div>
            </div>
         </template>
      `
      wcMixin(this)
   }

   refreshList() {
      this.listDiv.innerHTML = ''
      APP.db.transaction("Objects").objectStore("Objects").openCursor(null,'prev').onsuccess = (ev) => {
         const cursor = ev.target.result
         if (cursor) {
            const obj = cursor.value
            const div = this.objTempl.cloneNode(true)
            div.querySelector('#objDesc').innerHTML = obj.desc
            div.querySelector('#objLabels').innerHTML = obj.labels
            const medias = div.querySelector('#objMedias')
            medias.innerHTML = ''
            for (const media of obj.medias) {
               const el = document.createElement(media.tagName)
               el.src = URL.createObjectURL(media.blob)
               el._blob = media.blob
               el.className = 'smallMedia'
               if (el.tagName === 'IMG') {
                  el.onclick = () => APP.imgShow(el)
               } else if (el.tagName === 'VIDEO') {
                  el.controls = true
                  el.onloadedmetadata = () => el.style.width = 'auto'
               } else {
                  el.controls = true
               }
               medias.append(el)
            }
            this.listDiv.append(div)
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
            click: () => APP.route('page-new1-media')
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
            this.refreshList()
         }
      } else {
         this.refreshList()
      }
   }
})
