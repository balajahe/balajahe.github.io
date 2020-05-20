import wcMixin from '/WcMixin/WcMixin.js'

const me = 'app-img-show'
customElements.define(me, class extends HTMLElement {

   async connectedCallback() {
      this.innerHTML = `
         <style scoped>
            ${me} {
               position: absolute;
               height: 100vh; width: 100vw;
               max-width: var(--app-max-width);
               display: none; flex-flow: column; justify-content: center; align-items: center;
               background-color: black;
            }
            ${me} > img {
               height: auto; width: 100%;
            }
            ${me} > button {
               width: 100%;
            }
         </style>
         <img w-id='img'/>
         <button w-id='delBut'>Delete</button>
      `
      wcMixin(this)

      this.onclick = () => this.display(false)
   }

   show(el, del) {
      this.img.src = URL.createObjectURL(el._blob)
      if (del) {
         this.delBut.onclick = () => del.remove()
         this.delBut.display()
      } else{
         this.delBut.display(false)
      }
      this.display('flex')
   }
})
