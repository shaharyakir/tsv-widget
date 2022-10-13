import hljs from "highlight.js";
import hljsDefine from "highlightjs-func";
import "highlight.js/styles/github.css";
hljsDefine(hljs);

/**
 *
 */
export default class CodeHighlighter {
  private editor: HTMLElement;
  private readonly theme: string;
  private tsvLanguageIndex: number = 0;

  /**
   *
   * @param theme
   */
  constructor(theme: string) {
    this.theme = theme;
  }

  /**
   *
   * @param shadowRoot
   * @param element
   */
  async init(shadowRoot: ShadowRoot, element: HTMLTextAreaElement) {
    // Attach the created element to the shadow DOM
    this.editor = element;
  }

  /**
   *
   * @param value
   */
  async setCode(value) {
    this.editor.innerHTML = value;
    hljs.highlightElement(this.editor);
    hljs.highlightAll();
  }
}
