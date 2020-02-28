customElements.define('input-text',
    class extends HTMLInputElement {
        constructor() {
            super()
            this.setAttribute('type', 'text')
            this.addEventListener('blur', ev => {
                this.value = this.value.replace('<', '&lt;')
            })
        }
    },
    {extends:'input'}
)