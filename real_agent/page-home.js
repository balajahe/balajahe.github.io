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
            ${me} #objDesc:hover, #objLabels:hover { cursor: pointer; }
            ${me} .mediasDiv { 
               display: flex; flex-flow: row wrap; 
               margin-bottom: var(--margin2);
            }
         </style>
         <div w-id='listDiv'></div>
         <center>Real Agent is a database of arbitrary objects with geolocation, photos and videos.</center>
         <template w-id='/objTempl'>
            <div>
               <div id='objLabels'></div>
               <div id='objDesc'></div>
               <div id='objMedias' class='mediasDiv'></div>
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

            div.querySelector('#objLabels').innerHTML = obj.labels
            div.querySelector('#objDesc').innerHTML = obj.desc
            const edit = (obj) => APP.route('page-new2-form', document.createElement('page-new2-form').build(obj))
            div.querySelector('#objLabels').onclick = () => edit(obj)
            div.querySelector('#objDesc').onclick = () => edit(obj)

            const medias = div.querySelector('#objMedias')
            medias.innerHTML = ''
            for (const media of obj.medias) {
               const med = document.createElement(media.tagName)
               med.src = URL.createObjectURL(media.blob)
               med._blob = media.blob
               if (med.tagName === 'IMG') {
                  med.onclick = () => APP.routeModal(document.createElement('modal-img-show').build(med.src))
               } else {
                  med.controls = true
               }

               const div = document.createElement('div')
               div.className = 'smallMedia'
               div.append(med)
               medias.append(div)
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
