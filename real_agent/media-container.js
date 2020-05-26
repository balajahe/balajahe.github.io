import wcMixin from '/WcMixin/WcMixin.js'

const me = 'media-container'
customElements.define(me, class extends HTMLElement {

	build(medias, del) {
		this.innerHTML = ''
		medias.forEach(media => this.addMedia(media, del))
		return this
	}

	addMedia(media, del) {
		const div = document.createElement('div')
		const med = document.createElement(media.tagName)
		div.append(med)
		med.src = URL.createObjectURL(media.blob)
		med._blob = media.blob
		if (med.tagName === 'IMG') {
			if (del) del = () => div.remove()
			div.onclick = (ev) => {
				ev.stopPropagation()
				APP.routeModal('media-img-show', document.createElement('media-img-show').build(med.src, del), 'appModalCenter')
			}
		} else {
			med.controls = true
		}
		this.append(div)
	}

	get value() {
		return Array.from(this.children).map(
			el => ({ tagName: el.firstElementChild.tagName, blob: el.firstElementChild._blob })
		)
	}
})
