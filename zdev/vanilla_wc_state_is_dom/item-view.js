customElements.define('item-view',
    class extends HTMLElement {
        _who = ''
        _when = 0
        _mess = ''
        get mess() { return this._mess }

        build(mess) { 
            this._who = document.querySelector('login-session').login_name
            this._when = new Date()
            this._mess = mess 
            return this
        }

        connectedCallback() {
            this.innerHTML = `
                <li>
                    ${this._mess}<br/>
                    <small><i>${this._who}, ${this._when.toLocaleString()}</i></small>
                </li>
            `
        }
    }
)