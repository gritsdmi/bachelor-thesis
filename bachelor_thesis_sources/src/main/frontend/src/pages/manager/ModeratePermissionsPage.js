import React from "react";
import {withStyles} from "@material-ui/core/styles";
import SearchBox from "../../components/SearchBox";
import {handleResponseError, post} from "../../utils/request"
import Pagination from "@material-ui/lab/Pagination";
import Box from "@material-ui/core/Box";
import {ListItemText, Snackbar, Typography} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import CreateUserDialog from "../../components/manage/CreateUserDialog";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Paper from "@material-ui/core/Paper";


const useStyles = theme => ({

    paginationBox: {
        margin: theme.spacing(1),
        display: 'flex',
        justifyContent: 'flex-end',
    },

    typography: {
        alignSelf: 'center',
    },
    flex: {
        display: 'flex',
    },
});

const InitialState = {

    users: [],

    currentPattern: '',

    createUserDialogOpen: false,

    currentPage: 1,
    size: 10, //count items in current page
    totalItemsCount: null,
    totalPagesCount: null,

    pageSizes: [10, 25, 50, 100],
    snackOpen: false,

}

class ModeratePermissionsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...InitialState,
        }
    }

    componentDidMount() {
        this.fetchUsers(true)
    }

    fetchUsers(paginationChanged) {

        const pageTO = {
            page: paginationChanged ? this.state.currentPage - 1 : this.state.currentPage,
            size: this.state.size,
            pattern: this.state.currentPattern,
        }

        post('/user/page', pageTO)
            .then(res => {
                this.setState({
                        users: res.data.list,
                        currentPage: res.data.currentPage,
                        totalItemsCount: res.data.totalItemsCount,
                        totalPagesCount: res.data.totalPagesCount,
                    }
                )
            })
            .catch(err => handleResponseError(err))
    }

    onChangeInput = (e) => {
        this.setState({
            currentPattern: e.target.value,
        }, () => this.fetchUsers())
    }

    onChangePagination = (event, value) => {
        this.setState({
            currentPage: value,
        }, () => this.fetchUsers(true))
    }

    onClickEditUser = (user) => {
        console.log("onClickEditUser", user)
    }

    onCLickCreateUser = () => {
        this.setState({
            createUserDialogOpen: true,
        })
    }

    onCloseCreateUserDialog = () => {
        this.setState({
            createUserDialogOpen: false,
        })
    }

    onSaveUser = () => {
        this.onCloseCreateUserDialog()
        this.setState({snackOpen: true})
        this.fetchUsers()
    }

    render() {
        const {classes} = this.props

        return (
            <>
                <h1>Moderate permissions</h1>

                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.snackOpen}
                    autoHideDuration={4000}
                    onClose={() => this.setState({snackOpen: false})}
                    message="User successfully created"
                    action={
                        <React.Fragment>
                            <IconButton size="small" aria-label="close" color="inherit"
                                        onClick={() => this.setState({snackOpen: false})}
                            >
                                <CloseIcon fontSize="small"/>
                            </IconButton>
                        </React.Fragment>
                    }
                />
                <SearchBox
                    onChange={this.onChangeInput}
                />
                create new user
                <Button
                    onClick={this.onCLickCreateUser}
                    color={'primary'}
                    variant={'contained'}
                >
                    create
                </Button>
                <CreateUserDialog
                    open={this.state.createUserDialogOpen}
                    onClose={this.onCloseCreateUserDialog}
                    onSave={this.onSaveUser}
                />
                <Box className={classes.paginationBox}>
                    <Pagination
                        count={this.state.totalPagesCount}
                        page={this.state.currentPage + 1}
                        siblingCount={1}
                        boundaryCount={1}
                        shape="rounded"
                        onChange={this.onChangePagination}
                    />
                    <Box className={classes.flex}>
                        <Typography className={classes.typography}>Items per page: </Typography>
                        <TextField
                            select
                            value={this.state.size}
                            onChange={this.onChangePageSize}
                            className={classes.pageSelect}
                        >
                            {this.state.pageSizes.map((size, idx) => (
                                <MenuItem
                                    key={idx}
                                    value={size}
                                >
                                    {size}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                </Box>
                <Paper>
                    <List>
                        {
                            this.state.users.map((user, idx) => {
                                return (
                                    <Box key={idx}>
                                        <ListItem>
                                            <ListItemText primary={user.name + " " + user.surname}/>
                                            <Button
                                                color={'primary'}
                                                variant={'contained'}
                                                onClick={() => this.onClickEditUser(user)}
                                            >
                                                Edit user
                                            </Button>
                                        </ListItem>
                                        {idx !== this.state.users.length - 1 &&
                                        <Divider/>
                                        }
                                    </Box>

                                )
                            })
                        }
                    </List>
                </Paper>
                <Box className={classes.paginationBox}>
                    <Pagination
                        count={this.state.totalPagesCount}
                        page={this.state.currentPage + 1}
                        siblingCount={1}
                        boundaryCount={1}
                        shape="rounded"
                        onChange={this.onChangePagination}
                    />
                    <Box className={classes.flex}>
                        <Typography className={classes.typography}>Items per page: </Typography>
                        <TextField
                            select
                            value={this.state.size}
                            onChange={this.onChangePageSize}
                            className={classes.pageSelect}
                        >
                            {this.state.pageSizes.map((size, idx) => (
                                <MenuItem
                                    key={idx}
                                    value={size}
                                >
                                    {size}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                </Box>
            </>
        );
    }

}

export default withStyles(useStyles)(ModeratePermissionsPage)
