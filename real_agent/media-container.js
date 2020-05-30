import wcMixin from '/WcMixin/WcMixin.js'
import './media-player.js'

const me = 'media-container'
customElements.define(me, class extends HTMLElement {
	builded = false

	connectedCallback() {
		this.build(null, this.getAttribute('add'), this.getAttribute('del'))
	}

	build(medias, addFlag, delFlag) {
		if (!this.builded) {
			this.builded = true
			this.innerHTML = `
				<style scoped>
					${me} { display: flex; flex-flow: row wrap;}
					${me} > div, ${me} > button {
						height: 70px; width: 70px;
						margin: var(--margin1);
				  		display: inline-flex; flex-flow: row; justify-content: center; align-items: center;
				  		overflow: hidden;
					}
					${me} > div:hover { cursor: pointer; }
					${me} > * { max-height: 100%; max-width: 100%; }
					${me} button { border-radius: 0; }
				</style>

				<button w-id='addBut' style='display:none'>Add media</button>	
			`
			wcMixin(this)

			this.addBut.onclick = () => {
		      const mman = document.createElement('media-manager').build(
		         [
		            ['msg', 'Take photo, video, or audio:'],
		            ['but', 'Cancel<br>&lArr;', () => history.go(-1)],
		            ['but', 'Next<br>&rArr;', () => {
		            	mman.getMedias().forEach(media => this.addMedia(media, true))
		               history.go(-1)
		            }]
		         ],
		         this.medias
		      )
				APP.routeModal('media-manager', mman)
			}
		}
		if (medias) {
			for (let el=this.addBut.nexElementSibling; el; el=this.addBut.nexElementSibling) el.remove()
			medias.forEach(media => this.addMedia(media, delFlag))
		}
		if (addFlag) this.addBut.display('inline-flex')
	}

	addMedia(media, delFlag) {
		const div = document.createElement('div')
		const med = document.createElement('img')
		med._source = media
		med.src = media.preview

		const delActiion = delFlag ? () => div.remove() : null
		div.onclick = (ev) => {
			ev.stopPropagation()
			APP.routeModal('media-player', document.createElement('media-player').build(media, delActiion))
		}

		div.append(med)
		this.addBut.before(div)
	}

	getMedias() {
		return Array.from(this.querySelectorAll('div')).map(el => el.firstElementChild._source)
	}
})
