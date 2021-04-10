import React from "react";
import {withStyles} from "@material-ui/core/styles";
import TeacherEventsFilter from "../../components/teacher/TeacherEventsFilter";
import {get, post} from "../../utils/request";
import {Paper} from "@material-ui/core";
import CommissionListItem from "../../components/CommissionListItem";
import TeacherCommissionInfoDialog from "../../components/teacher/TeacherCommissionInfoDialog";
import Pagination from "@material-ui/lab/Pagination";

const useStyles = theme => ({
    cardContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    item: {
        margin: theme.spacing(1),
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
    }

});
const InitialState = {
    degrees: [],
    commissions: [],
    teacher: null,
    comStates: ['EDITABLE', 'APPROVED'],

    commissionInfoDialogOpen: false,
    currentCommission: null,

    teacherId: localStorage.getItem('userId'),

    currentPage: 1,
    size: 3, //count items in current page
    totalItemsCount: null,
    totalPagesCount: null,

    pageSizes: [2, 10, 25, 50, 100],

}

class TeacherOverview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...InitialState,
            teacherId: localStorage.getItem('userId'),
        }
    }

    componentDidMount() {
        this.fetchDegrees()
        this.fetchTeacher()
        this.fetchCommissions()
    }

    fetchTeacher() {
        get(`/user/teacher/${this.state.teacherId}`)
            .then(response => {
                this.setState({
                    teacher: response.data,
                }, () => console.log(response.data))
            })
            .catch(error => console.log(error))
    }

    fetchDegrees() {
        get("/exam/degrees")
            .then(response => {
                this.setState({
                    degrees: response.data,
                }, () => console.log(response.data))
            })
            .catch(error => console.log(error))
    }

    fetchCommissions() {
        // get(`/commission/byTeacher/${this.state.teacherId}`)
        //     .then(response => {
        //         this.setState({
        //             commissions: response.data,
        //         }, () => console.log(response.data))
        //     })
        //     .catch(error => console.log(error))

        const pageTO = {
            page: this.state.currentPage - 1,
            size: this.state.size,
            pattern: ' ',
        }

        post(`/commission/byTeacher/${this.state.teacherId}/page`, pageTO)
            .then(res => {
                this.setState({
                        commissions: res.data.list,
                        currentPage: res.data.currentPage,
                        totalItemsCount: res.data.totalItemsCount,
                        totalPagesCount: res.data.totalPagesCount,
                    }, () => console.log(res)
                )
            })
            .catch(err => console.log(err))
    }

    onChangeComState = (evt) => {
        console.log("onChangeComState", evt.target.value)
    }

    onChangeDegree = (evt) => {
        console.log("onChangeDegree", evt.target.value)
    }

    onClickInfoButton = comm => {
        console.log("onClickInfoButton", comm)
        this.setState({
            currentCommission: comm,
            commissionInfoDialogOpen: true
        })
    }

    onCloseCommissionInfoDialog = () => {
        console.log("onCloseCommissionInfoDialog")

        this.setState({
            currentCommission: null,
            commissionInfoDialogOpen: false
        })
    }

    onChangePagination = (event, value) => {
        this.setState({
            currentPage: value,
        }, () => this.fetchCommissions())
    }

    render() {
        const comList = this.state.commissions.map((comm, idx) => {
            return (
                <CommissionListItem
                    key={idx}
                    commission={comm}
                    onClickInfoButton={this.onClickInfoButton}
                />
            )
        })

        return (
            <div>
                <TeacherCommissionInfoDialog
                    open={this.state.commissionInfoDialogOpen}
                    onClose={this.onCloseCommissionInfoDialog}
                    commission={this.state.currentCommission}
                    currentTeacherId={this.state.teacherId}
                />

                <h1>
                    Teacher Events
                </h1>
                <TeacherEventsFilter
                    comStates={this.state.comStates}
                    degrees={this.state.degrees}
                    onChangeComState={this.onChangeComState}
                    onChangeDegree={this.onChangeDegree}
                />
                <Pagination
                    count={this.state.totalPagesCount}
                    page={this.state.currentPage + 1}
                    siblingCount={1}
                    boundaryCount={1}
                    shape="rounded"
                    onChange={this.onChangePagination}
                />
                <Paper>
                    {comList}
                </Paper>
                <Pagination
                    count={this.state.totalPagesCount}
                    page={this.state.currentPage + 1}
                    siblingCount={1}
                    boundaryCount={1}
                    shape="rounded"
                    onChange={this.onChangePagination}
                />
            </div>
        );
    }
}

export default withStyles(useStyles)(TeacherOverview)
