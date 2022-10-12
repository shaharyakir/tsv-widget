import CodeHighlighter from "./code-highlighter";
import * as SVG from "./static/svg.json";

const style = require("./style.css");

type Theme = "light" | "dark";
type Layout = "horizontal" | "vertical";

/**
 *
 */
export default class TSVWidgetElement extends HTMLElement {
  private ch: CodeHighlighter;
  private sources: any = {};
  private selectedFile: string = null;
  private ipfsProvider: string;
  private verifiedContractUrl: string;
  private verifiedContract: any;
  private theme: Theme;
  private layout: Layout;

  /**
   *
   */
  constructor() {
    super();

    this.attachShadow({ mode: "open" });
  }

  /**
   * Runs each time the element is appended to or moved in the DOM
   */
  async connectedCallback() {
    console.log("connected!", this);

    this.ipfsProvider =
      this.getAttribute("ipfs-provider") ?? "https://tonsource.infura-ipfs.io";
    this.verifiedContractUrl = this.getAttribute("verified-contract-url");
    this.theme = (this.getAttribute("theme") ?? "light") as Theme;
    this.layout = (this.getAttribute("layout") ?? "horizontal") as Layout;

    this.ch = new CodeHighlighter(this.theme);

    await this.buildContainer();

    await this.fetchSources();

    await this.buildTabs();

    this.bindTabChangeEvents();

    this.selectFile(this.selectedFile);
  }

  bindTabChangeEvents() {
    const tabButtonsElements = this.shadowRoot.querySelectorAll(
      "div.nav-tabs div.tab-button "
    );

    for (const tabButtonsElement of tabButtonsElements) {
      tabButtonsElement.addEventListener("click", () => {
        for (const _tabButtonsElement of tabButtonsElements) {
          if (_tabButtonsElement !== tabButtonsElement) {
            _tabButtonsElement.classList.remove("active");
          }
        }

        tabButtonsElement.classList.add("active");

        this.selectFile(tabButtonsElement.getAttribute("file-name"));
      });
    }
  }

  /**
   * fetch sources from the verified contract json url
   */
  async fetchSources() {
    let url =
      this.ipfsProvider +
      "/ipfs/" +
      this.verifiedContractUrl.replace("ipfs://", "");

    this.verifiedContract = await (await fetch(url)).json();

    await Promise.all(
      this.verifiedContract.sources.map(async (source) => {
        url = this.ipfsProvider + "/ipfs/" + source.url.replace("ipfs://", "");

        const resp = await fetch(url);

        this.sources[source.filename] = await resp.text();
      })
    );

    this.loadingCurtain.classList.remove("visible");
  }

  /**
   * builds the external container element and appends it to the shadow root
   */
  async buildContainer() {
    const dark = require("highlight.js/styles/atom-one-dark.css").toString();
    const light = require("highlight.js/styles/atom-one-light.css").toString();

    const template = document.createElement("template");

    template.innerHTML = `      
                <style>${this.theme === "dark" ? dark : light}</style>
                <style>${style}</style>     
                
                <div part="container-tabs" class="container-tabs ${
                  this.layout === "vertical" ? "vertical" : ""
                } ${this.theme === "dark" ? "dark" : ""}">
                    
                    <div id="loading-curtain" class="loading-curtain visible">
                    ${SVG.loadingAnimation}
                    </div>
                    
                    <div part="tabs-buttons" id="tabs-buttons" class="nav nav-tabs">                       
                    </div>
                    <div class="tab-content">
                        <pre><code part="tab-content" class="language-func" id="code"></code></pre>
                    </div>
                </div>           
                `;

    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  /**
   * builds the html tabs
   */
  async buildTabs() {
    let tabsButtons = "";

    let index = 0;

    for (const sourceMetadata of this.verifiedContract.sources) {
      const filename = sourceMetadata.filename;

      tabsButtons += `<div part="tab-button" class="tab-button ${
        index === 0 ? "active" : ""
      }" file-name="${filename}">
                                     ${filename}
                                    </div>`;

      if (index === 0) {
        this.selectedFile = filename;
      }

      index++;
    }

    this.tabsButtons.innerHTML = tabsButtons;

    await this.ch.init(this.shadowRoot, this.cmHost);
  }

  /**
   * select a specific file and corresponding tab
   *
   * @param filename
   */
  selectFile(filename) {
    this.selectedFile = this.sources[filename];

    this.ch.setCode(this.selectedFile);
  }

  /**
   * Runs when the element is removed from the DOM
   */
  disconnectedCallback() {
    console.log("disconnected", this);
  }

  /**
   *
   */
  get tabsButtons(): HTMLDivElement {
    return this.shadowRoot.getElementById("tabs-buttons") as HTMLDivElement;
  }

  /**
   *
   */
  get loadingCurtain(): HTMLDivElement {
    return this.shadowRoot.getElementById("loading-curtain") as HTMLDivElement;
  }

  /**
   *
   */
  get cmHost(): HTMLTextAreaElement {
    return this.shadowRoot.getElementById("code") as HTMLTextAreaElement;
  }
}

// Define the new web component
if ("customElements" in window) {
  window.customElements.define("tsv-widget", TSVWidgetElement);
}
