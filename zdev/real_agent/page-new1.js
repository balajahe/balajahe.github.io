import wcMixin from '/WcMixin/WcMixin.js'

const me = 'page-new1'
customElements.define(me, class extends HTMLElement {

   async connectedCallback() {
      this.innerHTML = `
         <style scoped>
            ${me} #textDiv {
               min-height: 2.5em;
               border: solid 1px silver;
            }
            ${me} #labels { display: flex; flex-flow: row wrap; }
            ${me} #addLabel { display: flex; flex-flow: row wrap; }
         </style>
         <div w-id='textDiv' contenteditable='true'></div>
         <div w-id='/labels'></div>
         <div w-id='addLabel'></div>
         <label>New label: <input w-id='newLabel'/></label>
      `
      wcMixin(this)

      this.newLabel.onkeypress = (ev) => {
         if (ev.key === 'Enter') {
            const but = document.createElement("button")
            but.innerHTML = this.newLabel.val
            this.newLabel.val = ''
            but.onclick = (ev1) => {
               this.labels += '<span>' + ev1.target.innerHTML + '</span>'
            }
            this.addLabel.appendChild(but)
         }
      }
   }

   async onRoute() {
      this.textDiv.focus()
      const but = document.createElement('button')
      but.innerHTML = 'Next<br>&rArr;'
      but.onclick = () => {
         APP.route('page-new2')
      }
      this.bubbleEvent('set-buts', { custom: [but] })
      this.bubbleEvent('set-msg', 'Enter text description and add labels:')
   }
})
