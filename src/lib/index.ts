import CodeHighlighter from "./code-highlighter";
import * as SVG from "./static/svg.json";

import hljs from "highlight.js";
import hljsDefine from "highlightjs-func";
hljsDefine(hljs);

const style = require("./style.css");

type Theme = "light" | "dark";
type Layout = "horizontal" | "vertical";

interface GetSourcesOptions {
  verifier?: string;
  httpApiEndpoint?: string;
  httpApiKey?: string;
}

interface SourcesData {
  files: { name: string; content: string }[];
}

type IpfsUrlConverterFunc = (ipfsUrl: string) => string;

declare global {
  interface Window {
    ContractVerifier: typeof y;
  }
}

// /**
//  *
//  */
// export default class TSVWidgetElement {
//   private ch: CodeHighlighter;
//   private sources: any = {};
//   private selectedFile: string = null;
//   private ipfsProvider: string;
//   private verifiedContractUrl: string;
//   private verifiedContract: any;
//   private theme: Theme;
//   private layout: Layout;

//   /**
//    * Runs each time the element is appended to or moved in the DOM
//    */
//   async connectedCallback() {
//     this.ipfsProvider =
//       this.getAttribute("ipfs-provider") ?? "https://tonsource.infura-ipfs.io";
//     this.verifiedContractUrl = this.getAttribute("verified-contract-url");
//     this.theme = (this.getAttribute("theme") ?? "light") as Theme;
//     this.layout = (this.getAttribute("layout") ?? "horizontal") as Layout;

//     this.ch = new CodeHighlighter(this.theme);

//     await this.buildContainer();

//     await this.fetchSources();

//     await this.buildTabs();

//     this.bindTabChangeEvents();

//     this.selectFile(this.selectedFile);
//   }

//   bindTabChangeEvents() {
//     const tabButtonsElements = this.shadowRoot.querySelectorAll(
//       "div.nav-tabs div.tab-button "
//     );

//     for (const tabButtonsElement of tabButtonsElements) {
//       tabButtonsElement.addEventListener("click", () => {
//         for (const _tabButtonsElement of tabButtonsElements) {
//           if (_tabButtonsElement !== tabButtonsElement) {
//             _tabButtonsElement.classList.remove("active");
//           }
//         }

//         tabButtonsElement.classList.add("active");

//         this.selectFile(tabButtonsElement.getAttribute("file-name"));
//       });
//     }
//   }

//   /**
//    * fetch sources from the verified contract json url
//    */
//   async fetchSources() {
//     let url =
//       this.ipfsProvider +
//       "/ipfs/" +
//       this.verifiedContractUrl.replace("ipfs://", "");

//     this.verifiedContract = await (await fetch(url)).json();

//     await Promise.all(
//       this.verifiedContract.sources.map(async (source) => {
//         url = this.ipfsProvider + "/ipfs/" + source.url.replace("ipfs://", "");

//         const resp = await fetch(url);

//         this.sources[source.filename] = await resp.text();
//       })
//     );

//     this.loadingCurtain.classList.remove("visible");
//   }

//   /**
//    * builds the external container element and appends it to the shadow root
//    */
//   async buildContainer() {
//     const dark = require("highlight.js/styles/atom-one-dark.css").toString();
//     const light = require("highlight.js/styles/atom-one-light.css").toString();

//     const template = document.createElement("template");

//     template.innerHTML = `
//                 <style>${this.theme === "dark" ? dark : light}</style>
//                 <style>${style}</style>

//                 <div part="container-tabs" class="container-tabs ${
//                   this.layout === "vertical" ? "vertical" : ""
//                 } ${this.theme === "dark" ? "dark" : ""}">

//                     <div id="loading-curtain" class="loading-curtain visible">
//                     ${SVG.loadingAnimation}
//                     </div>

//                     <div part="tabs-buttons" id="tabs-buttons" class="nav nav-tabs">
//                     </div>
//                     <div class="tab-content">
//                         <pre><code part="tab-content" class="language-func" id="code"></code></pre>
//                     </div>
//                 </div>
//                 `;

//     this.shadowRoot.appendChild(template.content.cloneNode(true));
//   }

//   /**
//    * builds the html tabs
//    */
//   async buildTabs() {
//     let tabsButtons = "";

//     let index = 0;

//     for (const sourceMetadata of this.verifiedContract.sources) {
//       const filename = sourceMetadata.filename;

//       tabsButtons += `<div part="tab-button" class="tab-button ${
//         index === 0 ? "active" : ""
//       }" file-name="${filename}">
//                                      ${filename}
//                                     </div>`;

