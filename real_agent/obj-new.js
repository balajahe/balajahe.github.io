import * as WcMixin from '/WcApp/WcMixin.js'

const me = 'obj-new'
customElements.define(me, class extends HTMLElement {
	location = null

	connectedCallback() {
		WcMixin.addAdjacentHTML(this, `
			<style scoped>
				${me} button { height: calc(var(--button-height) * 0.8); }
				${me} input { height: calc(var(--button-height) * 0.8); width: 30%; }
				${me} > #descDiv {
					min-height: 5em;
					margin: var(--margin1); margin-top: var(--margin2);
					padding-left: var(--margin2);
					border: solid 1px silver;
					display: block;
				}
				${me} #locDiv { 
					height: 250px; width: 100%; 
					margin-top: var(--margin1);	
				}
				${me} #locDiv > iframe { 
					display: inline-block; 
					width: 100%;
				}
			</style>
			
			<div w-id='descDiv/desc' contenteditable='true'></div>
			<props-manager w-id='propsManager/props'></props-manager>
			<div id='locDiv'>
				<iframe w-id='mapIframe'></iframe>
			</div>
		`)
		
		this.appBar = [
			['but', 'Geo<br>&#8853;', () => this.updateLocation()],
			['msg', 'Enter description and add properties:'],
			['back'],
			['but', 'Save<br>&rArr;', async () => {
				if (!this.desc) {
					APP.setMessage('<span style="color:red">EMPTY DESCRIPTION!</span>', 3000)
					this.descDiv.focus()
				} else if (this.props.length === 0) {
					APP.setMessage('<span style="color:red">NO PROPERTIES!</span>', 3000)
				} else {
					const pageMedias = document.querySelector('#obj-new-medias')
					const now = APP.now()
					const obj = {
						created: now,
						modified: now,
						location: {latitude: this.location?.latitude, longitude: this.location?.longitude},
						desc: this.desc,
						props: this.props,
						medias: pageMedias.val
					} 
					document.querySelector('obj-list').addItem(obj)

					APP.remove(pageMedias)
					APP.remove(this)
					APP.route('obj-list')
					APP.setMessage('SAVED !', 3000)
				}
			}]
		]
	}

	updateLocation() {
		navigator.geolocation.getCurrentPosition(
			loc => {
				this.location = { latitude: loc.coords.latitude, longitude: loc.coords.longitude }
				this.mapIframe.contentWindow.location.replace(`https://www.openstreetmap.org/export/embed.html?bbox=${this.location.longitude-0.002}%2C${this.location.latitude-0.002}%2C${this.location.longitude+0.002}%2C${this.location.latitude+0.002}&layer=mapnik&marker=${this.location.latitude}%2C${this.location.longitude}`)
			},
			er => alert(er.message),
			{
			  enableHighAccuracy: true,
			  timeout: 10000,
			  maximumAge: 0
			}
		)
	}

	onRoute() {
		this.updateLocation()
		this.descDiv.focus()
	}
})
