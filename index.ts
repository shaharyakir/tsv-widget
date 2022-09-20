import CodeHighlighter from "./code-highlighter";

const codeMirrorCss = require("codemirror/lib/codemirror.css").toString()
const style = require("./style.css")


const funcExample = "() recv_internal(int balance, int msg_value, cell msg_full, slice msg_body) impure {\n" +
    "var (one, two, three) = (msg_body~load_uint(5), msg_body~load_uint(5), msg_body~load_uint(5));\n" +
    "\n" +
    "one~dump();\n" +
    "two~dump();\n" +
    "three~dump();\n" +
    "}\n" +
    "        \n" +
    "() recv_external(int balance, int msg_value, cell msg_full, slice msg_body) impure {\n" +
    ";; Nothing, because it is internal test.\n" +
    "}"

export default class TSVWidget {

    constructor() {

        const template = document.createElement('template')

        class TSVWidgetElement extends HTMLElement {

            private ch: CodeHighlighter
            private sources: any = {}
            private selectedFile: string = null
            private readonly ipfsProvider: string
            private verifiedContractUrl: string
            private verifiedContract: any;

            /**
             * The class constructor object
             */
            constructor() {

                super()

                this.ipfsProvider = this.getAttribute('ipfs-provider')
                this.verifiedContractUrl = this.getAttribute('verified-contract-url')

                this.attachShadow({mode: 'open'})


            }

            /**
             * Runs each time the element is appended to or moved in the DOM
             */
            async connectedCallback() {

                console.log('connected!', this);

                this.ch = new CodeHighlighter()

                await this.fetchSources()

                await this.buildTabs()

                this.selectFile(
                    this.selectedFile
                )

            }

            async fetchSources() {

                this. verifiedContract = await (await fetch(this.verifiedContractUrl)).json()

                await Promise.all(this.verifiedContract.sources.map(async source => {

                    const url = this.ipfsProvider + '/ipfs/' + source.url.replace('ipfs://', '')

                    const resp = await fetch(url)

                    this.sources[source.fileName] = await resp.text()

                }));

            }

            async buildTabs() {

                let tabsButtons = ''

                let index = 0

                for (const sourceMetadata of this.verifiedContract.sources) {

                    const fileName = sourceMetadata.fileName

                    tabsButtons += `<div class="tab-button ${index === 0 ? 'active' : ''}" file-name="${fileName}">
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
                
                <div class="container-tabs">
                    <div id="tabs-buttons" class="nav nav-tabs">
                        ${tabsButtons}
                    </div>
                    <div class="tab-content">
                        <div id="tab-inner" class="tab-pane active"> 
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

            get cmHost(): HTMLTextAreaElement {
                return this.shadowRoot.getElementById('cm-host') as HTMLTextAreaElement;
            }

        }

        // Define the new web component
        if ('customElements' in window) {
            window.customElements.define('tsv-widget', TSVWidgetElement)
        }
    }

}

// editor.switchLang("plain");

/* `<div>

            <div>

              <div v-for="fileName in contractFiles" :key="fileName">

                <div>{{ fileName }}</div>
                <div>{{ contractFiles[fileName] }}</div>

              </div>

            </div>

            <table>

              <tr>

                <th>status</th>
                <th>verifier</th>
                <th>publicKey</th>
                <th>ip</th>
                <th>signature</th>

              </tr>

              <tr v-for="verifier of verifiers" :key="verifier.publicKey">

                <td>{{ verifier.status }}</td>
                <td>{{ verifier.verifier }}</td>
                <td>{{ verifier.publicKey }}</td>
                <td>{{ verifier.ip }}</td>
                <td>{{ verifier.signature }}</td>

              </tr>

            </table>

           </div>`*/

new TSVWidget()
