import {loadWASM} from "onigasm"
import {activateLanguage, addGrammar, addTheme, ITextmateThemePlus, linkInjections, setRoot} from "codemirror-textmate"
import * as CodeMirror from "codemirror"

/**
 *
 */
export default class CodeHighlighter {

    private editor: CodeMirror.EditorFromTextArea
    private readonly theme: string

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

        await loadWASM(
            // webpack has been configured to resolve `.wasm` files to actual 'paths" as opposed to using the built-in wasm-loader
            // oniguruma is a low-level library and stock wasm-loader isn't equipped with advanced low-level API's to interact with libonig
            require('onigasm/lib/onigasm.wasm'))

        const grammars = {
            'source.func': {
                loader: () => import('./tm/grammar/func.tmLanguage.json'),
                language: 'func',
                priority: 'now'
            }
        }

        // To avoid FOUC, await for high priority languages to get ready (loading/compiling takes time, and it's an async process for which CM won't wait)
        await Promise.all(Object.keys(grammars).map(async scopeName => {
            const {loader, language, priority} = grammars[scopeName]

            addGrammar(scopeName, loader)

            if (language) {
                const prom = activateLanguage(scopeName, language, priority)

                // We must "wait" for high priority languages to load/compile before we render editor to avoid FOUC (Flash of Unstyled Content)
                if (priority === 'now') {
                    await prom
                }

                // 'asap' although "awaitable", is a medium priority, and doesn't need to be waited for
                // 'defer' doesn't support awaiting at all
                return
            }
        }))

        this.editor = CodeMirror.fromTextArea(element, {
            lineNumbers: true,
            // If you know in advance a language is going to be set on CodeMirror editor and it isn't preloaded by setting the third argument
            // to `activateLanguage` to 'now', the contents of the editor would start of and remain as unhighlighted text, until loading is complete
            mode: 'func'
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

        // Grammar injections, example code below will highlight css-in-js (styled-components, emotion)
        // injections are "injections", they are not standalone-grammars, therefore no `activateLanguage`
        addGrammar('source.func', () => import('./tm/grammar/func.tmLanguage.json') as any)

        const affectedLanguages = await linkInjections('source.func', ['source.func'])

        console.log(affectedLanguages)
        // You must re-trigger tokenization to apply the update above (if applicable)
        const activeMode = this.editor.getOption('mode')
        if (affectedLanguages.indexOf(activeMode.toString()) > -1) {
            // Resetting cm's mode re-triggers tokenization of entire document
            this.editor.setOption('mode', activeMode)
        }
    }

    setCode(value) {

        this.editor.setValue(value)

    }

}
