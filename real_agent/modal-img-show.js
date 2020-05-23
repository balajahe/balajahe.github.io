import wcMixin from '/WcMixin/WcMixin.js'

const me = 'modal-img-show'
customElements.define(me, class extends HTMLElement {
	src = null
	delAction = null

   build(src, del) {
   	this.src = src
   	this.delAction = del
      return this
   }

   connectedCallback() {
      this.innerHTML = `
         <style scoped>
            ${me} > img { height: auto; width: 100%; }
            ${me} > img:hover { cursor: pointer; }
            ${me} > button { display: none; width: 100%; }
         </style>
         <img w-id='img'/>
         <button w-id='delBut'>Delete</button>
      `
      wcMixin(this)
      this.img.src = this.src
      this.onclick = () => this.remove()
      if (this.delAction) {
         this.delBut.display('inline-block')
         this.delBut.onclick = () => this.delAction()
      }
   }
})
