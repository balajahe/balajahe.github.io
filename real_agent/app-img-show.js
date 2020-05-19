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
               display: none; flex-flow: column; justify-content: center; align-items: center;
               background-color: black;
            }
            ${me} > img {
               height: auto; width: 100%; max-width: var(--app-max-width);
            }
            ${me} > button {
               width: 100%; max-width: var(--app-max-width);
            }
         </style>
         <button w-id='delBut'>Delete</button>
         <img w-id='img'/>
      `
      wcMixin(this)

      this.onclick = () => this.display(false)
      this.delBut.onclick = () => this.source.remove()
   }

   show(el, del = false) {
      this.source = el
      this.img.src = URL.createObjectURL(el._blob)
      this.delBut.display(del)
      this.display('flex')
   }
})
