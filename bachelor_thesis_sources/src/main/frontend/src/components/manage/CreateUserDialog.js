import React from "react";
import {withStyles} from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import {Button, Checkbox, ListItemIcon, ListItemText,} from "@material-ui/core";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {get, handleResponseError, post} from "../../utils/request"
import MenuItem from "@material-ui/core/MenuItem";
import {emailPattern, intOrFloatPattern} from "../../utils/constants";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";


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
        paddingTop: '0px',
        paddingBottom: '0px',
    },
});

const InitialState = {
    user: null,
    disabledSave: true,
    roles: [],
    degrees: [],
    positions: [],

    titulInput: '',
    nameInput: '',
    surnameInput: '',
    emailInput: '',
    errorEmail: false,

    roleSelected: 'ROLE_MANAGER',
    // roleSelected: 'ROLE_TEACHER',
    contractInput: '0',
    errorContract: false,
    departmentInput: '',
    errorDepartment: false,
    selectedDegrees: [],
    selectedPositions: [],

}

class CreateUserDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...InitialState,
        }

    }

    componentDidMount() {
        this.fetchRoles()
        this.fetchPositions()
        this.fetchDegrees()
    }

    fetchRoles() {
        get('/user/roles')
            .then(res => this.setState({
                    roles: res.data,
                }
                // , () => console.log(this.state)
            ))
    }

    fetchPositions() {
        get('/position')
            .then(res => this.setState({
                positions: res.data,
            }, () => this.addDefaultPosition()))
            .catch(err => handleResponseError(err))
    }

    fetchDegrees() {
        get("/exam/degrees")
            .then(res => {
                this.setState({
                    degrees: this.fixDegreesArr(res.data),
                }, () => {
                    this.addDefaultDegree()
                    console.log(this.state.degrees)
                })
            })
            .catch(err => handleResponseError(err))
    }

    fixDegreesArr(arr) {
        arr.shift()
        return arr
    }

    addDefaultDegree() {
        let selected = this.state.selectedDegrees
        selected.push(this.state.degrees[0])
        this.setState({selectedDegrees: selected})
    }

    addDefaultPosition() {
        let selected = this.state.selectedPositions
        selected.push(this.state.positions[this.state.positions.length - 1])
        this.setState({selectedPositions: selected})
    }

    onClickSaveButton = () => {
        console.log("onClickSaveButton")

        let newUser = {
            titlesPre: this.state.titulInput,
            name: this.state.nameInput,
            surname: this.state.surnameInput,
            emailAddress: this.state.emailInput,
            role: this.state.roleSelected,
        }
        if (this.state.roleSelected === 'ROLE_MANAGER') {
            newUser = {
                ...newUser,
                manager: {},//managerPropertyTO
            }
        }
        if (this.state.roleSelected === 'ROLE_TEACHER') {
            newUser = {
                ...newUser,
                teacher: { //teacherPropertyTO
                    contract: this.state.contractInput,
                    department: this.state.departmentInput,
                    positionInCommissions: this.state.selectedPositions,
                    degrees: this.state.selectedDegrees,
                    approvedByScientificCouncilFrom: null,
                },
            }
        }

        console.log(newUser)

        post('/user/new', newUser)
            .then(res => {
                console.log(res)
                if (res.status === 200) {
                    this.props.onSave()
                }
            })
            .catch(err => handleResponseError(err))

    }

    inputsAreValid() {
        if (this.state.errorEmail) {
            console.log('error email')

            return false
        }

        if (!this.state.nameInput || !this.state.surnameInput || !this.state.emailInput) {
            console.log('here2')
            return false
        }

        if (this.state.roleSelected === 'ROLE_TEACHER') {
            if (this.state.errorContract
                || !this.state.departmentInput
                || this.state.selectedDegrees.length === 0
                || this.state.selectedPositions.length === 0) {
                return false
            }
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

        // if (name === 'departmentInput') {
        //     this.setState({
        //         errorDepartment: !!!value.match(intPattern),
        //     })
        // }

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

    render() {
        const {classes} = this.props
        return (
            <Dialog
                open={this.props.open}
                onClose={this.props.onClose}
                fullWidth
            >
                <DialogTitle
                    className={classes.title}
                >
                    Create new user
                </DialogTitle>
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
                        <Grid item xs={3} className={classes.typography}> <Typography>Name</Typography> </Grid>
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
                        <Grid item xs={3} className={classes.typography}><Typography>Surname</Typography></Grid>
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
                        <Grid item xs={3} className={classes.typography}><Typography>Email</Typography></Grid>
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
                        <Grid item xs={3} className={classes.typography}><Typography>Role</Typography></Grid>
                        <Grid item xs>
                            <TextField
                                name={'roleSelected'}
                                select
                                variant={"outlined"}
                                size={"small"}
                                label={"Role"}
                                value={this.state.roleSelected}
                                className={classes.select}
                                onChange={this.onChangeTextField}
                            >
                                {this.state.roles.map(role => {
                                    return (
                                        <MenuItem
                                            key={role}
                                            value={role}
                                        >
                                            {role}
                                        </MenuItem>
                                    )
                                })
                                }
                            </TextField>
                        </Grid>
                    </Grid>
                    {this.state.roleSelected === 'ROLE_TEACHER' &&
                    <>
                        <Grid container className={classes.gridLine}>
                            <Grid item xs={3} className={classes.typography}> <Typography>Contract</Typography></Grid>
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
                            <Grid item xs={3} className={classes.typography}> <Typography>Department</Typography></Grid>
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
                        <Grid container
                              className={classes.gridLine}
                        >
                            <Grid item xs={3} className={classes.typography}>
                                <Typography>Position</Typography></Grid>
                            <Grid item xs>
                                <List className={`${classes.flexRow} ${classes.p0}`} dense>
                                    {
                                        this.state.positions.map((pos, idx) => {
                                            return (
                                                <ListItem
                                                    key={idx}
                                                    value={pos}
                                                    button
                                                    onClick={() => this.handleChangePosition(pos)}
                                                >
                                                    <ListItemIcon>
                                                        <Checkbox
                                                            checked={this.state.selectedPositions.indexOf(pos) !== -1}
                                                            color={"primary"}
                                                            disableRipple
                                                        />
                                                    </ListItemIcon>
                                                    <ListItemText primary={pos.position}/>
                                                </ListItem>
                                            )
                                        })
                                    }
                                </List>
                            </Grid>
                        </Grid>
                        <Grid container
                              className={classes.gridLine}
                        >
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
                    </>
                    }
                </DialogContent>

                <DialogActions>
                    <Button
                        color={'secondary'}
                        variant={'contained'}
                        onClick={this.props.onClose}
                    >
                        Close
                    </Button>
                    <Button
                        color={'primary'}
                        variant={'contained'}
                        disabled={this.state.disabledSave}
                        onClick={this.onClickSaveButton}
                    >
                        Save
                    </Button>
                </DialogActions>

            </Dialog>
        );
    }

}

export default withStyles(useStyles)(CreateUserDialog)
