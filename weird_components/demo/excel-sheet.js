import WC from '../WeirdComponentMixin.js'

customElements.define('excel-sheet', class extends HTMLElement {
   w = 0
   h = 0
   connectedCallback() {
      this.w = Number(this.getAttribute('w'))
      this.h = Number(this.getAttribute('h'))
      let s = '<table>'
      s += '<tr><td></td><td></td>'
      for (let x=0; x<this.w; x++) s += `<td>${x}</td>`
      s += '</tr>'
      s += '<tr><td></td><td></td>'
      for (let x=0; x<this.w; x++) s += `<td></td>`
      s += '</tr>'
      for (let y=0; y<this.h; y++) {
         s += `<tr w-name='y${y}'><td>${y}</td><td></td>`
         for (let x=0; x<this.w; x++) {
            s += `<td><input type='number'/></td>`
         }
         s += '</tr>'
      }
      s += '</table>'
      this.innerHTML = s
      new WC().bind(this)

      for (let y=0; y<this.h; y++) {
         const tr = this['y' + y]
         tr.on('change', (ev) => {
            let s = 0
            for (const td of tr.querySelectorAll('input')) s+= td.value ? Number(td.value) : 0
            tr.querySelectorAll('td')[1].innerHTML = s
         })
      }
   }
})
