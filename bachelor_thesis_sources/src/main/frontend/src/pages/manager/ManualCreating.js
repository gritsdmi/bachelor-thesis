import React from "react";
import Container from "@material-ui/core/Container";
import {withStyles} from "@material-ui/core/styles";
import SearchBox from "../../components/SearchBox";
import {Grid, ListItem, Paper, Snackbar, Table, TableBody, TableCell, TableRow} from "@material-ui/core";
import CommissionProps from "../../components/CommissionProps";
import {get, handleResponseError, post} from "../../utils/request"
import List from "@material-ui/core/List";
import SearchResultPanel from "../../components/SearchResultPanel";
import Button from "@material-ui/core/Button";
import ClearIcon from '@material-ui/icons/Clear';
import Pagination from "@material-ui/lab/Pagination";
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

import moment from 'moment'
import "moment/locale/en-gb"

const dateFormatMoment = "DD.MM.yyyy"
const timeFormatMoment = "HH:mm"

const InitialState = {
    searchPattern: '',
    teachers: [],
    locations: [],
    degrees: [],
    fields: [],

    selectedDegree: '',
    selectedField: '',
    selectedLocation: '',
    selectedDate: new Date(),

    commission: null,
    edit: false,
    snackOpen: false,

    currentPage: 1,
    size: 10, //count items in current page
    totalItemsCount: null,
    totalPagesCount: null,

    pageSizes: [2, 10, 25, 50, 100],
}

const useStyles = theme => ({
    cardContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
    }
});

class ManualCreatingPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ...InitialState,
        }
    }

    componentDidMount() {
        console.log(this.props)
        if (!this.props.location.commission) {
            //click on header's button
            //there are none any graft
            console.log("ManualCreatingPage DID MOUNT creating new comm")
            this.fetchAll()
        } else {
            //edit some commission

            console.log("ManualCreatingPage DID MOUNT => editing existed commission", this.props)
            this.setState({
                commission: this.props.location.commission,
                selectedDegree: this.props.location.commission.exam.degree,
                selectedField: this.props.location.commission.exam.fieldOfStudy,
                selectedLocation: this.props.location.commission.exam.location,
                selectedDate: this.dateTimeStrToDate(this.props.location.commission.exam.date, this.props.location.commission.exam.time),
                edit: true,
            }, () => {
                console.log(this.state)
                this.fetchTeachers()
                this.fetchDegrees(true)
                this.fetchFields()
                this.fetchLocations(moment(this.state.selectedDate).format(dateFormatMoment));
            })
        }

    }

    dateTimeStrToDate(date, time) {
        const str = date.concat(' ').concat(time)
        const format = dateFormatMoment.concat(' ').concat(timeFormatMoment)
        console.log(str)
        const obj = moment(str, format).toDate()
        console.log(obj)
        return obj
    }

    fetchAll(trigger) {
        this.fetchTeachers(trigger)
        this.fetchDegrees()
        this.fetchLocations(moment(this.state.selectedDate).format(dateFormatMoment));
    }

    fetchLocations(dateF) {
        get(`/location/free/${dateF}`)
            .then(response => {
                this.setState({
                        locations: response.data,
                        selectedLocation: response.data.length > 0 ? response.data[0] : '',
                    }
                    // , () => console.log(this.state.locations)
                )
            })
            .catch(err => handleResponseError(err))
    }

    fetchDegrees(edit) {
        get("/exam/degrees")
            .then(res => {
                if (edit) {
                    this.setState({
                        degrees: this.fixDegreesArr(res.data),
                    })
                } else {
                    this.setState({
                        degrees: this.fixDegreesArr(res.data),
                        selectedDegree: res.data.length > 0 ? res.data[0] : '',
                    }, () => this.fetchFields())
                }
            })
            .catch(err => handleResponseError(err))
    }

    fetchTeachers(usePattern) {

        const pageTO = {
            page: usePattern ? this.state.currentPage : this.state.currentPage - 1,
            size: this.state.size,
            pattern: this.state.searchPattern,
        }

        const date = moment(this.state.selectedDate).format(dateFormatMoment)

        post(`/user/teacher/date/${date}/page`, pageTO)
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

    fetchFields(edit) {
        get(`/field/degree/${this.state.selectedDegree}`)
            .then(res => {
                if (edit) {
                    this.setState({
                        fields: res.data,
                    })
                } else {
                    this.setState({
                        fields: res.data,
                        selectedField: res.data.length > 0 ? res.data[0] : '',
                    })
                }
            })
            .catch(err => handleResponseError(err))
    }

    fixDegreesArr(arr) {
        arr.shift()
        return arr
    }

    handleSearchBoxInput = (event) => {
        const value = event.target.value;
        if (value && value !== '') {
            this.setState({
                searchPattern: value
            }, () => this.fetchTeachers(true))
        } else {
            this.setState({searchPattern: ''})
        }
    }

    handleChangeDate = (event) => {
        this.setState({
            selectedDate: event,
        }, () => this.fetchAll(true))

    }

    handleChangeLocation = (event) => {
        this.setState({
            selectedLocation: event.target.value,
        })
    }

    handleChangeDegree = (event) => {
        this.setState({
                selectedDegree: event.target.value,
            }, () => this.fetchFields()
        )
    }

    onClickAddTeacherButton = (teacher) => {
        console.log("onClickAddTeacherButton", teacher)

        if (!this.state.commission) {
            let newComm = {
                teachers: [teacher],
                exam: {
                    degree: this.state.selectedDegree,
                    location: this.state.selectedLocation,
                    fieldOfStudy: this.state.selectedField.field,
                    date: moment(this.state.selectedDate).format(dateFormatMoment),
                    time: moment(this.state.selectedDate).format(timeFormatMoment),
                },
                state: "EDITABLE",
            }
            console.log(newComm)
            this.setState({
                commission: newComm,
            })
        } else {
            if (!this.state.commission.teachers.includes(teacher)) {
                let com = {...this.state.commission}
                com.teachers.push(teacher)
                this.setState({
                    commission: com,
                })
            }
        }
    }

    onClickRemoveTeacher = teacher => () => {
        console.log("onClickRemoveTeacher", teacher)
        let com = {...this.state.commission}
        com.teachers = com.teachers.filter(item => item !== teacher)
        console.log(com)
        this.setState({
            commission: com,
        }, () => console.log(this.state.commission))

    }

    onClickSaveCommission = () => {
        console.log("onClickSaveCommission")
        if (!this.state.commission) {
            return
        }

        //if updating existed commission
        // if (this.props.location.commission) {
        if (this.state.edit) {
            const payload = {
                ...this.state.commission,
            }
            console.log(payload)

            post(`/commission/${this.state.commission.id}`, payload)
                .then(res => {
                    console.log(res)
                    if (res.status === 200) {
                        this.setState({
                            snackOpen: true,
                        })
                    }
                })
                .catch(err => handleResponseError(err))

            this.setState({
                ...InitialState
            }, () => this.fetchAll())
        } else {
            //if creating new commission

            //creatorTO object
            const payload = {
                date: moment(this.state.selectedDate).format(dateFormatMoment),
                time: moment(this.state.selectedDate).format(timeFormatMoment),
                degree: this.state.selectedDegree,
                field: this.state.selectedField.field,
                locationId: this.state.selectedLocation.id,
                teachers: this.state.commission.teachers,
            }
            console.log(payload)

            post(`/commission/create`, payload)
                .then(res => {
                    console.log(res)
                    if (res.status === 200) {
                        this.setState({
                            snackOpen: true,
                        })
                    }
                })
                .catch(err => handleResponseError(err))

            this.setState({
                ...InitialState
            }, () => this.fetchAll())
        }

    }

    onChangePagination = (event, value) => {
        this.setState({
            currentPage: value,
        }, () => this.fetchTeachers())
    }

    handleChangeField = (e) => {
        this.setState({
            selectedField: e.target.value,
        })
    }

    onClickClearCurrentCommission = () => {
        this.setState({
            commission: null,
        })
    }

    disabledButtonCheck = (item) => {
        if (!this.state.commission) {
            return false
        }
        if (this.state.commission.teachers.includes(item)) {
            return true
        }
        return false
    }

    onCloseSnackbar = () => {
        this.setState({
            snackOpen: false,
        })
    }

    render() {

        if (!this.state.locations || !this.state.degrees) {
            return <></>
        }
        const teachersFilteredList = this.state.teachers
        const defaults = {
            date: this.state.selectedDate,
            loc: this.state.selectedLocation,
            degree: this.state.selectedDegree,
            field: this.state.selectedField,
        }

        return (
            <>
                <Container>
                    {this.state.edit ?
                        <h1>Edit commission</h1> :
                        <h1>Manual Creating Page</h1>
                    }
                    <SearchBox
                        // onClickButton={}
                        searchPattern={this.state.searchPattern}
                        onChange={this.handleSearchBoxInput}
                    />
                    <Snackbar
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        open={this.state.snackOpen}
                        autoHideDuration={4000}
                        onClose={this.onCloseSnackbar}
                        message="Commission saved"
                        action={
                            <React.Fragment>
                                <IconButton
                                    size="small"
                                    aria-label="close"
                                    color="inherit"
                                    onClick={this.onCloseSnackbar}
                                >
                                    <CloseIcon fontSize="small"/>
                                </IconButton>
                            </React.Fragment>
                        }
                    />
                    <CommissionProps
                        date={this.state.selectedDate}
                        degrees={this.state.degrees}
                        fields={this.state.fields}
                        locations={this.state.locations}
                        onChangeDate={this.handleChangeDate}
                        onChangeDegree={this.handleChangeDegree}
                        onChangeField={this.handleChangeField}
                        onChangeLoc={this.handleChangeLocation}
                        defaults={defaults}
                    />

                    <Grid container>
                        <Grid item xs>
                            <Paper>
                                Search results
                                <Pagination
                                    count={this.state.totalPagesCount}
                                    page={this.state.currentPage + 1}
                                    siblingCount={1}
                                    boundaryCount={1}
                                    shape="rounded"
                                    onChange={this.onChangePagination}
                                />
                                <SearchResultPanel
                                    data={teachersFilteredList}
                                    onClick={this.onClickAddTeacherButton}
                                    disabledCheck={this.disabledButtonCheck}
                                    add={true}
                                />
                                <Pagination
                                    count={this.state.totalPagesCount}
                                    page={this.state.currentPage + 1}
                                    siblingCount={1}
                                    boundaryCount={1}
                                    shape="rounded"
                                    onChange={this.onChangePagination}
                                />
                            </Paper>
                        </Grid>
                        <Grid item xs={4}>
                            <Paper>
                                Current Commission
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>
                                                <List>
                                                    {this.state.commission &&
                                                    this.state.commission.teachers.map((t, idx) => {
                                                        return (
                                                            <ListItem
                                                                key={idx}
                                                            >
                                                                {t.name + " " + t.surname}
                                                                <Button
                                                                    onClick={this.onClickRemoveTeacher(t)}
                                                                >
                                                                    <ClearIcon/>
                                                                </Button>
                                                            </ListItem>
                                                        )
                                                    })}
                                                </List>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                Location
                                            </TableCell>
                                            <TableCell> {this.state.selectedLocation &&
                                            this.state.selectedLocation.building + ":" +
                                            this.state.selectedLocation.classroom
                                            }
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                Date
                                            </TableCell>
                                            <TableCell>
                                                {moment(this.state.selectedDate).format(dateFormatMoment)}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                Time
                                            </TableCell>
                                            <TableCell>
                                                {moment(this.state.selectedDate).format(timeFormatMoment)}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                Degree
                                            </TableCell>
                                            <TableCell>
                                                {this.state.selectedDegree}
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                Study field
                                            </TableCell>
                                            <TableCell>
                                                {this.state.selectedField.field}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                                <Button
                                    onClick={this.onClickSaveCommission}
                                >
                                    Save
                                </Button>
                                <Button
                                    onClick={this.onClickClearCurrentCommission}
                                >
                                    Clear
                                </Button>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </>
        )
    }

}

export default withStyles(useStyles)(ManualCreatingPage)
