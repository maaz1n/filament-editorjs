import './media-picker.css'

export default class MediaPicker {
    static get toolbox() {
        return {
            title: 'Media',
            icon: '<svg width="17" height="15" viewBox="0 0 336 276" xmlns="http://www.w3.org/2000/svg"><path d="M291 150V79c0-19-15-34-34-34H79c-19 0-34 15-34 34v42l67-44 81 72 56-29 42 30zm0 52l-43-30-56 30-81-67-66 39v23c0 19 15 34 34 34h178c17 0 31-13 34-29zM79 0h178c44 0 79 35 79 79v118c0 44-35 79-79 79H79c-44 0-79-35-79-79V79C0 35 35 0 79 0z"/></svg>'
        }
    }

    constructor({data, block, config}) {
        this.statePath = 'editorjs-' + block.id
        this.wrapper = undefined
        this.media = undefined
        this.data = data
        this.mediaUrl = config.url ?? '/'

        window.addEventListener('close-modal', (event) => {
            if (event.detail.id !== 'media-picker-model' || event.detail.statePath !== this.statePath) {
                return
            }

            if (event.detail.hasOwnProperty('media')) {
                this.media = event.detail.media
                this._createImage()
            }
        })
    }

    render() {
        if (this.data.media) {
            fetch(this.mediaUrl + this.data.media, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => response.json())
                .then((data) => {
                    this.media = data
                    this._createImage()
                })
        }

        this.wrapper = document.createElement('div')
        this.wrapper.classList.add('media-picker')

        if (this.media) { return this.wrapper;}

        this.wrapper.appendChild(this._createButton())

        return this.wrapper
    }

    save(blockContent) {
        const caption = blockContent.querySelector('[contenteditable]');

        return {
            media: this.media?.id,
            caption: caption?.innerHTML || ''
        }
    }

    validate(savedData) {
        return savedData.media != null
    }

    _createButton() {
        const btn = document.createElement('button')
        btn.innerHTML = 'Browse Image'
        btn.type = 'button'

        btn.addEventListener('click', () => dispatchEvent(
            new CustomEvent('open-modal', {
                detail: {
                    id: 'media-picker-model',
                    statePath: this.statePath,
                    media: null
                }
            })
        ))

        return btn
    }

    _createImage() {
        const image = document.createElement('img')
        const caption = document.createElement('div');

        image.src = this.media?.url

        image.addEventListener('click', () => dispatchEvent(
            new CustomEvent('open-modal', {
                detail: {
                    id: 'media-picker-model',
                    statePath: this.statePath,
                    media: null
                }
            })
        ))

        caption.contentEditable = true;
        caption.innerHTML = this.media?.caption || '';

        this.wrapper.innerHTML = ''
        this.wrapper.appendChild(image)
        this.wrapper.appendChild(caption)
    }
}