//       if (index === 0) {
//         this.selectedFile = filename;
//       }

//       index++;
//     }

//     this.tabsButtons.innerHTML = tabsButtons;

//     await this.ch.init(this.shadowRoot, this.cmHost);
//   }

//   /**
//    * select a specific file and corresponding tab
//    *
//    * @param filename
//    */
//   selectFile(filename) {
//     this.selectedFile = this.sources[filename];
//     this.shadowRoot.querySelector(".tab-content").scrollTo(0, 0);
//     this.ch.setCode(this.selectedFile);
//   }

//   //   /**
//   //    *
//   //    */
//   //   get tabsButtons(): HTMLDivElement {
//   //     return this.shadowRoot.getElementById("tabs-buttons") as HTMLDivElement;
//   //   }
// }

import { Address, Cell, TonClient } from "ton";
import { BN } from "bn.js";
import { getHttpEndpoint } from "@orbs-network/ton-gateway";
import { Sha256 } from "@aws-crypto/sha256-js";

const SOURCES_REGISTRY = "EQANJEwItCel0Pwle7fHaL1FRYC2dZyyzKCOqK2yjrMcxN-g";

const toSha256Buffer = (s: string) => {
  const sha = new Sha256();
  sha.update(s);
  return Buffer.from(sha.digestSync());
};

const y = {
  getSourcesJsonUrl: async function (
    codeCellHash: string,
    options?: GetSourcesOptions
  ): Promise<string | null> {
    const tc = new TonClient({
      endpoint: options?.httpApiEndpoint ?? (await getHttpEndpoint()),
      apiKey: options?.httpApiKey,
    });

    const { stack: sourceItemAddressStack } = await tc.callGetMethod(
      Address.parse(SOURCES_REGISTRY),
      "get_source_item_address",
      [
        [
          "num",
          new BN(toSha256Buffer(options?.verifier ?? "orbs.com")).toString(),
        ],
        ["num", new BN(Buffer.from(codeCellHash, "base64")).toString(10)],
      ]
    );

    const sourceItemAddr = Cell.fromBoc(
      Buffer.from(sourceItemAddressStack[0][1].bytes, "base64")
    )[0]
      .beginParse()
      .readAddress()!;

    const isDeployed = await tc.isContractDeployed(sourceItemAddr);

    if (isDeployed) {
      const { stack: sourceItemDataStack } = await tc.callGetMethod(
        sourceItemAddr,
        "get_source_item_data"
      );
      const ipfsLink = Cell.fromBoc(
        Buffer.from(sourceItemDataStack[4][1].bytes, "base64")
      )[0]
        .beginParse()
        .readRemainingBytes()
        .toString();

      return ipfsLink;
    }

    return null;
  },

  getSourcesData: async function (
    sourcesJsonUrl: string,
    ipfsConverter?: IpfsUrlConverterFunc
  ): Promise<SourcesData> {
    ipfsConverter =
      ipfsConverter ??
      ((ipfs) =>
        ipfs.replace("ipfs://", "https://tonsource.infura-ipfs.io/ipfs/"));

    this.verifiedContract = await (
      await fetch(ipfsConverter(sourcesJsonUrl))
    ).json();

    const resp = { files: [] };

    // TODO filename => name
    await Promise.all(
      this.verifiedContract.sources.map(
        async (source: { url: string; filename: string }) => {
          const url = ipfsConverter(source.url);
          resp.files.push({
            name: source.filename,
            content: await fetch(url).then((u) => u.text()),
          });
        }
      )
    );

    return resp;
  },
};

window["ContractVerifier"] = y;

const x = window["ContractVerifierUI"] = {
  loadSourcesData: function (
    fileListSelector: string,
    fileContentSelector: string,
    sourcesData: SourcesData
  ) {
    const codePart = document.querySelector(".contract-verifier-code");
    console.log(codePart, "SS");

    const dark = require("highlight.js/styles/atom-one-dark.css").toString();
    const light = require("highlight.js/styles/atom-one-light.css").toString();

    const styleEl = document.createElement("style");
    styleEl.innerHTML = `${light} ${style}`;
    document.head.appendChild(styleEl);

    codePart.innerHTML = `<pre><code class="language-func">${
      sourcesData.files.find((f) => f.name.match(/wallet/)).content
    }</code></pre>`;
    // hljs.highlightElement(codePart as HTMLElement);
    hljs.highlightAll();
  },
};
