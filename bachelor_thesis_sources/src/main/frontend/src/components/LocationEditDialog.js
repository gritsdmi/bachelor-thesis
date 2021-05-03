import React from "react";
import {Dialog, DialogActions, DialogContent, DialogTitle, TextField} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {handleResponseError, post} from "../utils/request"


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
});

const InitialState = {
    edit: false,

    building: '',
    classroom: '',

    location: '',
}

class LocationEditDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...InitialState,
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps !== this.props) {
            if (this.props.open) {
                this.setState({
                    location: this.props.location,
                    edit: !!this.props.location,
                }, () => {
                    if (this.state.edit) {
                        this.setState({
                            building: this.props.location.building,
                            classroom: this.props.location.classroom,
                        })
                    }
                })
            } else {
                this.setState({...InitialState})
            }
        }
    }

    onChangeInput = (e) => {
        this.setState({
                [e.target.name]: e.target.value,
            }
        )
    }

    onClickSave = () => {
        const payload = {
            building: this.state.building,
            classroom: this.state.classroom,
        }

        const url = this.state.edit ? `/location/${this.state.location.id}` : '/location'
        post(url, payload)
            .then(() => {
                this.props.onClose()
            })
            .catch(err => handleResponseError(err))
    }

    render() {
        const {classes} = this.props
        return (
            <Dialog
                open={this.props.open}
                onClose={this.props.onClose}
            >
                <DialogTitle>{this.state.edit ? "Edit " : "New "} location</DialogTitle>
                <DialogContent dividers>
                    <Grid container className={classes.gridLine}>
                        <Grid xs={4} item className={classes.typography}>
                            <Typography>Building</Typography>
                        </Grid>
                        <Grid xs item>
                            <TextField
                                fullWidth
                                name={'building'}
                                variant={"outlined"}
                                size={"small"}
                                placeholder={'T2'}
                                value={this.state.building}
                                onChange={this.onChangeInput}
                            />
                        </Grid>
                    </Grid>
                    <Grid container className={classes.gridLine}>
                        <Grid xs={4} item className={classes.typography}>
                            <Typography>Classroom</Typography>
                        </Grid>
                        <Grid xs item>
                            <TextField
                                fullWidth
                                name={'classroom'}
                                variant={"outlined"}
                                size={"small"}
                                placeholder={'D3-132'}
                                value={this.state.classroom}
                                onChange={this.onChangeInput}
                            />
                        </Grid>
                    </Grid>
                    <Grid container className={classes.gridLine}>
                        <Grid xs={4} item className={classes.typography}>
                            <Typography>Preview</Typography>
                        </Grid>
                        <Grid xs item>
                            <Typography>{this.state.building + ": " + this.state.classroom}</Typography>
                        </Grid>
                    </Grid>
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
                        disabled={!!!this.state.classroom || !!!this.state.building}
                        onClick={this.onClickSave}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default withStyles(useStyles)(LocationEditDialog)
