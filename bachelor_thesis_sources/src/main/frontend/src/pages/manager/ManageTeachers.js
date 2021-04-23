import React from "react";
import Container from "@material-ui/core/Container";
import {handleResponseError, post} from "../../utils/request";
import SearchBox from "../../components/SearchBox";
import SearchResultPanel from "../../components/SearchResultPanel";
import EditTeacherDialogClass from "../../components/manage/EditTeacherDialogClass";
import Pagination from "@material-ui/lab/Pagination";
import {withStyles} from "@material-ui/core/styles";

const useStyles = theme => ({});
const InitialState = {
    teachers: [],
    currentTeacher: null,
    editTeacherDialogOpen: false,
    searchPattern: '',

    currentPage: 1,
    size: 10, //count items in current page
    totalItemsCount: null,
    totalPagesCount: null,

    pageSizes: [2, 10, 25, 50, 100],
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

    fetchTeachers(usePattern) {

        const pageTO = {
            page: usePattern ? this.state.currentPage : this.state.currentPage - 1,
            size: this.state.size,
            pattern: this.state.searchPattern,
        }

        post(`/user/teacher/page`, pageTO)
            .then(res => {
                this.setState({
                    teachers: res.data.list,
                    currentPage: res.data.currentPage,
                    totalItemsCount: res.data.totalItemsCount,
                    totalPagesCount: res.data.totalPagesCount,
                }, () => console.log(res.data))
            })
            .catch(err => handleResponseError(err))
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
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
            , () => this.fetchTeachers(true))
    }

    onChangePagination = (event, value) => {
        this.setState({
            currentPage: value,
        }, () => this.fetchTeachers())
    }

    render() {
        if (!this.state.teachers) {
            return <></>
        }
        const {classes} = this.props
        return (
            <>
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
                    <Pagination
                        count={this.state.totalPagesCount}
                        page={this.state.currentPage + 1}
                        siblingCount={1}
                        boundaryCount={1}
                        shape="rounded"
                        onChange={this.onChangePagination}
                    />
                    <SearchResultPanel
                        data={this.state.teachers}
                        onClick={this.onClickEditTeacherButton}//works w/o argument
                        edit={true}
                    />
                    <Pagination
                        count={this.state.totalPagesCount}
                        page={this.state.currentPage + 1}
                        siblingCount={1}
                        boundaryCount={1}
                        shape="rounded"
                        onChange={this.onChangePagination}
                    />
                </Container>
            </>
        )
    }
}

export default withStyles(useStyles)(ManageTeachersPage);
