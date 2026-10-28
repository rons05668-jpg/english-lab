/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 在线词典端点前缀，默认 https://api.dictionaryapi.dev/api/v2/entries/en */
  readonly VITE_DICTIONARY_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
