import * as WcMixin from '/WcApp/WcMixin.js'
import WcAppMenu from '/WcApp/WcAppMenu.js'

const me = 'app-menu'
customElements.define(me, class extends WcAppMenu {

	connectedCallback() {
		super.connectedCallback()

		WcMixin.addAdjacentHTML(this, `
			<button w-id='props'>Properties setup</button>
			<!--<button w-id='export'>Export database</button>-->
			<button w-id='source'>Sources on GitHub</button>
			<a w-id='a' style='display:none'></a>
		`)

		this.props.onclick = () => APP.routeModal('props-setup')

		//this.export.onclick = async () => await this.exportDb()

		this.source.onclick = () => location.href = 'https://github.com/balajahe/balajahe.github.io/tree/master/real_agent'
	}

	async exportDb() {
		const now = (new Date()).toISOString().replace(/:/g, '-').replace(/T/g, '--').slice(0, -5)
		const res = []
		await new Promise(resolve => {
			APP.db.transaction("Objects").objectStore("Objects").openCursor(null,'next').onsuccess = (ev) => {
				const cur = ev.target.result
				if (cur) {
					res.push(cur.value)
					cur.continue()
				} else resolve()
			}
		})
		for (const obj of res) {
			for (const media of obj.medias) {
				const reader = new FileReader()
				reader.readAsDataURL(media.blob)
				const blob64 = await new Promise(resolve => {
					reader.onloadend = () => resolve(reader.result)
				})
				media.blob = blob64
			}
		}
		console.log(res)
		console.log(JSON.stringify(res))
		console.log(JSON.parse(JSON.stringify(res)))
		const blob = new Blob([ JSON.stringify(res) ], { type : 'application/json' })
		URL.revokeObjectURL(this.a.href)
		this.a.href = URL.createObjectURL(blob)
		this.a.download = 'RealAgent--' + now + '.json'
		this.a.click()
	}
})
