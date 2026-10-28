import { lookupWord } from './dict';

/** 阅读器依赖的词典边界；可替换为远程词典或上下文服务。 */
export interface DictionaryService {
  lookup: typeof lookupWord;
}

export const dictionaryService: DictionaryService = { lookup: lookupWord };
