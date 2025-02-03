import * as React from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from "@mui/material/Paper";
import { visuallyHidden } from "@mui/utils";
import { getComparator } from "../../shared/helpers/sortHelpers";
import { userColumns } from "../../columns/userColumns";
import { Button, TextField } from "@mui/material";
import { Delete, Edit, Save } from "@mui/icons-material";

export default class SahredTable extends React.Component {
  state = {
    order: "asc",
    orderBy: "",
  };

  handleRequestSort = (event, property) => {
    const { order, orderBy } = this.state;
    const isAsc = orderBy === property && order === "asc";
    this.setState({ order: isAsc ? "desc" : "asc" });
    this.setState({ orderBy: property });
  };

  handleClick = (event, action, row) => {
    this.props.sendEvent(event, action, row);
  };

  createSortHandler = (property) => (event) => {
    this.handleRequestSort(event, property);
  };

  render() {
    const { order, orderBy } = this.state;
    const { rows, toEditProp, saveUsersHandler } = this.props;

    return (
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              dense={"small"}
            >
              <TableHead>
                <TableRow>
                  {userColumns.map((headCell) => (
                    <TableCell
                      key={headCell.id}
                      align={headCell.numeric ? "right" : "left"}
                      padding={headCell.disablePadding ? "none" : "normal"}
                      sortDirection={orderBy === headCell.id ? order : false}
                    >
                      <TableSortLabel
                        active={orderBy === headCell.id}
                        direction={orderBy === headCell.id ? order : "asc"}
                        onClick={this.createSortHandler(headCell.id)}
                      >
                        {headCell.label}
                        {orderBy === headCell.id ? (
                          <Box component="span" sx={visuallyHidden}>
                            {order === "desc"
                              ? "sorted descending"
                              : "sorted ascending"}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  ?.sort(getComparator(order, orderBy))
                  ?.map((row, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.id}
                        sx={{ cursor: "pointer" }}
                        onClick={(event) => {
                          this.handleClick(event, "see", row);
                        }}
                      >
                        {userColumns?.map((column) => {
                          return (
                            <TableCell
                              key={column.id}
                              align="left"
                              component="th"
                              id={labelId}
                              scope="row"
                            >
                              {toEditProp?.id === row.id ? (
                                <TextField
                                  onClick={(event)=>{
                                    event.stopPropagation()
                                  }}
                                  autoFocus
                                  required
                                  margin="dense"
                                  id={column.id}
                                  name={column.id}
                                  type="text"
                                  fullWidth
                                  variant="standard"
                                  defaultValue={row[column.id]}
                                  onChange={
                                    (event) => {
                                      this.props.setStateToSave(
                                        event,
                                        row,
                                        column
                                      );
                                    }
                                  }
                                />
                              ) : (
                                row[column.id]
                              )}
                            </TableCell>
                          );
                        })}
                        <TableCell>
                          {toEditProp?.id === row.id ? (
                            <Button
                              variant="outlined"
                              startIcon={<Save />}
                              onClick={(e) => {
                                e.stopPropagation();
                                saveUsersHandler();
                              }}
                            >
                              Save
                            </Button>
                          ) : (
                            <Button
                              variant="outlined"
                              startIcon={<Edit />}
                              onClick={(e) => {
                                e.stopPropagation();
                                this.handleClick(e, "edit", row);
                              }}
                            >
                              Edit
                            </Button>
                          )}
                          <Button
                            sx={{ ml: "15px" }}
                            variant="outlined"
                            startIcon={<Delete />}
                            onClick={(e) => {
                              e.stopPropagation();
                              this.handleClick(e, "delete", row);
                            }}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    );
  }
}
