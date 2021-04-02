import React from "react";
import {Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import {get, post} from "../../utils/request";

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

const InitialState = {
    template: null,
}

class EmailTemplateEditDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...InitialState,
        }
    }

    componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props !== prevProps) {

            if (!this.props.open) {
                this.setState({...InitialState}, () => console.log(this.state))
            } else {
                this.fetchTemplate(this.props.templateId)
            }
        }
    }

    fetchTemplate(id) {
        get(`/template/${id}`)
            .then(res => this.setState({
                template: res.data,
            }))
            .catch(err => console.log(err))
    }

    onClickSaveButton = () => {
        const payload = this.state.template
        console.log("onClickSaveButton", payload)

        post(`/template`, payload)
            .then(res => console.log(res.data))
    }

    onChangeSubject = (evt) => {
        let template = this.state.template
        template.subject = evt.target.value
        this.setState({
            template: template
        }, () => console.log(this.state))
    }

    onChangeText = (evt) => {
        let template = this.state.template
        template.text = evt.target.value
        this.setState({
            template: template
        }, () => console.log(this.state))
    }

    render() {
        if (!this.props.templateId || !this.state.template) {
            return <></>
        }
        const {classes} = this.props

        return (
            <Dialog
                open={this.props.open}
                onClose={this.props.onClose}
                fullWidth
            >
                <DialogTitle>
                    Edit {this.state.template.emailType} email template
                </DialogTitle>
                <DialogContent
                    dividers
                >
                    <Grid container>
                        <Grid className={classes.firstCol} item xs={2}>Subject</Grid>
                        <Grid className={classes.item} item xs>
                            <TextField
                                id={"subjectInput"}
                                variant={'outlined'}
                                autoFocus={false}
                                defaultValue={this.state.template.subject}
                                size={"small"}
                                onChange={this.onChangeSubject}
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
                                defaultValue={this.state.template.text}
                                size={"small"}
                                onChange={this.onChangeText}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={this.props.onClose}
                    >Close</Button>
                    <Button
                        onClick={this.onClickSaveButton}
                    >Save</Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withStyles(useStyles)(EmailTemplateEditDialog)
