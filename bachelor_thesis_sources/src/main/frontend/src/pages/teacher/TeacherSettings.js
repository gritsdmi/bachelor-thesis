import React from "react";
import {withStyles} from "@material-ui/core/styles";
import {Paper, Snackbar} from "@material-ui/core";
import Calendar from "react-calendar";
import '../../styles/calendar.css';
import moment from 'moment'
import TeacherDateDialog from "../../components/teacher/TeacherDateDialog";
import {get, handleResponseError, post} from "../../utils/request";
import TeacherFieldPreferences from "../../components/teacher/TeacherFieldPreferences";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

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
    },
    box: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },

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
    fieldsChecked: [],
    fieldCheckMap: new Map(),
    snackOpen: false,

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
    }

    fetchTeacher() {
        get(`/user/teacher/${this.state.teacherId}`)
            .then(res => this.setState({
                teacher: res.data,
                fieldsChecked: res.data.teacher.preferredFieldOfStudies
            }, () => {
                console.log(res.data)
                this.makeUnavailableSetDates(res.data.teacher.unavailableDates)
                this.fetchFields()
            }))
            .catch(err => handleResponseError(err))

        get(`/user/teacher/${this.state.teacherId}/examDates`)
            .then(res => this.makeExamSetDates(res.data))
            .catch(err => handleResponseError(err))
    }

    fetchDegrees() {
        get("/exam/degrees")
            .then(res => {
                this.setState({
                        degrees: this.fixDegreesArr(res.data),
                    }
                )
            })
            .catch(err => handleResponseError(err))
    }

    fixDegreesArr(arr) {
        arr.shift()
        return arr
    }

    fetchFields() {
        get(`/field`)
            .then(res => {
                this.setState({
                        fieldsClass: res.data,
                    }, () => {
                        this.makeCheckFieldsMap(this.state.fieldsClass)
                    }
                )
            })
            .catch(err => handleResponseError(err))
    }

    makeCheckFieldsMap(allFields) {
        let map = new Map(allFields.map(f => [f.field, false]))

        this.state.fieldsChecked.forEach(checked => {
            map.set(checked.field, true)
        })

        this.setState({
            fieldCheckMap: map,
        })
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

    handleClickField = field => {
        let map = this.state.fieldCheckMap
        if (!map.get(field.field)) {
            map.set(field.field, true)
        } else {
            map.set(field.field, false)
        }
        this.setState({
            fieldCheckMap: map,
        })
    }

    onClickSavePreference = () => {
        const prefs = this.state.fieldsClass.filter(field => this.state.fieldCheckMap.get(field.field))

        //teacherPropsTO
        const payload = {
            ...this.state.teacher.teacher,
            preferredFieldOfStudies: prefs,
        }

        post(`/user/teacher/prop/${this.state.teacher.id}`, payload)
            .then(res => {
                console.log(res.data)
                this.setState({snackOpen: true})
            })
            .catch(err => handleResponseError(err))
    }

    handleChecked = (field) => {
        const get = this.state.fieldCheckMap.get(field.field)
        return get || false
    }

    render() {
        const {classes} = this.props

        return (
            <>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.snackOpen}
                    autoHideDuration={4000}
                    onClose={() => this.setState({snackOpen: false})}
                    message="Saved"
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
                    <Box
                        className={classes.box}
                    >
                        <Typography>Calendar</Typography>

                        <Calendar
                            // locale={"cs-CZ"}

                            locale={"en-UK"}
                            onChange={this.onClickHandle}
                            tileClassName={this.markDate()}
                        />
                    </Box>

                    <TeacherFieldPreferences
                        allDegrees={this.state.degrees}
                        fieldsClass={this.state.fieldsClass}
                        handleChecked={this.handleChecked}
                        handleClickField={this.handleClickField}
                        onClickSave={this.onClickSavePreference}
                    />
                </Paper>
            </>
        );
    }

}

export default withStyles(useStyles)(TeacherSettings)
