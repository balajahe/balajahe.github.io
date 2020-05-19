import wcMixin from '/WcMixin/WcMixin.js'

const me = 'page-new1'
customElements.define(me, class extends HTMLElement {

   connectedCallback() {
      this.innerHTML = `
         <style scoped>
            ${me} #descDiv {
               min-height: 5em;
               border: solid 1px silver;
               margin: var(--margin1); padding-left: var(--margin2);
            }
            ${me} #labelsDiv { min-height: var(--app-bar-height); }
            ${me} .separ { display: flex; flex-flow: row nowrap; }
            ${me} .separ hr { display: inline-block; flex: 1 1 auto; }
            ${me} #newLabelInp { width: 30%; }
            ${me} iframe { width: 100%; }
         </style>
         <div w-id='descDiv/desc' contenteditable='true'></div>
         <div w-id='labelsDiv/labels/children'></div>
         <div>
            <div class='separ'>&nbsp;<small>Click to add label:</small>&nbsp;<hr/></div>
            <input w-id='newLabelInp/newLabel' placeholder='New label...'/>
         </div>
         <iframe w-id='mapIframe' width="300px" height="300px" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe>
         <div w-id='/loc'></div>
      `
      //"https://www.openstreetmap.org/export/embed.html?bbox=41.97273110840353%2C45.02658622677895%2C41.97765564415487%2C45.03039272187266&amp;layer=mapnik&amp;marker=45.02848950596824%2C41.97519337627921"
      wcMixin(this)
      //APP.locationCallback = this.showLocation.bind(this)

      if (!localStorage.getItem('labels')) {
         localStorage.setItem('labels', 'Дом,Дача,Участок,Заброшен,Ветхий,Разрушен,Жилой,Продается')
      }
      for (const lab of localStorage.getItem('labels').split(',')) {
         this.addAvailLabel(lab)
      }

      this.newLabelInp.onkeypress = (ev) => {
         if (ev.key === 'Enter') {
            this.addAvailLabel(this.newLabel)
            localStorage.setItem('labels', localStorage.getItem('labels') + ',' + this.newLabel)
            this.newLabel = ''
         }
      }
   }

   addAvailLabel(lab) {
      const but = document.createElement("button")
      but.innerHTML = lab
      this.newLabelInp.before(but)
      but.onclick = (ev) => {
         const but = document.createElement("button")
         but.onclick = (ev) => ev.target.remove()
         but.innerHTML = ev.target.innerHTML
         this.labelsDiv.append(but)
      }
   }

   showLocation() {
      if (APP.location) {
         this.loc = APP.location.latitude + ' - ' + APP.location.longitude
         this.mapIframe.src = `https://www.openstreetmap.org/export/embed.html?bbox=${APP.location.longitude-0.002}%2C${APP.location.latitude-0.002}%2C${APP.location.longitude+0.002}%2C${APP.location.latitude+0.002}&layer=mapnik&marker=${APP.location.latitude}%2C${APP.location.longitude}`
         //this.mapIframe.src = `https://www.openstreetmap.org/?minlon=${APP.location.longitude-0.002}&minlat=${APP.location.latitude-0.002}&maxlon=${APP.location.longitude+0.002}&maxlat=${APP.location.latitude+0.002}&box=yes&mlat=${APP.location.latitude}&mlon=${APP.location.longitude}`
      }
   }

   onRoute() {
      this.descDiv.focus()
      this.showLocation()
      APP.setBar({
         msg: 'Enter description and add labels:',
         buts: [{
            html: 'Next<br>&rArr;',
            click: () => {
               if (this.desc) {
                  APP.route('page-new2-video')
               } else {
                  APP.setMsg('<span style="color:red">Empty description !</span>')
                  this.descDiv.focus()
               }
            }
         }]
      })
   }
})
