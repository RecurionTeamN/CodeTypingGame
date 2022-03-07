const formatTime = (ms: number) => {
  let s = ms / 1000;
  if (s >= 60) {
    const m = Math.floor(s / 60);
    s %= 60;
    return `${m}:${s.toFixed(2)}`;
  }
  return s.toFixed(2);
};

export default formatTime;
