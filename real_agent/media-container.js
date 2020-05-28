import wcMixin from '/WcMixin/WcMixin.js'
import './media-player.js'

const me = 'media-container'
customElements.define(me, class extends HTMLElement {

	build(medias, del) {
		this.innerHTML = ''
		medias.forEach(media => this.add(media, del))
		return this
	}

	add(media, del) {
		const div = document.createElement('div')
		const med = document.createElement('img')
		med._source = media
		med.src = media.preview ? media.preview : 'aaa'

		if (del) del = () => div.remove()
		div.onclick = (ev) => {
			ev.stopPropagation()
			APP.routeModal('media-player', document.createElement('media-player').build(media, del))
		}

		div.append(med)
		this.append(div)
	}

	get value() {
		return Array.from(this.children).map(el => el.firstElementChild._source)
	}
})
