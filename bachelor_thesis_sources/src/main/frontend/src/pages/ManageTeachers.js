import React from "react";
import Container from "@material-ui/core/Container";
import {get} from "../utils/request";
import SearchBox from "../components/SearchBox";
import SearchResultPanel from "../components/SearchResultPanel";
import EditTeacherDialogClass from "../components/manage/EditTeacherDialogClass";

class ManageTeachersPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            teachers: [],
            currentTeacher: null,
            editTeacherDialogOpen: false,
            searchPattern: '',
        }

        // this.handleEditButtonClickTest = this.handleEditButtonClickTest.bind(this)
    }

    // handleEditButtonClickTest(teacherId) {
    //     console.log(teacherId);
    //
    // }

    componentDidMount() {
        get("/teacher").then((response) => {
            this.setState({teachers: response.data}
            )
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props !== prevProps) {
            console.log("manage teachers did update PROPS")

        }
        if (this.state !== prevState) {
            console.log("manage teachers did update STATE")

        }
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


// callbackFunction = val => (childData) => { // idk how, but its pass value, but call component did update
//     this.setState({message: childData}, () => console.log(this.state.message))
//     console.log(childData)
//     console.log(val)
// }

    render() {
        const teachersFilteredList = this.teachersFilteredList()
        console.log(teachersFilteredList)

        return (
            <>
                <Container>
                    <h1>
                        Manage Teachers Page
                    </h1>

                    {/*<EditTeacherDialog*/}
                    {/*    // open={this.state.editTeacherDialogOpen}*/}
                    {/*    open={false}*/}
                    {/*    onClose={this.onCloseEditTeacherDialog}*/}
                    {/*    teacher={this.state.currentTeacher}*/}
                    {/*/>*/}

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
                        // data={this.state.teachers}
                        data={teachersFilteredList}
                        onEditClick={this.onClickEditTeacherButton}//works w/o argument
                        // test={this.onClickEditTeacherButtonTest.bind(this)} // test
                        // parentCallback={this.callbackFunction()} // idk how, but its pass value, but call component did update
                        // handleTest={this.handleEditButtonClickTest}
                    />
                </Container>


            </>
        )
    }
}

export default ManageTeachersPage;