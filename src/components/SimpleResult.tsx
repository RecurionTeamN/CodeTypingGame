import React from "react";

type Props = {
  language: string;
  accuracy: number;
  speed: number;
};

const SimpleResult: React.VFC<Props> = ({ language, accuracy, speed }) => (
  <div>
    <h3>Result({language})</h3>
    <p>*円グラフなどをこれから開発する</p>
    <div>Accuracy: {accuracy}%</div>
    <div>Speed: {speed}wpm</div>
  </div>
);

export default SimpleResult;
