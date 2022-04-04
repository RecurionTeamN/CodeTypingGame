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
  rank: string;
};

const domain = process.env.REACT_APP_DOMAIN || "localhost:3000";

const TwitterShare: React.VFC<Props> = ({ result, rank }) => (
  <>
    <Tooltip title="Share to Twitter" placement="top">
      <div>
        <TwitterShareButton
          url={domain}
          title={`TypeCodeでタイピング速度を計測しました! ${result.textLength}文字, 精度 ${result.accuracy} %, ${result.speed} KPM。 今回のレベルは ${rank} でした！`}
          hashtags={["RecursionCS", "TypeCode"]}
        >
          <TwitterIcon size={40} round />
        </TwitterShareButton>
      </div>
    </Tooltip>
    <span>結果をシェアする</span>
  </>
);

export default TwitterShare;
