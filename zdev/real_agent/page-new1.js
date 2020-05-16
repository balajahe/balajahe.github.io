import wcMixin from '/WcMixin/WcMixin.js'

const me = 'page-new1'
customElements.define(me, class extends HTMLElement {

   connectedCallback() {
      this.innerHTML = `
         <style scoped>
            ${me} #_textInp {
               min-height: 3.5em;
               border: solid 1px silver;
            }
            ${me} nav1 { display: flex; flex-flow: row wrap; }
            ${me} .separ { display: flex; flex-flow: row nowrap; }
            ${me} .separ hr { display: inline-block; flex: 1 1 auto; }
            ${me} #_newLabelInp { width: 33%; }
            ${me} iframe { width: 100%; height: auto; }
         </style>
         <div w-id='_textInp/text' contenteditable='true'></div>
         <div w-id='_labelsDiv'></div>
         <div>
            <div class='separ'><small>Add label:</small>&nbsp;<hr></div>
            <input w-id='_newLabelInp/_newLabel' placeholder='New label...'/>
         </div>
         <iframe w-id='_mapIframe' frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://www.openstreetmap.org/export/embed.html?bbox=41.97273110840353%2C45.02658622677895%2C41.97765564415487%2C45.03039272187266&amp;layer=mapnik&amp;marker=45.02848950596824%2C41.97519337627921" style="border: 1px solid black"></iframe>
         <div w-id='/_loc'></div>
      `
      wcMixin(this)

      if (localStorage.getItem('labels')) {
         for (const lab of localStorage.getItem('labels').split(',')) {
            this._addAvailLabel(lab)
         }
      }

      this._newLabelInp.onkeypress = (ev) => {
         if (ev.key === 'Enter') {
            //localStorage.setItem('labels', this._labels)
            this._addAvailLabel(this._newLabel)
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
         this._loc = APP.location.latitude + '<br>' + APP.location.longitude
         this._mapIframe.scr = `https://www.openstreetmap.org/export/embed.html?bbox=${APP.location.longitude-0.002}%2C${APP.location.latitude-0.002}%2C${APP.location.longitude+0.002}%2C${APP.location.latitude+0.002}&amp;layer=mapnik&amp;marker=${APP.location.latitude}%2C${APP.location.longitude}`
      }
   }

   onRoute() {
      this._textInp.focus()
      this._showLocation()
      this.bubbleEvent('set-bar', {
         msg: 'Enter description, add labels:',
         buts: [{
            html: 'Next<br>&rArr;',
            click: () => APP.route('page-new2-video')
         }]
      })
   }
})
