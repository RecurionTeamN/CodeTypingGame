import React from "react";
import { KeyData } from "../../data/keyboardData";

type Props = {
  data: KeyData;
};

const KeyStatistics: React.VFC<Props> = ({ data }) => {
  const statistics = (Object.keys(data) as (keyof typeof data)[]).map((keyName) => {
    const pushCount = data[keyName].pushCount ?? 0;
    const missCount = data[keyName].missCount ?? 0;
    const timeSecCount = data[keyName].timeSecCount ?? 0;
    const accuracy = Math.floor(((pushCount - missCount) / pushCount) * 100);
    const speed = (pushCount - missCount) / (timeSecCount / 60);
    return (
      <div key={keyName}>
        [{keyName}]: {accuracy}%, {speed}kpm
      </div>
    );
  });

  // 後々にキーボードのコンポーネントを作成して、キー毎の統計を見やすいデザインとする。
  return (
    <div>
      <h3>Keybord Master</h3>
      <p>*キー毎の統計情報表示をこれから詳細に開発する。以下は現在の例</p>
      {statistics}
    </div>
  );
};

export default KeyStatistics;
