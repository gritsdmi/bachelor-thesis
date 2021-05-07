import React from "react";
import Container from "@material-ui/core/Container";
import {handleResponseError, post} from "../../utils/request";
import SearchBox from "../../components/SearchBox";
import SearchResultPanel from "../../components/SearchResultPanel";
import EditTeacherDialogClass from "../../components/manage/EditTeacherDialogClass";
import Pagination from "@material-ui/lab/Pagination";
import {withStyles} from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";

const useStyles = theme => ({
    paginationBox: {
        margin: theme.spacing(1),
        display: 'flex',
        justifyContent: 'flex-end',
    },
    pageSelect: {
        width: '70px',
        marginLeft: '10px',
    },
    flex: {
        display: 'flex',
    },
    typography: {
        alignSelf: 'center',
    },
});

const InitialState = {
    teachers: [],
    currentTeacher: null,
    editTeacherDialogOpen: false,
    searchPattern: '',

    currentPage: 0,
    size: 10, //count items in current page
    totalItemsCount: null,
    totalPagesCount: null,

    pageSizes: [10, 25, 50, 100],
}

class ManageTeachersPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ...InitialState,
        }
    }

    componentDidMount() {
        this.fetchTeachers()
    }

    fetchTeachers(paginationChanged, patternChanged) {

        const pageTO = {
            page: paginationChanged ? this.state.currentPage - 1 : patternChanged ? 0 : this.state.currentPage,
            size: this.state.size,
            pattern: this.state.searchPattern,
        }
        console.log(pageTO)
        post(`/user/teacher/page`, pageTO)
            .then(res => {
                this.setState({
                    teachers: res.data.list,
                    currentPage: res.data.currentPage,
                    totalItemsCount: res.data.totalItemsCount,
                    totalPagesCount: res.data.totalPagesCount,
                })
            })
            .catch(err => handleResponseError(err))
    }

    onClickEditTeacherButton = (teacher) => {
        this.setState({
            currentTeacher: teacher,
            editTeacherDialogOpen: true
        })
    }

    onCloseEditTeacherDialog = () => {
        this.setState({
            currentTeacher: null,
            editTeacherDialogOpen: false
        })
    }

    handleSearchBoxInput = (event) => {
        const value = event.target.value;
        this.setState({searchPattern: value ? value : ''}
            , () => this.fetchTeachers(false, true))
    }

    onChangePagination = (event, value) => {
        this.setState({
            currentPage: value,
        }, () => this.fetchTeachers(true))
    }

    onChangePageSize = (e) => {
        this.setState({
                size: e.target.value,
                currentPage: 0,
            }, () => this.fetchTeachers(false)
        )
    }

    render() {
        if (!this.state.teachers) {
            return <></>
        }
        const {classes} = this.props
        return (
            <Box className={'pageContent'}>
                <Container>
                    <h1>
                        Manage Teachers Page
                    </h1>

                    <EditTeacherDialogClass
                        open={this.state.editTeacherDialogOpen}
                        onClose={this.onCloseEditTeacherDialog}
                        teacher={this.state.currentTeacher}
                    />

                    <SearchBox
                        searchPattern={this.state.searchPattern}
                        onChange={this.handleSearchBoxInput}
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
                                    <MenuItem key={idx} value={size}>
                                        {size}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>
                    </Box>
                    <SearchResultPanel
                        data={this.state.teachers}
                        onClick={this.onClickEditTeacherButton}//works w/o argument
                        edit={true}
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
                                    <MenuItem key={idx} value={size}>
                                        {size}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>
                    </Box>
                </Container>
            </Box>
        )
    }
}

export default withStyles(useStyles)(ManageTeachersPage)
