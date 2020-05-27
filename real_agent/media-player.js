import wcMixin from '/WcMixin/WcMixin.js'

const me = 'media-player'
customElements.define(me, class extends HTMLElement {
	source = null
	delAction = null

	build(source, delAction) {
		this.source = source
		this.delAction = delAction
		return this
	}

	connectedCallback() {
		this.innerHTML = `
			<style scoped>
				${me} > * { height: auto; min-height: 3em; width: 100%; }
				${me} > img:hover { cursor: pointer; }
			</style>
		`
		wcMixin(this)
		const el = document.createElement(this.source.tagName)
		el.src = this.source.origin
		if (this.source.tagName === 'img') {
			this.onclick = () => history.go(-1)
		} else {
			el.controls = true
			el.autoplay = true
		}
		this.append(el)
	}

   onRoute() {
   	const bar = []
   	if (this.delAction) bar.push(['but', 'Delete<br>&#8224;', () => { 
   		this.delAction()
   		history.go(-1)
   	}])
      APP.setBar(bar.concat([
         ['msg', ''],
         ['back'],
      ]))
   }
})
