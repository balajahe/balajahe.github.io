import WC from '/weird_components/WeirdComponentMixin.js'

customElements.define('excel-sheet', class extends HTMLElement {
   w = 0
   h = 0
   x = 0
   y = 0
   connectedCallback() {
      this.w = Number(this.getAttribute('w'))
      this.h = Number(this.getAttribute('h'))
      let s = `<table w-name='table'>`
      s += `<tr><td></td><td></td>`
      for (let x=0; x<this.w; x++) s += `<td>${x}</td>`
      s += '</tr>'
      s += '<tr><td></td><td></td>'
      for (let x=0; x<this.w; x++) s += `<td></td>`
      s += '</tr>'
      for (let y=0; y<this.h; y++) {
         s += `<tr w-name='y${y}'><td>${y}</td><td></td>`
         for (let x=0; x<this.w; x++) {
            s += `<td></td>`
         }
         s += '</tr>'
      }
      s += '</table>'
      this.innerHTML = s
      WC.bind(this)

      this.x = this.y = 3
      this.cell().className='active'
      document.body.addEventListener('keydown', (ev) => {
         ev.preventDefault()
         this.cell().className=''
         if (ev.keyCode === 37) this.x--
         else if (ev.keyCode === 39) this.x++
         else if (ev.keyCode === 40) this.y++
         else if (ev.keyCode === 38) this.y--
         this.cell().className='active'
      })

      for (let y=0; y<this.h; y++) {
         const tr = this['y' + y]
         tr.on('change', (ev) => {
            let s = 0
            for (const inp of tr.querySelectorAll('input')) s+= inp.value ? Number(inp.value) : 0
            tr.querySelectorAll('td')[1].innerHTML = s
         })
      }
   }

   cell() {
      return this.querySelectorAll('tr')[2+this.y].querySelectorAll('td')[2+this.x]
   }
})
