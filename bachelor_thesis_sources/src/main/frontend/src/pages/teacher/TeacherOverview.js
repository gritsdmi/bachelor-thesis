import React from "react";
import {withStyles} from "@material-ui/core/styles";
import TeacherEventsFilter from "../../components/teacher/TeacherEventsFilter";
import {get} from "../../utils/request";
import {Paper} from "@material-ui/core";
import CommissionListItem from "../../components/CommissionListItem";
import TeacherCommissionInfoDialog from "../../components/teacher/TeacherCommissionInfoDialog";

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
    teacherId: null,
}

const teacherId = 4

class TeacherOverview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...InitialState,
            teacherId: teacherId,
        }
    }

    componentDidMount() {
        console.log("TeacherOverview DID MOUNT")
        this.fetchDegrees()
        this.fetchTeacher()
        this.fetchCommissions()
    }

    fetchTeacher() {
        get(`/teacher/${teacherId}`)
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
        get(`/commission/byTeacher/${teacherId}`)
            .then(response => {
                this.setState({
                    commissions: response.data,
                }, () => console.log(response.data))
            })
            .catch(error => console.log(error))
    }

    onChangeComState = (evt) => {
        console.log("onChangeComState", evt.target.value)
    }

    onChangeDegree = (evt) => {
        console.log("onChangeDegree", evt.target.value)
    }

    onClickInfoButton = comm => (evt) => {
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
                    currentTeacherId={teacherId}
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
                <Paper>
                    {comList}
                </Paper>
            </div>
        );
    }

}

export default withStyles(useStyles)(TeacherOverview)
