import wcMixin from '/WcMixin/WcMixin.js'

const me = 'app-img-show'
customElements.define(me, class extends HTMLElement {
   source = null

   async connectedCallback() {
      this.innerHTML = `
         <style scoped>
            ${me} {
               position: fixed; top: 0; left: 0;
               height: 100vh; width: 100vw;
               display: none; flex-flow: column; justify-content: center;
               background-color: black;
            }
            ${me} img {
               height: auto; width: 100%;
               max-height: 80%;
            }
         </style>
         <img w-id='img'/>
         <button w-id='delBut'>Delete</button>
      `
      wcMixin(this)

      this.onclick = () => this.display(false)
      this.delBut.onclick = () => this.source.remove()
   }

   show(el) {
      console.log(el)
      this.source = el
      this.img.src = URL.createObjectURL(el._blob)
      this.display('flex')
   }
})
