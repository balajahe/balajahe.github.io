import WC from '../WeirdComponent.js'

customElements.define('excel-sheet', class extends WC {
   connectedCallback() {
      const w = Number(this.getAttribute('w'))
      const h = Number(this.getAttribute('h'))
      let s = `<table style1='border: 1px solid silver'>`
      for (let y=0; y<h; y++) {
         s += '<tr>'
         for (let x=0; x<w; x++) {
            s += '<td>' + x + '.' + y + '</td>'
         }
         s += '</tr>'
      }
      s += '</table>'
      this.innerHTML = s
   }
})
