import React from "react";
import Container from "@material-ui/core/Container";
import {withStyles} from "@material-ui/core/styles";
import SearchBox from "../../components/SearchBox";
import {Grid, ListItem, ListItemText, Paper, Snackbar} from "@material-ui/core";
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
import EditTeacherDialogClass from "../../components/manage/EditTeacherDialogClass";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import {dateFormatMoment, dateTimeFormatMoment, timeFormatMoment} from "../../utils/constants"
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";

const InitialState = {
    searchPattern: '',
    teachers: [],
    locations: [],
    degrees: [],
    fields: [],

    selectedDegree: '',
    selectedField: '',
    selectedLocation: '',
    selectedDate: new Date().setHours(9, 0),

    commission: null,
    edit: false,
    snackOpen: false,

    currentPage: 0,
    size: 10, //count items in current page
    totalItemsCount: null,
    totalPagesCount: null,

    pageSizes: [2, 10, 25, 50, 100],

    editTeacherDialogOpen: false,
    currentTeacher: null,
}

const useStyles = theme => ({
    currentCommissionRoot: {
        marginLeft: theme.spacing(2),
    },
    currentCommissionPaper: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    button: {
        margin: theme.spacing(1),
    },
    currentCommissionItem: {
        padding: '0',
        margin: theme.spacing(1),
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
    },
    gridLine: {
        margin: theme.spacing(1)
    },
    typography: {
        alignSelf: 'center',
        textAlign: 'center',
    },
    buttonBox: {
        display: 'flex',
        justifyContent: 'space-evenly'
    },
    paginationBox: {
        margin: theme.spacing(1),
        display: 'flex',
        justifyContent: 'flex-end',
    },
    pageSelect: {
        width: '70px',
        marginLeft: '10px',
    },
    flex: {
        display: 'flex',
    },
    p1: {
        padding: theme.spacing(1),
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
        // console.log(this.props)
        if (!this.props.location.commission) {
            this.fetchAll()
        } else {
            //edit some commission

            this.setState({
                commission: this.props.location.commission,
                selectedDegree: this.props.location.commission.exam.degree,
                selectedField: this.props.location.commission.exam.fieldOfStudy,
                selectedLocation: this.props.location.commission.exam.location,
                selectedDate: this.dateTimeStrToDate(this.props.location.commission.exam.date, this.props.location.commission.exam.time),
                edit: true,
            }, () => {
                this.fetchTeachers()
                this.fetchDegrees(true)
                this.fetchFields(true)
                this.fetchLocations(moment(this.state.selectedDate).format(dateFormatMoment));
            })
        }

    }

    dateTimeStrToDate(date, time) {
        const str = date.concat(' ').concat(time)
        return moment(str, dateTimeFormatMoment).toDate()
    }

    fetchAll(trigger) {
        this.fetchTeachers()
        this.fetchDegrees()
        this.fetchLocations(moment(this.state.selectedDate).format(dateFormatMoment));
    }

    fetchLocations(dateF) {
        get(`/location/free/${dateF}`)
            .then(response => {
                if (this.state.edit) {
                    this.setState({
                            locations: response.data,
                        }
                        , () => {
                            // console.log(response.data)
                            console.log(this.state)
                        })
                } else {
                    this.setState({
                            locations: response.data,
                            selectedLocation: response.data.length > 0 ? response.data[0] : '',
                        }
                        , () => {
                            console.log(this.state)

                            // console.log(response.data)
                            // console.log(this.state)
                        }
                    )
                }
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

    fetchTeachers(paginationChanged) {

        const pageTO = {
            page: paginationChanged ? this.state.currentPage - 1 : this.state.currentPage,
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
                    }
                    // , () => console.log(res.data)
                )
            })
            .catch(err => handleResponseError(err))
    }

    fetchFields(edit) {
        get(`/field/degree/${this.state.selectedDegree}`)
            .then(res => {
                if (edit) {
                    this.setState({
                        fields: res.data,
                    }, () => this.fetchFieldByName())
                } else {
                    this.setState({
                        fields: res.data,
                        selectedField: res.data.length > 0 ? res.data[0] : '',
                    })
                }
            })
            .catch(err => handleResponseError(err))
    }

    fetchFieldByName() {
        get(`/field/byName/${this.state.selectedField}`)
            .then(res => {
                this.setState({
                    selectedField: this.state.fields.find(f => f.id === res.data.id),
                })
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
            }, () => this.fetchTeachers())
        } else {
            this.setState({searchPattern: ''})
        }
    }

    handleChangeDate = (event) => {
        this.setState({
            selectedDate: event,
        }, () => this.fetchAll())
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
        let com = {...this.state.commission}
        com.teachers = com.teachers.filter(item => item !== teacher)
        this.setState({
            commission: com,
        }, () => console.log(this.state.commission))
    }

    onClickSaveCommission = () => {
        if (!this.state.commission) {
            return
        }

        //if updating existed commission
        // if (this.props.location.commission) {
        if (this.state.edit) {
            const payload = {
                ...this.state.commission,
                exam: {
                    ...this.state.commission.exam,
                    date: moment(this.state.selectedDate).format(dateFormatMoment),
                    time: moment(this.state.selectedDate).format(timeFormatMoment),
                    degree: this.state.selectedDegree,
                    fieldOfStudy: this.state.selectedField.field,
                    location: this.state.selectedLocation,
                    semester: null,
                }
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
                    this.setState({
                        ...InitialState,
                        snackOpen: true,
                    }, () => this.fetchAll())
                })
                .catch(err => handleResponseError(err))


        }
    }

    onChangePagination = (event, value) => {
        this.setState({
            currentPage: value,
        }, () => this.fetchTeachers(true))
    }

    onChangePageSize = (e) => {
        this.setState({
                size: e.target.value,
            }, () => this.fetchTeachers(false)
        )
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

    onClickEditTeacher = teacher => {
        this.setState({
            currentTeacher: teacher,
            editTeacherDialogOpen: true,
        })
    }

    onCloseEditTeacherDialog = () => {
        this.setState({
            currentTeacher: null,
            editTeacherDialogOpen: false,
        })
    }

    strLocation() {
        if (this.state.selectedLocation) {
            return this.state.selectedLocation.building + ":" + this.state.selectedLocation.classroom
        }
        return ""
    }

    render() {

        if (!this.state.locations || !this.state.degrees) {
            return <></>
        }
        const {classes} = this.props

        let defaults = {
            date: this.state.selectedDate,
            loc: this.state.selectedLocation,
            degree: this.state.selectedDegree,
            field: this.state.selectedField,
        }
        // defaults = this.state.edit ? defaults : false

        return (
            <Box className={'pageContent'}>
                <Container>
                    {this.state.edit ?
                        <h1>Edit commission</h1> :
                        <h1>Manual Creating Page</h1>
                    }
                    <SearchBox
                        searchPattern={this.state.searchPattern}
                        onChange={this.handleSearchBoxInput}
                        label='Name or username'
                    />
                    <EditTeacherDialogClass
                        open={this.state.editTeacherDialogOpen}
                        onClose={this.onCloseEditTeacherDialog}
                        teacher={this.state.currentTeacher}
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
                        edit={this.state.edit}
                    />

                    <Grid container>
                        <Grid item xs>
                            <Paper>
                                {/*<Typography variant={"h5"} className={classes.typography}> Available teachers </Typography>*/}
                                <Box className={'titleBack'}>
                                    <Typography className={'title'} variant={'h5'}>Available teachers</Typography>
                                </Box>
                                <Box className={'paginationBox'}>
                                    <Pagination
                                        count={this.state.totalPagesCount}
                                        page={this.state.currentPage + 1}
                                        siblingCount={1}
                                        boundaryCount={1}
                                        shape="rounded"
                                        onChange={this.onChangePagination}
                                    />
                                    <Box>
                                        <Typography className={classes.typography}>Items per page: </Typography>
                                        <TextField
                                            select
                                            value={this.state.size}
                                            onChange={this.onChangePageSize}
                                        >
                                            {this.state.pageSizes.map((size, idx) => (
                                                <MenuItem key={idx} value={size}>
                                                    {size}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Box>
                                </Box>
                                <SearchResultPanel
                                    data={this.state.teachers}
                                    onClick={this.onClickAddTeacherButton}
                                    disabledCheck={this.disabledButtonCheck}
                                    add={true}
                                    editButton={this.onClickEditTeacher}
                                />
                                <Box className={'paginationBox'}>
                                    <Pagination
                                        count={this.state.totalPagesCount}
                                        page={this.state.currentPage + 1}
                                        siblingCount={1}
                                        boundaryCount={1}
                                        shape="rounded"
                                        onChange={this.onChangePagination}
                                    />
                                    <Box>
                                        <Typography className={classes.typography}>Items per page: </Typography>
                                        <TextField
                                            select
                                            value={this.state.size}
                                            onChange={this.onChangePageSize}
                                        >
                                            {this.state.pageSizes.map((size, idx) => (
                                                <MenuItem key={idx} value={size}>
                                                    {size}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid className={classes.currentCommissionRoot} item xs={4}>
                            <Paper className={classes.currentCommissionPaper}>
                                <Box className={'titleBack'}>
                                    <Typography className={'title'} variant={'h6'}>Current Commission</Typography>
                                </Box>
                                <Divider/>
                                <List className={classes.p1}>
                                    {this.state.commission &&
                                    this.state.commission.teachers.map((t, idx) => {
                                        return (
                                            <ListItem
                                                className={classes.currentCommissionItem}
                                                key={idx}
                                            >
                                                <ListItemText>{t.name + " " + t.surname}</ListItemText>
                                                <Button
                                                    id={'uniqueButton'}
                                                    color={'secondary'}
                                                    variant={'text'}
                                                    onClick={this.onClickRemoveTeacher(t)}
                                                >
                                                    <ClearIcon/>
                                                </Button>
                                            </ListItem>
                                        )
                                    })}
                                    {this.state.commission && !!this.state.commission.teachers.length && <Divider/>}
                                </List>
                                <Box className={classes.p1}>
                                    <Grid className={classes.gridLine} container>
                                        <Grid xs={3} item> <Typography>Location</Typography> </Grid>
                                        <Grid xs item> <Typography>{this.strLocation()}</Typography> </Grid>
                                    </Grid>
                                    <Grid className={classes.gridLine} container>
                                        <Grid xs={3} item> <Typography>Date</Typography> </Grid>
                                        <Grid xs item>
                                            <Typography> {moment(this.state.selectedDate).format(dateFormatMoment)} </Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid className={classes.gridLine} container>
                                        <Grid xs={3} item> <Typography>Time</Typography> </Grid>
                                        <Grid xs item>
                                            <Typography> {moment(this.state.selectedDate).format(timeFormatMoment)} </Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid className={classes.gridLine} container>
                                        <Grid xs={3} item> <Typography>Degree</Typography> </Grid>
                                        <Grid xs item> <Typography>{this.state.selectedDegree}</Typography> </Grid>
                                    </Grid>
                                    <Grid className={classes.gridLine} container>
                                        <Grid xs={3} item> <Typography>Study field</Typography> </Grid>
                                        <Grid xs item> <Typography>{this.state.selectedField.field}</Typography> </Grid>
                                    </Grid>
                                </Box>
                                <Divider/>
                                <Box className={`${classes.buttonBox} `}>
                                    <Button
                                        color={'primary'}
                                        disabled={!(this.state.commission && !!this.state.commission.teachers.length)}
                                        variant={'contained'}
                                        onClick={this.onClickSaveCommission}
                                        className={classes.button}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        color={'secondary'}
                                        variant={'contained'}
                                        onClick={this.onClickClearCurrentCommission}
                                        className={classes.button}
                                    >
                                        Clear
                                    </Button>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        )
    }
}

export default withStyles(useStyles)(ManualCreatingPage)
