import "highlight.js/styles/github.css";
/**
 *
 */
export default class CodeHighlighter {
    private editor;
    private readonly theme;
    private tsvLanguageIndex;
    /**
     *
     * @param theme
     */
    constructor(theme: string);
    /**
     *
     * @param shadowRoot
     * @param element
     */
    init(shadowRoot: ShadowRoot, element: HTMLTextAreaElement): Promise<void>;
    /**
     *
     * @param value
     */
    setCode(value: any): Promise<void>;
}
