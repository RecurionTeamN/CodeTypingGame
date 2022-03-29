import React from "react";
import { Button, Checkbox, Grid, TextField } from "@mui/material";

type Props = {
  additionalCodeRef: React.MutableRefObject<string>;
  githubContentRef: React.MutableRefObject<string>;
  isCodePasteMode: boolean;
  handleCheckeBoxSwitch: () => void;
  handleAdditionalCodeChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleGithubContentRefChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleGithubURLChange: (baseUrl: string) => void;
};

const PersonalCodeImport: React.VFC<Props> = ({
  additionalCodeRef,
  githubContentRef,
  isCodePasteMode,
  handleCheckeBoxSwitch,
  handleAdditionalCodeChange,
  handleGithubContentRefChange,
  handleGithubURLChange,
}) => (
  <>
    <Grid container direction="row" justifyContent="left" alignItems="center">
      <Grid item xs={1}>
        <Checkbox checked={isCodePasteMode} color="secondary" onClick={handleCheckeBoxSwitch} />
      </Grid>
      <Grid item xs={10}>
        <TextField
          id="paste-code-input"
          disabled={!isCodePasteMode}
          required={isCodePasteMode}
          inputRef={additionalCodeRef}
          label="Paste code here"
          fullWidth
          margin="normal"
          rows={4}
          multiline
          variant="outlined"
          onChange={handleAdditionalCodeChange}
        />
      </Grid>
    </Grid>

    <Grid container direction="row" justifyContent="left" alignItems="center">
      <Grid item xs={1}>
        <Checkbox checked={!isCodePasteMode} onClick={handleCheckeBoxSwitch} color="secondary" />
      </Grid>
      <Grid item xs={8}>
        <TextField
          id="github-code-URL"
          disabled={isCodePasteMode}
          required={!isCodePasteMode}
          inputRef={githubContentRef}
          label="GitHub Code URL"
          onChange={handleGithubContentRefChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={3}>
        <Button
          disabled={isCodePasteMode}
          color="primary"
          variant="contained"
          size="small"
          onClick={() => {
            if (typeof githubContentRef.current === "string") {
              handleGithubURLChange(githubContentRef.current);
            }
          }}
          fullWidth
          style={{ height: "55px", width: "80%", marginLeft: "10px", marginRight: "10px" }}
        >
          Load github code
        </Button>
      </Grid>
    </Grid>
  </>
);

export default PersonalCodeImport;
