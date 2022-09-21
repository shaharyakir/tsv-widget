# Ton Contract Sources Verifier 

## Table of Contents

- Table of Contents
- TL;DR
- Getting Started
- License


## TL;DR
Ton contract code viewer for func with code highlighting 

## ⭐️ Features

- Fetches contract sources code from the ipfs via a sources.json url  
- Displays code navigator with code highlighting


## 📦 Getting Started

Install the npm package
```
npm install ton-sources-verifier-widget
```
then in your html (or any other ui framework)
```
<tsv-widget ipfs-provider="https://tonsource.infura-ipfs.io"
            verified-contract-url="ipfs://Qmc2XaToAq77pcsQLS4qv3qnnkjjSFDPwqBi9kJXJnbiSr"
            theme="light"
            layout="horizontal">
</tsv-widget>

```

## 💎 Customization

### Native

Layout can be to either "horizontal" or "vertical"

``` layout="horizontal" ``` (default)

``` layout="vertical" ```

Theme can be set to either "light" or "dark"

``` theme="light" ``` (default)

``` theme="dark" ```

### CSS
The tsv-widget is a custom element, which means that in order to get access to its internal components you need to access the shadow tree of the element.
For css you can use "part" selector to access internal elements inside the shadow tree

For example (on the document level): 

``` 
<style>
    #widget::part(container-tabs) {
        background-color: deeppink !important;
    }
</style>
```

## 📔 License

MIT
