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
            ${me} {
               position: fixed; z-index:10; top1: 0; left1; 0;
               height: 100vh; width: 100vw;
               max-width: var(--app-max-width);
               display: flex; flex-flow: column; justify-content: center; align-items: center;
               background-color: black;
               overflow: scroll;
            }
            ${me} > img { height: auto; width: 100%; }
            ${me} > img:hover { cursor: pointer; }
            ${me} > button { display: none; width: 100%; }
         </style>
         <img w-id='img'/>
         <button w-id='delBut'>Delete</button>
      `
      wcMixin(this)
      this.onclick = () => this.remove()

      this.img.src = this.src
      if (this.delAction) {
         this.delBut.display('inline-block')
         this.delBut.onclick = () => this.delAction()
      }
   }
})
