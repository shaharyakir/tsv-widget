/**
 *
 */
export default class CodeHighlighter {
    private editor;
    private readonly theme;
    constructor(theme: string);
    /**
     *
     * @param shadowRoot
     * @param element
     */
    init(shadowRoot: ShadowRoot, element: HTMLTextAreaElement): Promise<void>;
    setCode(value: any): void;
}
