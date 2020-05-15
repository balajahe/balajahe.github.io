import wcMixin from '/WcMixin/WcMixin.js'

const me = 'page-new1'
customElements.define(me, class extends HTMLElement {
   _labels = []

   connectedCallback() {
      this.innerHTML = `
         <style scoped>
            ${me} #textInp {
               min-height: 3.5em;
               border: solid 1px silver;
            }
            ${me} .flexwrap { display: flex; flex-flow: row wrap; }
            ${me} .flexwrap > * { flex: 1 1 auto; }
            ${me} .flexwrap > input { width: 30%; }
            ${me} .separ { display: flex; flex-flow: row nowrap; }
            ${me} .separ hr { display: inline-block; flex: 1 1 auto; }
         </style>
         <div w-id='textInp/text' contenteditable='true'></div>
         <div w-id='labels' class1='flexwrap'></div>
         <div class='separ'>
            <small>Add label:</small>&nbsp;<hr/>
         </div>
         <div class='flexwrap'>
            <input w-id='newLabelInp/newLabel' placeholder='New label...'/>
         </div>
         </label>
      `
      wcMixin(this)

      if (localStorage.getItem('labels')) {
         for (const lab of localStorage.getItem('labels').split(',')) {
            this._addAvailLabel(lab)
            this._labels.push(lab)
         }
      }

      this.newLabelInp.onkeypress = (ev) => {
         if (ev.key === 'Enter') {
            this._labels.push(this.newLabel)
            localStorage.setItem('labels', this._labels)
            this._addAvailLabel(this.newLabel)
            this.newLabel = ''
         }
      }
   }

   _addAvailLabel(lab) {
      const but = document.createElement("button")
      but.innerHTML = lab
      this.newLabelInp.before(but)
      but.onclick = (ev) => {
         const but = document.createElement("button")
         but.onclick = (ev) => ev.target.remove()
         but.innerHTML = ev.target.innerHTML
         this.labels.appendChild(but)
      }
   }

   onRoute() {
      this.textInp.focus()
      const but = document.createElement('button')
      but.innerHTML = 'Next<br>&rArr;'
      but.onclick = () => APP.route('page-new2-video')
      this.bubbleEvent('set-buts', { custom: [but] })
      this.bubbleEvent('set-msg', 'Enter description and add labels:')
   }
})
