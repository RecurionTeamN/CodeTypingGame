import React from "react";

type Best = {
    language: string,
    accuracy: number,
    speed: number,
}

type Props = {
    data: Best[],
}

const BestScores = (props: Props) => {
    const { data } = props;
    const results = data.map((result) => (
        <li key={result.language}>
            {result.language}: {result.accuracy}%, {result.speed}wpm
        </li>
    ));

    return (
        <div>
            <h3>Best Scores</h3>
            <ul>
                {results}
            </ul>
        </div>
    );
}

export default BestScores;