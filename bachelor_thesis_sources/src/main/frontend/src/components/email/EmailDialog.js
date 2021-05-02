import React from "react";
import {withStyles} from "@material-ui/core/styles";
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    MenuItem,
    Select,
    Snackbar,
    TextField
} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {get, handleResponseError, post} from "../../utils/request"
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import {emailPattern} from '../../utils/constants'

const useStyles = theme => ({
    firstCol: {
        paddingTop: theme.spacing(1.25),
        margin: theme.spacing(1)
    },
    item: {
        margin: theme.spacing(1)
    },
    select: {
        paddingTop: theme.spacing(0),
        paddingBottom: theme.spacing(0),
        width: "150px",
    },
    invalid: {
        borderColor: "red",
    },
});

const InitialState = {

    teachers: [],
    emailTypes: [],

    currentEmailType: 'FINAL',
    emailInput: null,
    subjectInput: null,
    textInput: null,

    snackOpen: false,
    validEmails: true,
    emailsWasTouched: false,

}
const emailsStr = (teachers) => {
    let str = ""

    teachers.forEach(teacher => {
        str += teacher.emailAddress + " "
    })
    return str
}

class EmailDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...InitialState,
        }
    }

    componentDidMount() {
        this.setState({
            emailInput: emailsStr(this.props.teachers),
        })

        get("/email/types").then(response => {
            this.setState({
                emailTypes: response.data,
                currentEmailType: response.data ? response.data[0] : 'FINAL',
            }, () => {
                this.fetchEmailTemplateByType(this.state.currentEmailType)
            })
        })

        this.validateEmail()
    }

    fetchEmailTemplateByType(emailType) {
        get(`/template/type/${emailType}`)
            .then(res => {
                this.setState({
                        currentEmailType: res.data.emailType,
                        subjectInput: res.data.subject,
                        textInput: res.data.text,
                    }, () => console.log(this.state)
                )
            })
            .catch(err => handleResponseError(err))

    }

    onClickSendButton = () => {

        if (!this.state.validEmails) {
            return
        }
        const emailTo = {
            author: null,
            toUsers: this.state.emailsWasTouched ? [] : this.props.teachers,
            type: this.state.currentEmailType,
            messageText: this.state.textInput,
            subject: this.state.subjectInput,
            toStr: this.state.emailsWasTouched ? this.state.emailInput.split(' ') : null,
        }

        post('/email/send', emailTo)
            .then(res => {
                console.log(res)
                this.props.onClose()
            })
            .catch(err => handleResponseError(err))

        this.setState({
            snackOpen: true,
        })
    }

    onChangeEmailType = (event) => {
        this.setState({
                currentEmailType: event.target.value,
            }
            , () => {
                this.fetchEmailTemplateByType(this.state.currentEmailType)
            }
        )
    }

    onChangeEmailInput = (event) => {
        this.setState({
            emailInput: event.target.value,
        }, () => {
            this.validateEmail(this.state.emailInput)
        })
    }

    onChangeSubjectInput = (event) => {
        this.setState({
            subjectInput: event.target.value,
        })
    }

    onChangeTextInput = (event) => {
        this.setState({
            textInput: event.target.value,
        })
    }

    onCloseSnackbar = () => {
        this.setState({
            snackOpen: false,
        })
    }

    validateEmail = (input) => {
        let valid = true

        if (this.state.emailsWasTouched) {
            let emails = input.split(' ')
            emails.forEach(email => {
                if (email.match(emailPattern)) {
                } else {
                    valid = false;
                }
            })
        } else {
            this.props.teachers.forEach(t => {
                if (t.emailAddress.match(emailPattern)) {
                } else {
                    valid = false;
                }
            })
        }

        this.setState({
            validEmails: valid,
        })
    }


    render() {
        if (!this.state.emailTypes) {
            return <></>
        }

        const {classes} = this.props;

        return (
            <div>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.snackOpen}
                    autoHideDuration={4000}
                    onClose={this.onCloseSnackbar}
                    message="Email was sent!"
                    action={
                        <React.Fragment>
                            <IconButton size="small" aria-label="close" color="inherit" onClick={this.onCloseSnackbar}>
                                <CloseIcon fontSize="small"/>
                            </IconButton>
                        </React.Fragment>
                    }
                />
                <Dialog
                    fullWidth
                    open={this.props.open}
                    onClose={this.props.onClose}
                >
                    <DialogTitle>
                        Send email
                    </DialogTitle>
                    <DialogContent
                        dividers
                    >
                        <Grid container>
                            <Grid className={classes.firstCol} item xs={2}>Type</Grid>
                            <Grid className={classes.item} item xs>
                                <Select
                                    className={classes.select}
                                    value={this.state.currentEmailType}
                                    onChange={this.onChangeEmailType}
                                    // variant={'outlined'}
                                >
                                    {!this.state.emailTypes ? '' :
                                        this.state.emailTypes.map(item => {
                                            return (<MenuItem
                                                key={item}
                                                value={item}
                                            >{item}</MenuItem>)
                                        })
                                    }
                                </Select>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid className={classes.firstCol} item xs={2}>To</Grid>
                            <Grid className={classes.item} item xs>
                                <TextField
                                    fullWidth
                                    error={!this.state.validEmails}
                                    disabled={!this.state.emailsWasTouched}
                                    id={"emailInput"}
                                    variant={'outlined'}
                                    autoFocus={false}
                                    value={this.state.emailInput}
                                    size={"small"}
                                    onClick={() => {
                                        this.setState({
                                            emailsWasTouched: true,
                                        })
                                    }}
                                    onChange={this.onChangeEmailInput}
                                />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid className={classes.firstCol} item xs={2}>Subject</Grid>
                            <Grid className={classes.item} item xs>
                                <TextField
                                    fullWidth
                                    id={"subjectInput"}
                                    variant={'outlined'}
                                    autoFocus={false}
                                    value={this.state.subjectInput}
                                    size={"small"}
                                    onChange={this.onChangeSubjectInput}
                                />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid className={classes.firstCol} item xs={2}>Message</Grid>
                            <Grid className={classes.item} item xs>
                                <TextField
                                    fullWidth
                                    variant={'outlined'}
                                    id={"textInput"}
                                    multiline={true}
                                    rows={6}
                                    autoFocus={true}
                                    value={this.state.textInput}
                                    size={"small"}
                                    onChange={this.onChangeTextInput}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            color={'secondary'}
                            variant={'contained'}
                            onClick={this.props.onClose}
                        >Close</Button>
                        <Button
                            color={'primary'}
                            variant={'contained'}
                            onClick={this.onClickSendButton}
                        >Send</Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}

export default withStyles(useStyles)(EmailDialog)
