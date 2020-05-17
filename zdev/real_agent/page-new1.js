import wcMixin from '/WcMixin/WcMixin.js'

const me = 'page-new1'
customElements.define(me, class extends HTMLElement {

   connectedCallback() {
      this.innerHTML = `
         <style scoped>
            ${me} #_descDiv {
               min-height: 5em;
               border: solid 1px silver;
               margin: var(--margin1); padding-left: var(--margin2);
            }
            ${me} #_labelsDiv { min-height: var(--app-bar-height); }
            ${me} .separ { display: flex; flex-flow: row nowrap; }
            ${me} .separ hr { display: inline-block; flex: 1 1 auto; }
            ${me} #_newLabelInp { width: 30%; }
            ${me} iframe { width: 100%; }
         </style>
         <div w-id='_descDiv/desc' contenteditable='true'></div>
         <div w-id='_labelsDiv/labels/children'></div>
         <div>
            <div class='separ'>&nbsp;<small>Click to add label:</small>&nbsp;<hr/></div>
            <input w-id='_newLabelInp/_newLabel' placeholder='New label...'/>
         </div>
         <iframe w-id='_mapIframe' width="300px" height="300px" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe>
         <div w-id='/_loc'></div>
      `
      //"https://www.openstreetmap.org/export/embed.html?bbox=41.97273110840353%2C45.02658622677895%2C41.97765564415487%2C45.03039272187266&amp;layer=mapnik&amp;marker=45.02848950596824%2C41.97519337627921"
      wcMixin(this)
      //APP.locationCallback = this._showLocation.bind(this)

      if (!localStorage.getItem('labels')) {
         localStorage.setItem('labels', 'Дом,Дача,Участок,Заброшен,Ветхий,Разрушен,Жилой,Продается')
      }
      for (const lab of localStorage.getItem('labels').split(',')) {
         this._addAvailLabel(lab)
      }

      this._newLabelInp.onkeypress = (ev) => {
         if (ev.key === 'Enter') {
            this._addAvailLabel(this._newLabel)
            localStorage.setItem('labels', localStorage.getItem('labels') + ',' + this._newLabel)
            this._newLabel = ''
         }
      }
   }

   _addAvailLabel(lab) {
      const but = document.createElement("button")
      but.innerHTML = lab
      this._newLabelInp.before(but)
      but.onclick = (ev) => {
         const but = document.createElement("button")
         but.onclick = (ev) => ev.target.remove()
         but.innerHTML = ev.target.innerHTML
         this._labelsDiv.appendChild(but)
      }
   }

   _showLocation() {
      if (APP.location) {
         this._loc = APP.location.latitude + ' - ' + APP.location.longitude
         this._mapIframe.src = `https://www.openstreetmap.org/export/embed.html?bbox=${APP.location.longitude-0.002}%2C${APP.location.latitude-0.002}%2C${APP.location.longitude+0.002}%2C${APP.location.latitude+0.002}&amp;layer=mapnik&amp;marker=${APP.location.latitude}%2C${APP.location.longitude}`
      }
   }

   onRoute() {
      this._descDiv.focus()
      this._showLocation()
      this.bubbleEvent('set-bar', {
         msg: 'Enter description and add labels:',
         buts: [{
            html: 'Next<br>&rArr;',
            click: () => {
               if (this.desc) {
                  APP.route('page-new2-video')
               } else {
                  APP.bubbleEvent('set-msg', 'Empty description !')
                  this._descDiv.focus()
               }
            }
         }]
      })
   }
})
