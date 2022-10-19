interface GetSourcesOptions {
    verifier?: string;
    httpApiEndpoint?: string;
    httpApiKey?: string;
}
interface SourcesData {
    files: {
        name: string;
        content: string;
    }[];
}
declare type IpfsUrlConverterFunc = (ipfsUrl: string) => string;
declare global {
    var ContractVerifier: typeof _ContractVerifier;
    var ContractVerifierUI: typeof _ContractVerifierUI;
}
declare const _ContractVerifier: {
    getSourcesJsonUrl: (codeCellHash: string, options?: GetSourcesOptions) => Promise<string | null>;
    getSourcesData: (sourcesJsonUrl: string, ipfsConverter?: IpfsUrlConverterFunc) => Promise<SourcesData>;
};
declare var _ContractVerifierUI: {
    classNames: {
        CONTAINER: string;
        FILES: string;
        FILE: string;
        CONTENT: string;
    };
    _populateCode: (contentSelector: string, theme: "dark" | "light") => void;
    _setCode: ({ name, content }: {
        name: string;
        content: string;
    }, codeWrapperEl: HTMLElement, filesListEl?: HTMLElement, fileEl?: HTMLElement) => void;
    setCode: (contentSelector: string, content: string) => void;
    _populateFiles: (fileListSelector: string, contentSelector: string, files: {
        name: string;
        content: string;
    }[], theme: "dark" | "light") => void;
    _populateContainer: (selector: string, layout?: "row" | "column") => void;
    loadSourcesData: (opts: {
        containerSelector: string;
        fileListSelector?: string;
        contentSelector: string;
        sourcesData: SourcesData;
        theme: "dark" | "light";
        layout?: "row" | "column";
    }) => void;
};
export {};