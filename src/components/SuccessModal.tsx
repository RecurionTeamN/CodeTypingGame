import React from "react";
import { makeStyles } from "@mui/styles";
import { Modal, Backdrop, Slide, Box, Typography } from "@mui/material";

import formatTime from "../utils/formatTime";

type Result = {
  timeTyping: number;
  missCount: number;
  textLength: number;
};

type Props = {
  result: Result;
  successModalOpen: boolean;
  successModalClose: () => void;
};

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    position: "absolute",
    width: 500,
    border: "2px solid #2bbeed",
    boxShadow: "2px solid #000",
    backgroundColor: "#e0e0e0",
    textAlign: "center",
    padding: "30px",
    "&:focus": {
      outline: "none",
    },
  },
  content: {
    fontSize: "20px",
  },
}));

const SuccessModal: React.VFC<Props> = ({ result, successModalOpen, successModalClose }) => {
  const classes = useStyles();
  const cpm = ((result.textLength / result.timeTyping) * 1000 * 60).toFixed(0);

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={successModalOpen}
        onClose={successModalClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Slide direction="up" in={successModalOpen} mountOnEnter unmountOnExit>
          <Box className={classes.paper}>
            <Typography id="transition-modal-title" variant="h4" component="h2">
              CONGRATULATIONS!
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              文字数: {result.textLength}
              <br />
              タイム: {formatTime(result.timeTyping)}
              <br />
              精度: {((result.textLength / (result.textLength + result.missCount)) * 100).toFixed(1)}%<br />
              CPM(1分間あたりの入力文字数): {cpm}
              <br />
            </Typography>
          </Box>
        </Slide>
      </Modal>
    </div>
  );
};

export default SuccessModal;
