const codeData = {
  Java: {
    title1: "Java content 1",
    title2: "Java content 2",
    title3: "Java content 3",
  },
  JavaScript: {
    title1: "JS content 1",
    title2: "JS content 2",
    title3: "JS content 3",
  },
  Python: {
    title1: "Python content 1",
    title2: "Python content 2",
    title3: "Python content 3",
  },
};

export default codeData;
export type Language = keyof typeof codeData;
// 以下の型定義を実現するためにはtitleは全言語で一致している必要がある。
// デフォルトコード追加時には全ての言語で追加しないといけないことを注意する。
export type CodeTitle = keyof typeof codeData[Language];
