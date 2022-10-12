import "./style.css";
import typescriptLogo from "./typescript.svg";
import { setupCounter } from "./counter";
import "@orbs-network/tsv-widget";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <pre><code>dailsjdklasjdlkasjd</code></pre>
    <h1>highlighter example</h1>
    <div style="height:500px">
    <tsv-widget
      verified-contract-url="ipfs://Qmd4B1Xc6hy4XsEBuRh1kRhfwCXtXfT7fimJAD2fuGdMQJ"
      theme="dark"
    >
    </tsv-widget>
    </div>
    <div style="height:500px">
    <tsv-widget
      ipfs-provider="https://tonsource.infura-ipfs.io"
      verified-contract-url="ipfs://Qmd4B1Xc6hy4XsEBuRh1kRhfwCXtXfT7fimJAD2fuGdMQJ"
      layout="vertical"
    >
    </tsv-widget>
    </div>

    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`;

setupCounter(document.querySelector<HTMLButtonElement>("#counter")!);
