import React from "react";
import Box from "@mui/material/Box";
import UserTable from "./components/UserTable";
import { getUsers } from "./api/getUsers";
import {
  CircularProgress,
  FormControlLabel,
  Switch,
  Typography,
} from "@mui/material";
import UserDetails from "./components/UserDetails";
import Filter from "./components/Filter";
import { userColumns } from "./columns/userColumns";

export default class App extends React.Component {
  state = {
    users: null,
    usersFetched: false,
    dialog: {
      open: false,
      action: "edit",
    },
    toEdit: null,
    userToSave: null,
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
    if (action === "see") {
      this.handleEditOpen(row);
    } else if (action === "delete") {
      this.deleteItem(row);
    } else if (action === "edit") {
      this.setState({ toEdit: row, userToSave: row });
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
    const { userToSave } = this.state;
    let changedData = {
      ...row,
      ...userToSave,
      [column.id]: event.target.value,
    };

    this.setState({
      userToSave: changedData,
    });
  };

  saveUsers = () => {
    const { users, userToSave } = this.state;
    let newUsers = users.map((user) => {
      if (userToSave.id === user.id) {
        return userToSave;
      } else {
        return user;
      }
    });
    this.setState({ users: newUsers, toEdit: null });
  };

  render() {
    const { users, usersFetched, dialog, toEdit, toFilter, caseSensitive } =
      this.state;
    const filteredUsers = users?.filter((user) => {
      let sensitiveOrNot = caseSensitive
        ? user.name.includes(toFilter)
        : user.name.toLowerCase().includes(toFilter.toLowerCase());
      return toFilter.length ? sensitiveOrNot : user;
    });

    return (
      <div>
        <Typography variant={"h1"} sx={{ fontSize: "35px" }}>
          Users List
        </Typography>
        <Box sx={{ py: "20px" }}>
          <Filter
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
          <UserTable
            rows={filteredUsers}
            columns={userColumns}
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
          <UserDetails
            open={dialog?.open}
            closeHandler={this.handleClose}
            item={dialog.item}
          />
        ) : null}
      </div>
    );
  }
}
