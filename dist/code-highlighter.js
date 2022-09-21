"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const onigasm_1 = require("onigasm");
const codemirror_textmate_1 = require("codemirror-textmate");
const CodeMirror = require("codemirror");
/**
 *
 */
class CodeHighlighter {
    constructor(theme) {
        this.theme = theme;
    }
    /**
     *
     * @param shadowRoot
     * @param element
     */
    init(shadowRoot, element) {
        return __awaiter(this, void 0, void 0, function* () {
            codemirror_textmate_1.setRoot(shadowRoot);
            yield onigasm_1.loadWASM(
            // webpack has been configured to resolve `.wasm` files to actual 'paths" as opposed to using the built-in wasm-loader
            // oniguruma is a low-level library and stock wasm-loader isn't equipped with advanced low-level API's to interact with libonig
            require('onigasm/lib/onigasm.wasm'));
            const grammars = {
                'source.func': {
                    loader: () => Promise.resolve().then(() => require('./tm/grammar/func.tmLanguage.json')),
                    language: 'func',
                    priority: 'now'
                }
            };
            // To avoid FOUC, await for high priority languages to get ready (loading/compiling takes time, and it's an async process for which CM won't wait)
            yield Promise.all(Object.keys(grammars).map((scopeName) => __awaiter(this, void 0, void 0, function* () {
                const { loader, language, priority } = grammars[scopeName];
                codemirror_textmate_1.addGrammar(scopeName, loader);
                if (language) {
                    const prom = codemirror_textmate_1.activateLanguage(scopeName, language, priority);
                    // We must "wait" for high priority languages to load/compile before we render editor to avoid FOUC (Flash of Unstyled Content)
                    if (priority === 'now') {
                        yield prom;
                    }
                    // 'asap' although "awaitable", is a medium priority, and doesn't need to be waited for
                    // 'defer' doesn't support awaiting at all
                    return;
                }
            })));
            this.editor = CodeMirror.fromTextArea(element, {
                lineNumbers: true,
                // If you know in advance a language is going to be set on CodeMirror editor and it isn't preloaded by setting the third argument
                // to `activateLanguage` to 'now', the contents of the editor would start of and remain as unhighlighted text, until loading is complete
                mode: 'func'
            });
            // Using Textmate theme in CodeMirror
            let cmTheme = yield Promise.resolve().then(() => require(this.theme === 'dark' ? './tm/themes/dark.tmTheme.json' : './tm/themes/light.tmTheme.json'));
            const themeX = Object.assign(Object.assign({}, cmTheme), { gutterSettings: cmTheme.gutterSettings });
            codemirror_textmate_1.addTheme(themeX);
            this.editor.setOption('theme', themeX.name);
            // Grammar injections, example code below will highlight css-in-js (styled-components, emotion)
            // injections are "injections", they are not standalone-grammars, therefore no `activateLanguage`
            codemirror_textmate_1.addGrammar('source.func', () => Promise.resolve().then(() => require('./tm/grammar/func.tmLanguage.json')));
            const affectedLanguages = yield codemirror_textmate_1.linkInjections('source.func', ['source.func']);
            console.log(affectedLanguages);
            // You must re-trigger tokenization to apply the update above (if applicable)
            const activeMode = this.editor.getOption('mode');
            if (affectedLanguages.indexOf(activeMode.toString()) > -1) {
                // Resetting cm's mode re-triggers tokenization of entire document
                this.editor.setOption('mode', activeMode);
            }
        });
    }
    setCode(value) {
        this.editor.setValue(value);
    }
}
exports.default = CodeHighlighter;
//# sourceMappingURL=code-highlighter.js.map