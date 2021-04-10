import React from "react";
import Container from "@material-ui/core/Container";
import {post} from "../../utils/request";
import SearchBox from "../../components/SearchBox";
import SearchResultPanel from "../../components/SearchResultPanel";
import EditTeacherDialogClass from "../../components/manage/EditTeacherDialogClass";
import Pagination from "@material-ui/lab/Pagination";

const InitialState = {
    teachers: [],
    currentTeacher: null,
    editTeacherDialogOpen: false,
    searchPattern: '',

    currentPage: 1,
    size: 5, //count items in current page
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
        // get("/user/teacher").then((response) => {
        //     this.setState({teachers: response.data})
        // })
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
            .catch(err => console.log(err))
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
    }

    onClickSearchButton = (event) => {
        console.log("on click search button", event)
    }

    onClickEditTeacherButton = (teacher) => {
        // console.log("on click edit teacher button ", teacherId)
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
        if (value && value !== '') {
            console.log("apply filter")
            this.setState({searchPattern: value}, () => this.fetchTeachers(true))
        } else {
            console.log("clear filter")
            this.setState({searchPattern: ''})
        }
    }

    teachersFilteredList() {
        if (this.state.searchPattern === '') {
            return this.state.teachers
        }
        return this.state.teachers
            && this.state.searchPattern
            && this.state.teachers.filter(teacher => {
                    return (
                        (teacher.name ? teacher.name.toLowerCase().startsWith(this.state.searchPattern.toLowerCase()) : false)
                        || (teacher.surname ? teacher.surname.toLowerCase().startsWith(this.state.searchPattern.toLowerCase()) : false)
                        || (teacher.login ? teacher.login.toLowerCase().startsWith(this.state.searchPattern.toLowerCase()) : false))
                }
            )
    }

    onChangePagination = (event, value) => {
        this.setState({
            currentPage: value,
        }, () => this.fetchTeachers())
    }

    render() {
        // const teachersFilteredList = this.teachersFilteredList()
        if (!this.state.teachers) {
            return <></>
        }
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
                        onClickButton={this.onClickSearchButton}
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

export default ManageTeachersPage;
