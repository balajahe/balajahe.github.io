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
				${me} { 
					height: calc(100vh - var(--app-bar-height)); width: 100%;
					display: flex; flex-flow: column; justify-content: center;
				}
				${me}:hover { cursor: pointer; }
				${me} > * { height1: auto; width: 100%; }
			</style>
		`
		wcMixin(this)

		this.onclick = () => history.go(-1)

		APP.db.transaction("Origins").objectStore("Origins").openCursor(IDBKeyRange.only(this.source.created)).onsuccess = (ev) => {
			const origin = ev.target.result?.value

			const el = document.createElement(this.source.tagName)

			if (el.tagName === 'IMG') {
				el.src = origin?.origin ? origin.origin : this.source.origin
			} else {
				el.src = origin?.origin ? URL.createObjectURL(origin.origin) : URL.createObjectURL(this.source.origin)
				el.controls = true
				el.autoplay = true
			}
			if (el.tagName === 'VIDEO') el.onclick = (ev) => ev.stopPropagation()
			
			this.append(el)
		}
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
