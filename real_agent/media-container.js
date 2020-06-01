import wcMixin from '/WcMixin/WcMixin.js'
import './media-player.js'

const me = 'media-container'
customElements.define(me, class extends HTMLElement {
	addFlag = false
	delFlag = false

	build(medias) {
		this.addFlag = this.getAttribute('add') === 'true'
		this.delFlag = this.getAttribute('del') === 'true'

		this.innerHTML = `
			<style scoped>
				${me} { 
					width: 100%;
					display: flex; flex-flow: row wrap;
					/*display: grid; grid-template-columns: repeat(auto-fill, minmax(${APP.imgPrevSize}px, 1fr));*/
				}
				${me} > * { 
					height: ${APP.imgPrevSize}px; width: ${APP.imgPrevSize}px;
					margin: var(--margin1);
				}
				${me} > button { 
					height: ${APP.imgPrevSize}px; width: ${APP.imgPrevSize}px;
					border-radius: 0;
				}
				${me} > *:hover { cursor: pointer; }
			</style>

			<button w-id='addBut' style='display:none'>ADD<br>MEDIA</button>	

		`
		wcMixin(this)

		this.addBut.onclick = () => {
	      const mman = document.createElement('media-manager').build(
	         [
	            ['msg', 'Take photo, video, or audio:'],
	            ['but', 'Cancel<br>&lArr;', () => history.go(-1)],
	            ['but', 'Next<br>&rArr;', () => {
	            	mman.getMedias().forEach(media => this.add(media))
	               history.go(-1)
	            }]
	         ],
	         this.medias
	      )
			APP.routeModal('media-manager', mman)
		}

		if (medias) for (const media of medias) this.add(media)

		if (this.addFlag) this.addBut.display('block')
	}

	add(media) {
		const med = document.createElement('img')
		med._source = media
		med.src = media.preview

		const delActiion = this.delFlag ? () => med.remove() : null
		med.onclick = (ev) => {
			ev.stopPropagation()
			APP.routeModal('media-player', document.createElement('media-player').build(media, this.val, delActiion))
		}

		this.addBut.before(med)
	}

	get val() {
		return Array.from(this.querySelectorAll('img')).map(el => el._source)
	}
})
