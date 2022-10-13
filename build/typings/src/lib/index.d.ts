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
    interface Window {
        ContractVerifier: typeof y;
    }
}
declare const y: {
    getSourcesJsonUrl: (codeCellHash: string, options?: GetSourcesOptions) => Promise<string | null>;
    getSourcesData: (sourcesJsonUrl: string, ipfsConverter?: IpfsUrlConverterFunc) => Promise<SourcesData>;
};
export {};
