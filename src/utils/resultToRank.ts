const resultToRank = (kpm: number, accuracy: number) => {
  if (accuracy >= 80) {
    if (kpm >= 500) {
      return "宇宙人👽";
    }
    if (kpm >= 400) {
      return "プロレベル⭐⭐";
    }
    if (kpm >= 350) {
      return "プロ並み⭐";
    }
    if (kpm >= 250) {
      return "エンジニアの平均以上😄";
    }
    if (kpm >= 200) {
      return "平均以上😄";
    }
    if (kpm >= 150) {
      return "平均レベル🙂";
    }
    if (kpm >= 0) {
      return "亀さん🐢";
    }
  } else if (accuracy >= 50) {
    if (kpm >= 250) {
      return "平均以上😄";
    }
    if (kpm >= 150) {
      return "平均レベル🙂";
    }
    if (kpm >= 100) {
      return "亀さん🐢";
    }
    if (kpm >= 0) {
      return "原始人🍗";
    }
  } else {
    if (kpm >= 200) {
      return "平均レベル🙂";
    }
    if (kpm >= 150) {
      return "亀さん🐢";
    }
    if (kpm >= 0) {
      return "原始人🍗";
    }
  }

  return "";
};

export default resultToRank;
