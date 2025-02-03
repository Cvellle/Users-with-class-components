import React from "react";
import Box from "@mui/material/Box";
import SahredTable from "./components/shared/SharedTable";
import { getUsers } from "./api/getUsers";
import { CircularProgress, FormControlLabel, Switch, Typography } from "@mui/material";
import SahredDialog from "./components/shared/SharedDialog";
import SahredSearchInput from "./components/shared/SahredSearchInput";

export default class App extends React.Component {
  state = {
    users: null,
    usersFetched: false,
    dialog: {
      open: false,
      action: "edit",
    },
    toEdit: null,
    usersToSave: [],
    toFilter: "",
    caseSensitive: false,
  };

  componentDidMount() {
    getUsers()
      .then((users) => {
        this.setState({
          users,
          usersFetched: true,
        });
      })
      .catch((error) => {
        error.message;
      });
  }

  handleEditOpen = (row) => {
    this.setState({
      dialog: {
        open: true,
        action: "see",
        item: row,
      },
    });
  };

  handleClose = () => {
    this.setState({
      dialog: {
        open: false,
        action: null,
        item: null,
      },
    });
  };

  handleTableEvent = (event, action, row) => {
    const { users } = this.state;
    if (action === "see") {
      this.handleEditOpen(row);
    } else if (action === "delete") {
      this.deleteItem(row);
    } else if (action === "edit") {
      this.setState({ toEdit: row, usersToSave: users });
    }
  };

  handleSubmit = (data) => {
    const { users } = this.state;
    let newUsers = users.map((user) => {
      if (user.id === data.id) {
        return data;
      } else {
        return user;
      }
    });

    this.setState({
      users: newUsers,
    });
  };

  deleteItem = (data) => {
    const { users } = this.state;
    let newUsers = users.filter((user) => {
      return user.id !== data.id;
    });

    this.setState({
      users: newUsers,
    });
  };

  setUsersToSave = (event, row, column) => {
    const { users } = this.state;
    let changedData = {
      ...row,
      [column.id]: event.target.value,
    };

    let newUsers = users.map((user) => {
      if (row.id === user.id) {
        return changedData;
      } else {
        return user;
      }
    });

    this.setState({
      usersToSave: newUsers,
    });
  };

  saveUsers = () => {
    const { usersToSave } = this.state;
    this.setState({ users: usersToSave, toEdit: null });
  };

  render() {
    const { users, usersFetched, dialog, toEdit, toFilter, caseSensitive } =
      this.state;

    return (
      <div>
        <Typography variant={'h1'} sx={{fontSize: '30px'}}>
          Users List
        </Typography>
        <Box sx={{ py: "20px" }}>
          <SahredSearchInput
            textHandler={(data) => {
              this.setState({ toFilter: data });
            }}
          />
          <Box>
            <FormControlLabel
              control={
                <Switch
                  onChange={(event) => {
                    this.setState({
                      caseSensitive: event.target.value,
                    });
                  }}
                />
              }
              label="Case sensitive"
            />
          </Box>
        </Box>
        {usersFetched ? (
          <SahredTable
            rows={users.filter((user) => {
              let sensitiveOrNot = caseSensitive
                ? user.name.includes(toFilter)
                : user.name.toLowerCase().includes(toFilter.toLowerCase());
              return toFilter.length ? sensitiveOrNot : user;
            })}
            sendEvent={this.handleTableEvent}
            toEditProp={toEdit}
            setStateToSave={this.setUsersToSave}
            saveUsersHandler={this.saveUsers}
          />
        ) : (
          <Box
            sx={{
              display: "flex",
              height: "100vh",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress />
          </Box>
        )}
        {dialog.open && dialog?.action === "see" ? (
          <SahredDialog
            open={dialog?.open}
            closeHandler={this.handleClose}
            item={dialog.item}
          />
        ) : null}
      </div>
    );
  }
}
