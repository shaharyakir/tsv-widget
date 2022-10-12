/**
 *
 */
export default class TSVWidgetElement extends HTMLElement {
    private ch;
    private sources;
    private selectedFile;
    private ipfsProvider;
    private verifiedContractUrl;
    private verifiedContract;
    private theme;
    private layout;
    /**
     *
     */
    constructor();
    /**
     * Runs each time the element is appended to or moved in the DOM
     */
    connectedCallback(): Promise<void>;
    bindTabChangeEvents(): void;
    /**
     * fetch sources from the verified contract json url
     */
    fetchSources(): Promise<void>;
    /**
     * builds the external container element and appends it to the shadow root
     */
    buildContainer(): Promise<void>;
    /**
     * builds the html tabs
     */
    buildTabs(): Promise<void>;
    /**
     * select a specific file and corresponding tab
     *
     * @param filename
     */
    selectFile(filename: any): void;
    /**
     * Runs when the element is removed from the DOM
     */
    disconnectedCallback(): void;
    /**
     *
     */
    get tabsButtons(): HTMLDivElement;
    /**
     *
     */
    get loadingCurtain(): HTMLDivElement;
    /**
     *
     */
    get cmHost(): HTMLTextAreaElement;
}
