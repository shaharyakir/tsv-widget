import "./style.css";
import typescriptLogo from "./typescript.svg";
import { setupCounter } from "./counter";
import "@orbs-network/tsv-widget";
// import "@orbs-network/tsv-widget/build/typings/src/lib/"; // TODO bypass this!

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>highlighter example</h1>

    <div class="contract-verifier-container">
      <div class="contract-verifier-files">
      </div>
      <div class="contract-verifier-code">
      </div>
    </div>

    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`;

window.onload = async () => {
  const ipfslink = await window.ContractVerifier.getSourcesJsonUrl(
    "/rX/aCDi/w2Ug+fg1iyBfYRniftK5YDIeIZtlZ2r1cA=",
    { httpApiEndpoint: "https://scalable-api.tonwhales.com/jsonRPC" }
  );

  if (ipfslink) {
    const y = await window.ContractVerifier.getSourcesData(ipfslink);

    // @ts-ignore
    ContractVerifierUI.loadSourcesData("", "", y);
  }
};
