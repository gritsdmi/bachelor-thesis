import React from "react";
import Container from "@material-ui/core/Container";
import {get} from "../../utils/request";
import SearchBox from "../../components/SearchBox";
import SearchResultPanel from "../../components/SearchResultPanel";
import EditTeacherDialogClass from "../../components/manage/EditTeacherDialogClass";

class ManageTeachersPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            teachers: [],
            currentTeacher: null,
            editTeacherDialogOpen: false,
            searchPattern: '',
        }
    }


    componentDidMount() {
        get("/user/teacher").then((response) => {
            this.setState({teachers: response.data})
        })
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
            this.setState({searchPattern: value})
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

    render() {
        const teachersFilteredList = this.teachersFilteredList()

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
                    <SearchResultPanel
                        data={teachersFilteredList}
                        onClick={this.onClickEditTeacherButton}//works w/o argument
                        edit={true}
                    />
                </Container>
            </>
        )
    }
}

export default ManageTeachersPage;
