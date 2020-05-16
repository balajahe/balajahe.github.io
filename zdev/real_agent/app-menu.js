import wcMixin from '/WcMixin/WcMixin.js'

const me = 'app-menu'
customElements.define(me, class extends HTMLElement {

   connectedCallback() {
      this.innerHTML = `
         <style>
            ${me} {
               position: absolute;
               width: 60%; max-width: calc(var(--app-max-width) * 0.6);
               margin: var(--margin1); padding: 0.5em;
               display: flex; flex-direction: column;
               background-color: LightGrey;
               border-right: solid 2px grey; border-bottom: solid 2px grey;
            }
            ${me} button {flex: 1 1 auto; margin: 0.2em;}
         </style>
         <button w-id='_home'>HOME</button>
         <button w-id='_labels'>Organize labels</button>
         <button w-id='_source'>Sources on GitHub</button>
      `
      wcMixin(this)

      this._home.onclick = () => APP.route('page-home')
      this._labels.onclick = () => APP.route('page-labels')
      this._source.onclick = () => location.href = 'https://github.com/balajahe/balajahe.github.io/tree/master/real_agent'
   }
})
