import React from "react";
import { TwitterShareButton, TwitterIcon } from "react-share";
import { Tooltip } from "@mui/material";

type Result = {
  speed: number;
  accuracy: number;
  codeTitle: string;
  textLength: number;
};

type Props = {
  result: Result;
};

const TwitterShare: React.VFC<Props> = ({ result }) => (
  <Tooltip title="結果をシェア" placement="top">
    <div>
      <TwitterShareButton
        url="https://develop--recursion-team-n-typing-game.netlify.app/"
        title={`TypeCodeでタイピング速度を計測しました! ${result.textLength}文字, 精度 ${result.accuracy} %, ${result.speed} KPM`}
      >
        <TwitterIcon size={40} round />
      </TwitterShareButton>
    </div>
  </Tooltip>
);

export default TwitterShare;
