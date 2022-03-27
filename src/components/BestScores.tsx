import React from "react";

type Best = {
  [language: string]: {
    accuracy: number;
    speed: number;
  };
};

type Props = {
  data: Best;
};

const BestScores: React.VFC<Props> = ({ data }) => {
  const results = Object.keys(data).map((language) => (
    <li key={language}>
      {language}: {data[language].accuracy}%, {data[language].speed}kpm
    </li>
  ));

  return (
    <div>
      <h3>Best Scores</h3>
      <ul>{results}</ul>
    </div>
  );
};

export default BestScores;
