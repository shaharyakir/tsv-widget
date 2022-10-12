import "./style.css";
import typescriptLogo from "./typescript.svg";
import { setupCounter } from "./counter";
// import "@orbs-network/tsv-widget";

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
      ipfs-provider="https://tonsource.infura-ipfs.io"
      verified-contract-url="ipfs://Qmc2XaToAq77pcsQLS4qv3qnnkjjSFDPwqBi9kJXJnbiSr"
      theme="dark"
      layout="horizontal"
    >
    </tsv-widget>
    <tsv-widget
      ipfs-provider="https://tonsource.infura-ipfs.io"
      verified-contract-url="ipfs://Qmc2XaToAq77pcsQLS4qv3qnnkjjSFDPwqBi9kJXJnbiSr"
      theme="light"
      layout="horizontal"
    >
    </tsv-widget>
    </div>

    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`;

setupCounter(document.querySelector<HTMLButtonElement>("#counter")!);
