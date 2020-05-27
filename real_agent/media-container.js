import wcMixin from '/WcMixin/WcMixin.js'

const me = 'media-container'
customElements.define(me, class extends HTMLElement {

	build(medias, del) {
		this.innerHTML = ''
		medias.forEach(media => this.add(media, del))
		return this
	}

	add(media, del) {
		const div = document.createElement('div')
		const med = document.createElement(media.tagName)
		med._prev = media.prev
		med._blob = media.blob

		if (med.tagName === 'CANVAS') {
			med.width = APP.imgPrevSize
			med.height = APP.imgPrevSize
			med.getContext('2d').putImageData(media.prev, 0, 0)
		} else {
			med.src = URL.createObjectURL(media.blob)
			med.controls = true
		}

		if (del) del = () => div.remove()
		div.onclick = (ev) => {
			ev.stopPropagation()
			APP.routeModal('media-img-show', document.createElement('media-img-show').build(media.blob, del), 'appModalCenter')
		}

		div.append(med)
		this.append(div)
	}

	get value() {
		return Array.from(this.children).map(
			el => { 
				const med = el.firstElementChild
				return { tagName: med.tagName, prev: med._prev, blob: med._blob }
			}
		)
	}
})
