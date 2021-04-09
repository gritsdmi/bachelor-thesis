import React from "react";
import {withStyles} from "@material-ui/core/styles";
import {Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, Select, TextField} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {get, post} from "../../utils/request"

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
        paddingBottom: theme.spacing(0)
    }
});

class EmailDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            teachers: [],
            emailTypes: [],
            currentType: null,
            emailInput: null,
            subjectInput: null,
            textInput: null,
        }
    }

    componentDidMount() {
        get("/email/types").then(response => {
            this.setState({emailTypes: response.data})
        })
    }

    onClickSendButton = () => {
        console.log("onClickSendButton")
        //todo control/verify inputs
        const emailTo = {
            author: null,
            to: [],
            type: this.state.currentType,
            messageText: this.state.textInput,
            subject: this.state.subjectInput,
            emailTO: this.state.emailInput,
        }

        post('/email/send', emailTo)
            .then(res => console.log(res))
            .catch(err => console.log(err))
    }

    onChangeEmailInput = (event) => {
        console.log(event.target.value)
        this.setState({
            emailInput: event.target.value,
        }, () => console.log(this.state.emailInput))
    }

    onChangeSubjectInput = (event) => {
        this.setState({
            subjectInput: event.target.value,
        }, () => console.log(this.state.subjectInput))
    }

    onChangeTextInput = (event) => {
        this.setState({
            textInput: event.target.value,
        }, () => console.log(this.state.textInput))
    }


    render() {
        if (!this.state.emailTypes) {
            return <></>
        }

        let emailsDefaultValue = ""
        this.state.teachers.forEach(teacher => {
            emailsDefaultValue += teacher.email + " "
        })
        const {classes} = this.props;

        return (
            <div>
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
                        {/*email dialog content*/}
                        <Grid container>
                            <Grid className={classes.firstCol} item xs={2}>Type </Grid>
                            <Grid className={classes.item} item xs>
                                <Select
                                    className={classes.select}
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
                                    id={"emailInput"}
                                    variant={'outlined'}
                                    autoFocus={false}
                                    defaultValue={emailsDefaultValue}
                                    // placeholder={"placeholder"}
                                    size={"small"}
                                    onChange={this.onChangeEmailInput}
                                />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid className={classes.firstCol} item xs={2}>Subject</Grid>
                            <Grid className={classes.item} item xs>
                                <TextField
                                    id={"subjectInput"}
                                    variant={'outlined'}
                                    autoFocus={false}
                                    defaultValue={''}
                                    // placeholder={"placeholder"}
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
                                    defaultValue={''}
                                    // placeholder={"placeholder"}
                                    size={"small"}
                                    onChange={this.onChangeTextInput}
                                />
                            </Grid>
                        </Grid>

                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={this.props.onClose}
                        >Close</Button>
                        <Button
                            onClick={this.onClickSendButton}
                        >Send</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default withStyles(useStyles)(EmailDialog)
