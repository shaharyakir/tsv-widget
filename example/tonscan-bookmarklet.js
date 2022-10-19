/**
 * To test this => https://tonscan.org/address/EQDerEPTIh0O8lBdjWc6aLaJs5HYqlfBN2Ruj1lJQH_6vcaZ
 * Then copy this entire file and paste in console
 */

function waitForElm(selector) {
  return new Promise((resolve) => {
    if (document.querySelector(selector)) {
      return resolve(document.querySelector(selector));
    }

    const observer = new MutationObserver((mutations) => {
      if (document.querySelector(selector)) {
        resolve(document.querySelector(selector));
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

(async function () {
  const script = document.createElement("script");
  script.src =
    "https://cdn.jsdelivr.net/gh/shaharyakir/tsv-widget@eb5e2c0/build/index.min.js";
  document.head.appendChild(script);

  const style = document.createElement("style");

  style.innerHTML = `
    #myContentFull code {
      background-color: var(--code-viewer-background);
      font-family: Ubuntu Mono,monospace; 
    }
    #myFilesFull .contract-verifier-file.active {
      background-color: var(--code-viewer-background);
    }
    #myFilesFull .contract-verifier-file.active {
      background-color: var(--code-viewer-background);
      color: var(--body-text-color); 
    }
    #myFilesFull .contract-verifier-file:hover {
      background-color: var(--code-viewer-tab-inactive-background);
      color: var(--body-text-color); 
    }
    #myFilesFull .contract-verifier-file {
      background-color: var(--code-viewer-tab-inactive-background);
      color: #666;
    }
  `;

  document.head.appendChild(style);

  const n = document.querySelector(
    "body > section > div.content > section > section > div.card.card--tabbed > nav"
  );
  const newNode = n.children[2].cloneNode(true);
  n.appendChild(newNode);
  n.children[0].className = "card-title-tab";
  n.children[3].className = "card-title-tab card-title-tab--active";
  n.children[3].childNodes[0].innerHTML =
    '<g clip-path="url(#clip0_2774_20489)"> \
  <path d="M10.7967 0.329688L12.7368 2.2698C12.9473 2.4803 13.2345 2.59941 13.5331 2.59941H16.276C16.8977 2.59941 17.4019 3.10361 17.4019 3.7253V6.46822C17.4019 6.76683 17.521 7.05401 17.7315 7.2645L19.6716 9.20462C20.1105 9.64355 20.1105 10.3566 19.6716 10.7972L17.7315 12.7373C17.521 12.9478 17.4019 13.235 17.4019 13.5336V16.2765C17.4019 16.8982 16.8977 17.4024 16.276 17.4024H13.5331C13.2345 17.4024 12.9473 17.5215 12.7368 17.732L10.7967 19.6721C10.3578 20.111 9.64469 20.111 9.20413 19.6721L7.26401 17.732C7.05352 17.5215 6.76634 17.4024 6.46773 17.4024H3.72481C3.10312 17.4024 2.59892 16.8982 2.59892 16.2765V13.5336C2.59892 13.235 2.47981 12.9478 2.26932 12.7373L0.3292 10.7972C-0.109733 10.3582 -0.109733 9.64518 0.3292 9.20462L2.26932 7.2645C2.47981 7.05401 2.59892 6.76683 2.59892 6.46822V3.7253C2.59892 3.10361 3.10312 2.59941 3.72481 2.59941H6.46773C6.76634 2.59941 7.05352 2.4803 7.26401 2.2698L9.20413 0.329688C9.64306 -0.109245 10.3561 -0.109245 10.7967 0.329688Z" fill="#0088CC"/> \
  <g clip-path="url(#clip1_2774_20489)"> \
  <path d="M13.7657 8.45609L9.54534 12.6761C9.23282 12.9887 8.72586 12.9887 8.41305 12.6761L6.23448 10.4974C5.92184 10.1848 5.92184 9.6778 6.23448 9.36517C6.54718 9.05247 7.0541 9.05247 7.36666 9.36505L8.97936 10.9778L12.6333 7.32379C12.946 7.01109 13.453 7.01133 13.7656 7.32379C14.0781 7.63643 14.0781 8.14327 13.7657 8.45609Z" fill="#F7F9FB"/> \
  </g>\
  </g>\
  <defs>\
  <clipPath id="clip0_2774_20489">\
  <rect width="20" height="20" fill="white"/>\
  </clipPath>\
  <clipPath id="clip1_2774_20489">\
  <rect width="8" height="8" fill="white" transform="translate(6 6)"/>\
  </clipPath>\
  </defs>\
  ';
  n.children[3].childNodes[1].textContent = "Source";

  // await waitForElm(".source-viewer-code__pre--base64");

  const codePart = await waitForElm(
    "body > section > div.content > section > section > div.card.card--tabbed > section"
  );

  codePart.innerHTML = `
  <div>
    <div style="height:500px">
      <div id="myContainerFull">
        <div id="myFilesFull">
        </div>
        <div id="myContentFull">
        </div>
      </div>
    </div>
  </div>
`;

  script.addEventListener("load", async () => {
    const ipfslink = await ContractVerifier.getSourcesJsonUrl(
      "/rX/aCDi/w2Ug+fg1iyBfYRniftK5YDIeIZtlZ2r1cA=",
      { httpApiEndpoint: "https://scalable-api.tonwhales.com/jsonRPC" }
    );

    if (ipfslink) {
      const sourcesData = await ContractVerifier.getSourcesData(ipfslink);
      console.log(sourcesData);
      const theme =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";

      // Full
      ContractVerifierUI.loadSourcesData(sourcesData, {
        containerSelector: "#myContainerFull",
        fileListSelector: "#myFilesFull",
        contentSelector: "#myContentFull",
        theme,
      });
    }
  });
})();
