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
            ${me} iframe { width: 100%; }
         </style>
         <div w-id='_textInp/text' contenteditable='true'></div>
         <div w-id='_labelsDiv'></div>
         <div>
            <div class='separ'><small>Add label:</small>&nbsp;<hr></div>
            <input w-id='_newLabelInp/_newLabel' placeholder='New label...'/>
         </div>
         <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4166.955461487204!2d39.867116297673405!3d43.9442505414373!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40f684d9d934eca5%3A0x85ac36acd4cd77a9!2z0KfQuNCz0YPRgNGB0LDQvdCwLCDQoNC10YHQv9GD0LHQu9C40LrQsCDQkNC00YvQs9C10Y8sIDM4NTc5Nw!5e1!3m2!1sru!2sru!4v1589529205815!5m2!1sru!2sru" width="400" height="300" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0"></iframe>
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

   onRoute() {
      this._textInp.focus()
      this.bubbleEvent('set-bar', {
         msg: 'Enter description, add labels:',
         buts: [{
            html: 'Next<br>&rArr;',
            click: () => APP.route('page-new2-video')
         }]
      })
   }
})
