import React from "react";
import {
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    ListItemIcon,
    ListItemText,
    TextField
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {withStyles} from "@material-ui/core/styles";
import {get, handleResponseError, post} from "../../utils/request";
import Grid from "@material-ui/core/Grid";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import {dateFormatMoment, emailPattern, intOrFloatPattern} from "../../utils/constants";
import moment from "moment";

const useStyles = theme => ({
    title: {
        textAlign: 'center',
    },
    typography: {
        alignSelf: 'center',
    },
    gridLine: {
        padding: theme.spacing(2),
    },
    select: {
        width: '200px',
    },
    flexRow: {
        display: 'flex',
        flexDirection: 'row',
    },
    p0: {
        padding: '0px',
    },
});

const InitialState = {
    contractInput: '',
    teacher: null,

    titulInput: '',
    nameInput: '',
    surnameInput: '',
    emailInput: '',
    positions: [],
    selectedPositions: [],
    disabledSave: true,
    errorContract: false,
    degrees: [],
    selectedDegrees: [],
    extern: false,
    approvedByScientificCouncilFrom: '',
    departmentInput: '',
    errorDepartment: false,
}

class EditTeacherDialogClass extends React.Component {
    //add name of value dialog
    constructor(props) {
        super(props);
        this.state = {
            openInputField: false,
            currentTeacherContract: '',
        }
    }

    componentDidMount() {
        this.setState({
            ...this.props,
            ...InitialState,
        }, () => console.log(this.state))
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps !== this.props) {
            if (this.props.teacher) {
                this.fetchTeacher()
            } else {
                this.setState({
                    ...InitialState
                })
            }
        }
    }

    fetchTeacher() {
        get(`/user/teacher/${this.props.teacher.id}`)
            .then((response) => {
                this.setState({
                        teacher: response.data
                    }, () => {
                        this.fetchPositions()
                    }
                )
            })
            .catch(err => handleResponseError(err))
    }

    fetchPositions() {
        get('/position')
            .then(res => this.setState({
                positions: res.data,
            }, () => this.fetchDegrees()))
            .catch(err => handleResponseError(err))
    }

    fetchDegrees() {
        get("/exam/degrees")
            .then(res => {
                this.setState({
                        degrees: this.fixDegreesArr(res.data),
                    }, () => this.fillInputs()
                )
            })
            .catch(err => handleResponseError(err))
    }

    fixDegreesArr(arr) {
        arr.shift()
        return arr
    }

    fillInputs() {
        const user = this.state.teacher
        this.fillSelectedPos(user)
        const test = user.teacher.commissionTypes.split(',')
        console.log(test)
        this.setState({
            titulInput: user.titlesPre,
            nameInput: user.name,
            surnameInput: user.surname,
            emailInput: user.emailAddress,
            contractInput: user.teacher.contract ? user.teacher.contract : 0,
            departmentInput: user.teacher.department,
            positionInCommissions: user.teacher.department,
            approvedByScientificCouncilFrom: user.teacher.approvedByScientificCouncilFrom,
            extern: user.teacher.extern,
            selectedDegrees: user.teacher.commissionTypes.split(','),

        }, () => {
            this.setState({
                disabledSave: !this.inputsAreValid(),
            })
        })
    }

    fillSelectedPos(user) {
        let arr = []
        this.state.positions.forEach(pos => {
            user.teacher.positionInCommissions.forEach(sel => {
                if (sel.id === pos.id) {
                    arr.push(pos)
                }
            })
        })
        this.setState({
            selectedPositions: arr,
        })
    }

    onClickSaveButton = () => {
        const comTypesStr = this.state.selectedDegrees.join()
        let payload = {
            ...this.props.teacher,
            titlesPre: this.state.titulInput,
            name: this.state.nameInput,
            surname: this.state.surnameInput,
            emailAddress: this.state.emailInput,

            teacher: {
                ...this.props.teacher.teacher,
                contract: this.state.contractInput,
                department: this.state.departmentInput,
                positionInCommissions: this.state.selectedPositions,
                approvedByScientificCouncilFrom: this.state.approvedByScientificCouncilFrom,
                commissionTypes: comTypesStr,
                extern: this.state.extern,
            }
        }

        post(`/user/${this.props.teacher.id}`, payload)
            .then(response => {
                this.props.onTeacherSave()
            })
            .catch(err => handleResponseError(err))
    }

    handleContractInput = (evt) => {
        const value = evt.target.value;
        this.setState({contractInput: value})
    }

    datesStr() {
        let str = "";
        this.state.teacher.teacher.unavailableDates.map(date => {
            str += date.date + ' '
        })
        return str
    }

    handleChangePosition = (e) => {
        let selected = this.state.selectedPositions
        if (selected.includes(e)) {
            selected = selected.filter(item => item !== e)
        } else {
            selected.push(e)
        }

        this.setState({
                selectedPositions: selected,
            }, () => {
                this.setState({
                    disabledSave: !this.inputsAreValid(),
                })
            }
        )
    }

    inputsAreValid() {
        if (this.state.errorEmail) {
            return false
        }

        if (!this.state.nameInput || !this.state.surnameInput || !this.state.emailInput) {
            return false
        }
        if (!this.state.emailInput.match(emailPattern)) {
            this.setState({
                errorEmail: !this.state.emailInput.match(emailPattern),
            })
            return false
        }

        if (this.state.errorContract
            || !this.state.departmentInput
            || this.state.selectedDegrees.length === 0
            || this.state.selectedPositions.length === 0) {
            return false
        }
        return true
    }


    onChangeTextField = (e) => {
        const name = e.target.name
        const value = e.target.value
        if (name === 'contractInput') {
            this.setState({
                errorContract: !!!value.match(intOrFloatPattern),
            })
        }

        if (name === 'emailInput') {
            this.setState({
                errorEmail: !value.match(emailPattern),
            })
        }

        this.setState({
                [e.target.name]: e.target.value,
            }, () => {
                this.setState({
                    disabledSave: !this.inputsAreValid(),
                })
            }
        )
    }

    handleChangeDegree = (e) => {
        let selected = this.state.selectedDegrees
        if (selected.includes(e)) {
            selected = selected.filter(item => item !== e)
        } else {
            selected.push(e)
        }

        this.setState({
                selectedDegrees: selected,
            }, () => {
                this.setState({
                    disabledSave: !this.inputsAreValid(),
                })
            }
        )
    }

    onChangeExtern = () => {
        this.setState({
            extern: !this.state.extern,
        })
    }

    render() {
        if (!this.state.teacher) {
            return <></>
        }
        const {open, onClose, teacher, classes} = this.props;

        return (
            <div>
                {teacher &&
                <Dialog
                    open={open}
                    fullWidth
                    onClose={onClose}
                >
                    <DialogTitle>Edit teacher {teacher.surname}</DialogTitle>
                    <DialogContent dividers>
                        <Grid container className={classes.gridLine}>
                            <Grid item xs={3} className={classes.typography}> <Typography>Titul</Typography> </Grid>
                            <Grid item>
                                <TextField
                                    fullWidth
                                    autoFocus
                                    name={'titulInput'}
                                    variant={"outlined"}
                                    size={"small"}
                                    label={"Titul"}
                                    value={this.state.titulInput}
                                    onChange={this.onChangeTextField}
                                />
                            </Grid>
                        </Grid>
                        <Grid container className={classes.gridLine}>
                            <Grid item xs={3} className={classes.typography}> <Typography>Name</Typography>
                            </Grid>
                            <Grid item xs>
                                <TextField
                                    fullWidth
                                    name={'nameInput'}
                                    variant={"outlined"}
                                    size={"small"}
                                    label={"Name"}
                                    value={this.state.nameInput}
                                    onChange={this.onChangeTextField}
                                />
                            </Grid>
                        </Grid>
                        <Grid container className={classes.gridLine}>
                            <Grid item xs={3}
                                  className={classes.typography}><Typography>Surname</Typography></Grid>
                            <Grid item xs>
                                <TextField
                                    fullWidth
                                    name={'surnameInput'}
                                    variant={"outlined"}
                                    size={"small"}
                                    label={"Surname"}
                                    value={this.state.surnameInput}
                                    onChange={this.onChangeTextField}
                                />
                            </Grid>
                        </Grid>
                        <Grid container className={classes.gridLine}>
                            <Grid item xs={3}
                                  className={classes.typography}><Typography>Email</Typography>
                            </Grid>
                            <Grid item xs>
                                <TextField
                                    fullWidth
                                    name={'emailInput'}
                                    variant={"outlined"}
                                    size={"small"}
                                    label={"Email"}
                                    value={this.state.emailInput}
                                    onChange={this.onChangeTextField}
                                    error={this.state.errorEmail}
                                />
                            </Grid>
                        </Grid>
                        <Grid container className={classes.gridLine}>
                            <Grid item xs={3} className={classes.typography}>
                                <Typography>Contract</Typography>
                            </Grid>
                            <Grid item xs>
                                <TextField
                                    fullWidth
                                    name={'contractInput'}
                                    variant={"outlined"}
                                    size={"small"}
                                    label={"Contract"}
                                    value={this.state.contractInput}
                                    onChange={this.onChangeTextField}
                                    error={this.state.errorContract}
                                />
                            </Grid>
                        </Grid>
                        <Grid container className={classes.gridLine}>
                            <Grid item xs={3} className={classes.typography}>
                                <Typography>Department</Typography>
                            </Grid>
                            <Grid item xs>
                                <TextField
                                    fullWidth
                                    name={'departmentInput'}
                                    variant={"outlined"}
                                    size={"small"}
                                    label={"Department"}
                                    value={this.state.departmentInput}
                                    onChange={this.onChangeTextField}
                                    error={this.state.errorDepartment}
                                />
                            </Grid>
                        </Grid>
                        <Grid container className={classes.gridLine}>
                            <Grid item xs={3} className={classes.typography}>
                                <Typography>Position</Typography>
                            </Grid>
                            <Grid item xs>
                                <List className={`${classes.flexRow} ${classes.p0}`} dense>
                                    {
                                        this.state.positions.map((pos, idx) => {
                                            return (
                                                <ListItem
                                                    key={idx}
                                                    value={pos}
                                                    button
                                                    className={classes.p0}
                                                    onClick={() => this.handleChangePosition(pos)}
                                                >
                                                    <ListItemIcon>
                                                        <Checkbox
                                                            checked={this.state.selectedPositions.indexOf(pos) !== -1}
                                                            color={"primary"}
                                                            disableRipple
                                                        />
                                                    </ListItemIcon>
                                                    <ListItemText primary={pos.description}/>
                                                </ListItem>
                                            )
                                        })
                                    }
                                </List>
                            </Grid>
                        </Grid>
                        <Grid container className={classes.gridLine}>
                            <Grid item xs={3} className={classes.typography}> <Typography>Commission
                                type</Typography></Grid>
                            <Grid item xs>
                                <List className={`${classes.flexRow} ${classes.p0}`} dense>
                                    {
                                        this.state.degrees.map((deg, idx) => {
                                            return (
                                                <ListItem
                                                    key={idx}
                                                    value={deg}
                                                    button
                                                    className={classes.p0}
                                                    onClick={() => this.handleChangeDegree(deg)}
                                                >
                                                    <ListItemIcon>
                                                        <Checkbox
                                                            checked={this.state.selectedDegrees.indexOf(deg) !== -1}
                                                            color={"primary"}
                                                            disableRipple
                                                        />
                                                    </ListItemIcon>
                                                    <ListItemText primary={deg}/>
                                                </ListItem>
                                            )
                                        })
                                    }
                                </List>
                            </Grid>
                        </Grid>

                        <Grid container className={classes.gridLine}>
                            <Grid item xs={3} className={classes.typography}>
                                <Typography>VR dne</Typography>
                            </Grid>
                            <Grid item xs>
                                <TextField
                                    fullWidth
                                    name={'approvedByScientificCouncilFrom'}
                                    variant={"outlined"}
                                    size={"small"}
                                    label={`Scientific Council from`}
                                    placeholder={`${moment(new Date()).format(dateFormatMoment)}`}
                                    value={this.state.approvedByScientificCouncilFrom}
                                    onChange={this.onChangeTextField}
                                />
                            </Grid>
                        </Grid>
                        <Grid container className={classes.gridLine}>
                            <Grid item xs={3} className={classes.typography}> <Typography>Extern</Typography></Grid>
                            <Grid item xs>
                                <Checkbox
                                    onClick={this.onChangeExtern}
                                    checked={this.state.extern}
                                    color={"primary"}
                                />
                            </Grid>
                        </Grid>
                        <Grid container className={classes.gridLine}>
                            <Grid item xs={3} className={classes.typography}>
                                <Typography>Unavailable dates</Typography>
                            </Grid>
                            <Grid item xs>{this.datesStr()}</Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            color={'secondary'}
                            variant={'contained'}
                            onClick={onClose}
                        >
                            Close</Button>
                        <Button
                            color={'primary'}
                            variant={'contained'}
                            disabled={this.state.disabledSave}
                            onClick={this.onClickSaveButton}
                        >
                            Save</Button>
                    </DialogActions>
                </Dialog>}
            </div>
        )
    }
}

export default withStyles(useStyles)(EditTeacherDialogClass)
