// 15-5 解答例
declare global {
  interface Window {
    __appVersion: string;
  }
}

// これがないとスクリプトファイル扱いになり、declare global が使えない
export {};
