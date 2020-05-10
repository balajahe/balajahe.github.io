customElements.define('item-list',
    class extends HTMLElement {
        _items = new Array()
        get items() { return this._items }

        constructor() {
            super()
            this.innerHTML = `
                <form action="#">
                    <input is="input-text" required placeholder="Message text..." style="width:40vw"/>
                    <input type="submit" value="Send"/>
                </form>
                <ol style="display:flex; flex-direction:column-reverse"></ol>
            `
            this.querySelector('form').addEventListener('submit', (ev) => {
                ev.preventDefault()
                const el = this.querySelector('input')
                const it = document.createElement('item-view').build(el.value)
                el.value = ''
                this._items.push(it)
                this.querySelector('ol').appendChild(it)
            })
        }

        focus() {
            this.querySelector('input').focus()
        }

        items_filter(txt) {
            const txtl = txt.toLowerCase()
            return this._items.filter(v => v.mess.toLowerCase().includes(txtl))
        }
    }
)