import React from "react";
import {withStyles} from "@material-ui/core/styles";
import {Paper} from "@material-ui/core";
import Calendar from "react-calendar";
import '../../calendar.css';
import moment from 'moment'
import TeacherDateDialog from "../../components/teacher/TeacherDateDialog";
import {get, handleResponseError, post} from "../../utils/request";
import TeacherFieldPreferences from "../../components/teacher/TeacherFieldPreferences";

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

    degrees: [],
    fieldsClass: [],
    fieldsChecked: new Set(),

}
const dateFormatMoment = "DD.MM.yyyy"

class TeacherSettings extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...InitialState,
            teacherId: localStorage.getItem('userId'),
        }
    }

    componentDidMount() {
        this.fetchTeacher()
        this.fetchDegrees()
        this.fetchFields()
    }

    fetchTeacher() {
        get(`/user/teacher/${this.state.teacherId}`)
            .then(res => this.setState({
                teacher: res.data,
                fieldsChecked: new Set(res.data.teacher.preferredFieldOfStudies),
            }, () => {
                console.log(res.data)
                console.log(this.state.fieldsChecked)
                this.makeUnavailableSetDates(res.data.teacher.unavailableDates)
            }))
            .catch(err => handleResponseError(err))

        get(`/user/teacher/${this.state.teacherId}/examDates`)
            .then(res => this.makeExamSetDates(res.data))
            .catch(err => handleResponseError(err))
    }

    fetchDegrees(didMount) {
        // console.log("did mount", didMount)
        get("/exam/degrees")
            .then(res => {
                this.setState({
                        degrees: this.fixDegreesArr(res.data),
                        // selectedDegree: res.data.length > 0 ? res.data[0] : 'Bc',
                    }
                    // , () => console.log(res.data)
                    // , () => this.props.onChange(filterProps(this.state), didMount)
                )
            })
            .catch(err => handleResponseError(err))
    }

    fixDegreesArr(arr) {
        arr.shift()
        return arr
    }

    fetchFields(didMount) {
        // console.log("did mount", didMount)

        get(`/field`)
            .then(res => {
                this.setState({
                    // fieldsClass: this.addItemALL(res.data, true),
                    fieldsClass: res.data,
                    // selectedField: res.data.length > 0 ? res.data[0] : 'ALL'
                    }, () => console.log(this.state.fieldsClass)
                )
            })
            .catch(err => handleResponseError(err))
    }

    makeUnavailableSetDates(dates) {
        this.setState({
            unavailableDates: new Set(dates.map(d => {
                return d.date
            }))
        })
    }

    makeExamSetDates(dates) {
        this.setState({
            examDates: new Set(dates.map(d => {
                return d
            }))
        })
    }

    onClickHandle = (value) => {
        const date = moment(value).format(dateFormatMoment)
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
            .catch(err => handleResponseError(err))

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
            .catch(err => handleResponseError(err))

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
        const date = moment(data.date).format(dateFormatMoment)
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

    handleCheckCheckbox = (item) => {
        console.log("handleCheckCheckbox", item)
        return this.state.fieldsChecked.has(item);
    }

    handleClickCheckbox(item) {
        // console.log("handleClickCheckbox", item)
        // return false
    }

    handleClickField = field => {
        let set = this.state.fieldsChecked

        if (!this.state.fieldsChecked.has(field)) {
            set.add(field)
        } else {
            set.delete(field)
        }

        this.setState({
                fieldsChecked: set,
            }
            // , () => console.log(this.state.fieldsChecked)
        )
    }

    onClickSavePreference = () => {
        //TODO save teacher
        console.log(Array.from(this.state.fieldsChecked))
        console.log(this.state.teacher)

        //teacherPropsTO
        const payload = {
            ...this.state.teacher.teacher,
            preferredFieldOfStudies: Array.from(this.state.fieldsChecked),
        }
        console.log(payload)

        post(`/user/teacher/prop/${this.state.teacher.id}`, payload)
            .then(res => console.log(res.data))
            .catch(err => handleResponseError(err))
    }

    //TODO this do not work: set has do not work properly
    // make list instead???
    handleChecked = (field) => {
        if (this.state.fieldsChecked.has(field)) {
            console.log("has", field)
            return true
        } else {
            console.log("not")
            return false

        }

        // console.log("not",field, this.state.fieldsChecked.)
    }

    render() {
        const {classes} = this.props

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
                <h1>Settings</h1>
                <Paper
                    className={classes.cardContainer}
                >
                    <Calendar
                        // locale={"cs-CZ"}
                        locale={"en-UK"}
                        onChange={this.onClickHandle}
                        tileClassName={this.markDate()}
                    />
                    <TeacherFieldPreferences
                        teacher={this.state.teacher}
                        allDegrees={this.state.degrees}
                        fieldsClass={this.state.fieldsClass}
                        handleChecked={this.handleChecked}
                        handleClick={this.handleClickCheckbox}
                        handleClickField={this.handleClickField}
                        fieldsChecked={this.state.fieldsChecked}
                        onClickSave={this.onClickSavePreference}
                    />
                </Paper>
            </>
        );
    }

}

export default withStyles(useStyles)(TeacherSettings)
