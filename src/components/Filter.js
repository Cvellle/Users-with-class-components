import * as React from "react";

import { TextField } from "@mui/material";

export default class Filter extends React.Component {
  constructor() {
    super();
    this.textInput = React.createRef();
  }

  valueHandler = () => {
    const { textHandler } = this.props;
    textHandler(this.textInput.current);
  };

  searchDelayed = (event) => {
    this.textInput.current = event.target.value;
    clearTimeout(this.getDataTimeout);
    this.getDataTimeout = setTimeout(this.valueHandler, 200);
  };

  render() {
    return (
      <TextField
        label="Filter"
        variant="outlined"
        onChange={(event) => {
          this.searchDelayed(event);
        }}
      />
    );
  }
}
