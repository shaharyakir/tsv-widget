import CodeHighlighter from "./code-highlighter";

const codeMirrorCss = require("codemirror/lib/codemirror.css").toString()
const style = require("./style.css")

const template = document.createElement('template')

/**
 *
 */
export default class TSVWidgetElement extends HTMLElement {

    private ch: CodeHighlighter
    private sources: any = {}
    private selectedFile: string = null
    private readonly ipfsProvider: string
    private verifiedContractUrl: string
    private verifiedContract: any;
    private theme: string;
    private layout: string;

    /**
     *
     */
    constructor() {

        super()

        this.ipfsProvider = this.getAttribute('ipfs-provider')
        this.verifiedContractUrl = this.getAttribute('verified-contract-url')
        this.theme = this.getAttribute('theme')
        this.layout = this.getAttribute('layout')

        this.attachShadow({mode: 'open'})


    }

    /**
     * Runs each time the element is appended to or moved in the DOM
     */
    async connectedCallback() {

        console.log('connected!', this);

        this.ch = new CodeHighlighter(
            this.theme
        )

        await this.fetchSources()

        await this.buildTabs()

        this.selectFile(
            this.selectedFile
        )

    }

    /**
     * fetch sources from the verified contract json url
     */
    async fetchSources() {

        let url = this.ipfsProvider + '/ipfs/' + this.verifiedContractUrl.replace('ipfs://', '')

        this.verifiedContract = await (await fetch(url)).json()

        await Promise.all(this.verifiedContract.sources.map(async source => {

            url = this.ipfsProvider + '/ipfs/' + source.url.replace('ipfs://', '')

            const resp = await fetch(url)

            this.sources[source.fileName] = await resp.text()

        }));

    }

    /**
     * builds the html tabs
     */
    async buildTabs() {

        let tabsButtons = ''

        let index = 0

        for (const sourceMetadata of this.verifiedContract.sources) {

            const fileName = sourceMetadata.fileName

            tabsButtons += `<div part="tab-button" class="tab-button ${index === 0 ? 'active' : ''}" file-name="${fileName}">
                                     ${fileName}
                                    </div>`

            if (index === 0) {
                this.selectedFile = fileName
            }

            index++

        }

        template.innerHTML = `      
                <style>${codeMirrorCss}</style>
                <style>${style}</style>     
                
                <div part="container-tabs" class="container-tabs ${this.layout === 'vertical' ? 'vertical' : ''} ${this.theme === 'dark' ? 'dark' : ''}">
                    <div part="tabs-buttons" id="tabs-buttons" class="nav nav-tabs">
                        ${tabsButtons}
                    </div>
                    <div part="tab-content" class="tab-content">
                        <div part="tab-inner" class="tab-pane active"> 
                            <textarea id="cm-host"></textarea>
                        </div>             
                    </div>
                </div>           
                `

        this.shadowRoot.appendChild(template.content.cloneNode(true))

        await this.ch.init(
            this.shadowRoot,
            this.cmHost
        )

        const tabButtonsElements = this.shadowRoot.querySelectorAll("div.nav-tabs div.tab-button ");

        for (const tabButtonsElement of tabButtonsElements) {

            tabButtonsElement.addEventListener("click", () => {

                for (const _tabButtonsElement of tabButtonsElements) {

                    if (_tabButtonsElement !== tabButtonsElement) {
                        _tabButtonsElement.classList.remove('active')
                    }

                }

                tabButtonsElement.classList.add('active')

                this.selectFile(tabButtonsElement.getAttribute('file-name'))
            })

        }

    }

    /**
     * select a specific file and corresponding tab
     *
     * @param fileName
     */
    selectFile(fileName) {

        this.selectedFile = this.sources[fileName]

        this.ch.setCode(
            this.selectedFile
        )

    }

    /**
     * Runs when the element is removed from the DOM
     */
    disconnectedCallback() {
        console.log('disconnected', this)
    }

    /**
     *
     */
    get cmHost(): HTMLTextAreaElement {
        return this.shadowRoot.getElementById('cm-host') as HTMLTextAreaElement;
    }

}

// Define the new web component
if ('customElements' in window) {
    window.customElements.define('tsv-widget', TSVWidgetElement)
}

