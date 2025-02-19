import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Box, Typography } from "@mui/material";

export default class SahredDialog extends React.Component {
  handleClose = () => {
    const { closeHandler } = this.props;
    closeHandler(false);
  };

  render() {
    const { open, item } = this.props;
    return (
      <React.Fragment>
        <Dialog open={open} onClose={this.handleClose}>
          <DialogTitle sx={{ p: "40px" }}>See this user</DialogTitle>
          <DialogContent sx={{ p: "40px" }}>
            <Box>
              <Typography>Name: {item.name}</Typography>
              <Typography>Username: {item.username}</Typography>
              <Typography>Email: {item.email}</Typography>
              <Typography>
                Adress:{" "}
                {item.address.street +
                  ", " +
                  item.address.suite +
                  ", " +
                  item.address.city}
              </Typography>
              <Typography>Phone: {item.phone}</Typography>
              <Typography>Website: {item.website}</Typography>
              <Typography>Company: {item.company.name}</Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                this.handleClose();
              }}
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}
