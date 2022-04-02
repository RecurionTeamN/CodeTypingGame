import React from "react";
import { GameHistoryDocument } from "../../firebase/GameHistory/types";

type Props = {
  gameHistory: GameHistoryDocument[] | undefined;
};

const LineChart: React.VFC<Props> = ({ gameHistory }) => <div>LineChart</div>;

export default LineChart;
