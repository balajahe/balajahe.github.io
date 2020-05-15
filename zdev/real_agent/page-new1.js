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
            ${me} input { width: 33%; }
            ${me} .separ { display: flex; flex-flow: row nowrap; }
            ${me} .separ hr { display: inline-block; flex: 1 1 auto; }
         </style>
         <div w-id='_textInp/text' contenteditable='true'></div>
         <div w-id='_labelsDiv' class1='flexwrap'></div>
         <div class='separ'><small>Add label:</small>&nbsp;<hr/></div>
         <div>
            <input w-id='_newLabelInp/_newLabel' placeholder='New label...'/>
         </div>
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
      const but = document.createElement('button')
      but.innerHTML = 'Next<br>&rArr;'
      but.onclick = () => APP.route('page-new2-video')
      this.bubbleEvent('set-buts', { custom: [but] })
      this.bubbleEvent('set-msg', 'Enter description and add some labels:')
   }
})
