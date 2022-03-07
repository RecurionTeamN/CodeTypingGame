import React from "react";

type Props = {
  language: string;
  accuracy: number;
  speed: number;
};

const SimpleResult = (props: Props) => {
  const { language, accuracy, speed } = props;
  return (
    <div>
      <h3>Result({language})</h3>
      <p>*円グラフなどをこれから開発する</p>
      <div>Accuracy: {accuracy}</div>
      <div>Speed: {speed}</div>
    </div>
  );
};

export default SimpleResult;
