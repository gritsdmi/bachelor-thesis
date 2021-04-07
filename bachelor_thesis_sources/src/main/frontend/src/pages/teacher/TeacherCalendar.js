import React from "react";
import {withStyles} from "@material-ui/core/styles";
import {Paper} from "@material-ui/core";
import Calendar from "react-calendar";
import '../../calendar.css';
import moment from 'moment'
import TeacherDateDialog from "../../components/teacher/TeacherDateDialog";
import {get, post} from "../../utils/request";

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
    calendarDialogOpen: false,
    chosenDate: null,
    teacherId: localStorage.getItem('userId'),

    unavailableDates: null,
    examDates: null,
    teacher: null,

}
const dateFormat = "DD.MM.yyyy"

class TeacherCalendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...InitialState,
            teacherId: localStorage.getItem('userId'),
        }
    }

    componentDidMount() {
        console.log("TeacherCalendar DID MOUNT")
        this.fetchTeacher()
    }

    fetchTeacher() {
        console.log(this.state)
        get(`/user/teacher/${this.state.teacherId}`)
            .then(res => this.setState({
                teacher: res.data,
            }, () => {
                this.makeUnavailableSetDates(res.data.teacher.unavailableDates)
            }))
            .catch(err => console.log(err))

        get(`/user/teacher/${this.state.teacherId}/examDates`)
            .then(res => this.makeExamSetDates(res.data))
            .catch(err => console.log(err))
    }

    makeUnavailableSetDates(dates) {
        console.log(dates)
        this.setState({
            unavailableDates: new Set(dates.map(d => {
                return d.date
            }))
        })
    }

    makeExamSetDates(dates) {
        console.log(dates)
        this.setState({
            examDates: new Set(dates.map(d => {
                return d
            }))
        })
    }

    onClickHandle = (value) => {
        const date = moment(value).format(dateFormat)
        this.setState({
            chosenDate: date,
            calendarDialogOpen: true,
        })
    }

    closeDialog() {
        this.setState({
            chosenDate: null,
            calendarDialogOpen: false,
        })
    }

    onCloseDialog = () => {
        this.closeDialog()
    }

    onClickCantAttend = () => {
        console.log("onClickCantAttend")
        const payload = {
            date: this.state.chosenDate,
            semester: null,
        }

        post(`/user/teacher/${this.state.teacherId}/addDate`, payload)
            .then(res => {
                console.log(res)
                this.fetchTeacher()
            })
            .catch(err => console.log(err))

        this.closeDialog()
    }

    onClickCan = () => {
        console.log("onClickCan")
        const payload = {
            date: this.state.chosenDate,
            semester: null,
        }
        const d = this.state.teacher.teacher.unavailableDates.find(date => date.date === this.state.chosenDate)
        console.log(d)
        post(`/user/teacher/${this.state.teacherId}/removeDate`, d)
            .then(res => {
                console.log(res)
                this.fetchTeacher()
            })
            .catch(err => console.log(err))

        this.closeDialog()
        this.fetchTeacher()

    }

    markDate = hook => (data) => {
        if (!this.state.teacher
            || !this.state.unavailableDates
            || !this.state.examDates) {
            return
        }
        if (data.view !== "month") {
            return
        }
        const date = moment(data.date).format(dateFormat)
        // moment(date.date).format(dateFormat)
        // console.log(this.state.unavailableDates)
        if (this.state.unavailableDates.has(date)) {
            return "unavailable"
        }
        if (this.state.examDates.has(date)) {
            return "exam"
        }
    }

    color(date) {
        if (!this.state.teacher || !this.state.unavailableDates || !this.state.examDates) {
            return
        }
        if (this.state.examDates.has(date)) {
            return "green"
        }
        if (this.state.unavailableDates.has(date)) {
            return "red"
        }

        return "blank"

    }


    render() {
        return (
            <>
                <TeacherDateDialog
                    open={this.state.calendarDialogOpen}
                    onClose={this.onCloseDialog}
                    date={this.state.chosenDate}
                    onClickCantAttend={this.onClickCantAttend}
                    onClickCan={this.onClickCan}
                    color={this.color(this.state.chosenDate)}
                />
                <h1>Calendar</h1>
                <Paper>
                    <Calendar
                        // locale={"cs-CZ"}
                        locale={"en-UK"}
                        onChange={this.onClickHandle}
                        tileClassName={this.markDate()}
                    />

                </Paper>
            </>
        );
    }

}

export default withStyles(useStyles)(TeacherCalendar)