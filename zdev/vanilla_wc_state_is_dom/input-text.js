customElements.define('input-text',
    class extends HTMLInputElement {
        constructor() {
            super()
            this.setAttribute('type', 'text')
            this.addEventListener('input', ev => {
                this.value = this.value.replace(/</g, '&lt;')
            })
        }
    },
    {extends:'input'}
)