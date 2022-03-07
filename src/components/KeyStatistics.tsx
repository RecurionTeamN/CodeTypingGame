import React from "react";

type Hand = 'left'|'right';

type Finger = 'thumb'|'first'|'second'|'third'|'fourth';

type KeyData = {
    keyName: string,
    hand: Hand,
    finger: Finger,
    pushCount: number,
    missCount: number,
    timeSecCount: number,
}

type Props = {
    data: KeyData[],
}

const KeyStatistics = (props: Props) => {
    const { data } = props;
    const statistics = data.map((keyData) => {
        const accuracy = Math.floor((keyData.pushCount - keyData.missCount) / keyData.pushCount * 100);
        const speed = (keyData.pushCount - keyData.missCount) / (keyData.timeSecCount / 60);
        return(
            <div key={keyData.keyName}>
                [{keyData.keyName}]: {accuracy}%, {speed}wpm
            </div>
        )
    });

    // 後々にキーボードのコンポーネントを作成して、キー毎の統計を見やすいデザインとする。
    return (
        <div>
            <h3>Keybord Master</h3>
            <p>*キー毎の統計情報表示をこれから詳細に開発する。以下は現在の例</p>
            {statistics}
        </div>
    );
}

export default KeyStatistics;