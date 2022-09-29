import {loadWASM} from "onigasm"
import {activateLanguage, addGrammar, addTheme, ITextmateThemePlus, linkInjections, setRoot} from "codemirror-textmate"
import * as CodeMirror from "codemirror"
// do not remove, this import makes sure the wasm file is included in the bundle
import wasmBase64String from "./static/onigasm.wasm.js"
import Utils from "./Utils.js"

/**
 *
 */
export default class CodeHighlighter {

    private editor: CodeMirror.EditorFromTextArea
    private readonly theme: string
    private tsvLanguageIndex: number = 0

    /**
     *
     * @param theme
     */
    constructor(theme: string) {

        this.theme = theme

    }

    /**
     *
     * @param shadowRoot
     * @param element
     */
    async init(shadowRoot: ShadowRoot, element: HTMLTextAreaElement) {

        setRoot(shadowRoot)

        const scopeName = 'source.func'
        const language = 'func'

        this.tsvLanguageIndex++

        await loadWASM(
            Utils.base64ToArrayBuffer(wasmBase64String)
            // webpack has been configured to resolve `.wasm` files to actual 'paths" as opposed to using the built-in wasm-loader
            // oniguruma is a low-level library and stock wasm-loader isn't equipped with advanced low-level API's to interact with libonig
        )

        await addGrammar(scopeName, () => import('./tm/grammar/func.tmLanguage.json') as any)

        await activateLanguage(
            scopeName,
            language,
            'now'
        )

        this.editor = CodeMirror.fromTextArea(element, {
            lineNumbers: true,
            // If you know in advance a language is going to be set on CodeMirror editor and it isn't preloaded by setting the third argument
            // to `activateLanguage` to 'now', the contents of the editor would start of and remain as unhighlighted text, until loading is complete
            mode: language
        })

        // Using Textmate theme in CodeMirror
        let cmTheme = await import(
            this.theme === 'dark' ? './tm/themes/dark.tmTheme.json' : './tm/themes/light.tmTheme.json'
            )

        const themeX: ITextmateThemePlus = {
            ...cmTheme,
            gutterSettings: cmTheme.gutterSettings
        }

        addTheme(themeX)

        this.editor.setOption('theme', themeX.name)

        const affectedLanguages = await linkInjections(scopeName, [scopeName])

        console.log(affectedLanguages)
        // You must re-trigger tokenization to apply the update above (if applicable)
        const activeMode = this.editor.getOption('mode')
        if (affectedLanguages.indexOf(activeMode.toString()) > -1) {
            // Resetting cm's mode re-triggers tokenization of entire document
            this.editor.setOption('mode', activeMode)
        }
    }

    /**
     *
     * @param value
     */
    async setCode(value) {

        return this.editor.setValue(value)

    }

}
