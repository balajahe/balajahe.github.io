import wcMixin from '/WcMixin/WcMixin.js'
import './labels-organize.js'

const me = 'app-menu'
customElements.define(me, class extends HTMLElement {

	connectedCallback() {
		this.innerHTML = `
			<style>
				${me} {
					position: absolute;
					width: 70%; max-width: calc(var(--app-max-width) * 0.7);
					margin: var(--margin1); padding: 0.5em;
					border-right: solid 2px grey; border-bottom: solid 2px grey;
					display: flex; flex-direction: column;
					background-color: LightGrey;
				}
				${me} > button {flex: 1 1 auto; margin: 0.2em;}
			</style>
			<button w-id='home'>HOME</button>
			<button w-id='labels'>Organize labels</button>
			<!--<button w-id='export'>Export database</button>-->
			<button w-id='source'>Sources on GitHub</button>
			<a w-id='a' style='display:none'></a>
		`
		wcMixin(this)

		this.home.onclick = () => location.reload() //location.href = APP.baseUrl
		this.labels.onclick = () => APP.route('labels-organize')
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
