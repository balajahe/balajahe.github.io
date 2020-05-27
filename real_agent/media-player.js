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

	async connectedCallback() {
		this.innerHTML = `
			<style scoped>
				${me} > * { height: auto; width: 100%; }
				${me} > img:hover { cursor: pointer; }
			</style>
		`
		wcMixin(this)

		console.log(this.source)

		const el = document.createElement(this.source.tagName)
		if (this.source.tagName === 'img') {
			el.src = this.source.origin ? this.source.origin : URL.createObjectURL(this.source.blob)
			this.onclick = () => history.go(-1)
		} else {
			//el.src = URL.createObjectURL(await (await fetch(this.source.origin)).blob())
			el.src = URL.createObjectURL(this.source.origin)
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
