import wcmixin from './WcMixin.js'

const me = 'app-menu'
customElements.define(me, class extends HTMLElement {

   connectedCallback() {
      this.innerHTML = `
         <style>
            ${me} {
               position: fixed; top: 0;
               height: 90%;
               width: 70%; max-width: calc(var(--max-width) * 0.6);
               margin: var(--margin); padding: 0.5em;
               background-color: LightGrey; border-right: solid 2px grey; border-bottom: solid 2px grey;
            }
            ${me} button {width: 100%; margin-bottom: 0.5em;}
         </style>
         <button w-id='home'>HOME</button>
         <button w-id='source'>Sources on Github</button>
      `
      wcmixin(this)

      this.home.onclick = () => APP.route('page-home')
      this.source.onclick = () => location.href = 'https://github.com/balajahe/balajahe.github.io/tree/master/wc_pwa_template'
   }
})
