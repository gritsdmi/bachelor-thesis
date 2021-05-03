import React from "react";
import {withStyles} from "@material-ui/core/styles";
import {Dialog, DialogActions, DialogContent, DialogTitle, ListItem, ListItemText, Paper} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {get, handleResponseError} from "../utils/request";
import List from "@material-ui/core/List";
import Box from "@material-ui/core/Box";
import LocationEditDialog from "./LocationEditDialog";
import Divider from "@material-ui/core/Divider";

const useStyles = theme => ({
    buttonBox: {
        display: 'flex',
        justifyContent: 'space-between',
    },
    button: {
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
    },
    p0: {
        padding: '0px',
    },
});

const InitialState = {
    locations: [],
    editDialogOpen: false,
    currentLocation: '',
}

class LocationsDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...InitialState,
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps !== this.props && this.props.open) {
            this.fetchLocations()
        }
    }

    fetchLocations() {
        get(`/location`)
            .then(response => {
                this.setState({
                        locations: response.data,
                    }
                )
            })
            .catch(err => handleResponseError(err))
    }

    onClickEdit = (location) => {
        this.setState({
            currentLocation: location,
            editDialogOpen: true,
        })
    }

    onCloseEditDialog = () => {
        this.setState({
            currentLocation: '',
            editDialogOpen: false,
        }, () => this.fetchLocations())
    }

    render() {
        const {classes} = this.props

        return (
            <>
                <LocationEditDialog
                    open={this.state.editDialogOpen}
                    onClose={this.onCloseEditDialog}
                    location={this.state.currentLocation}
                />
                <Dialog
                    open={this.props.open}
                    onClose={this.props.onClose}
                    fullWidth
                >
                    <DialogTitle>
                        Locations
                    </DialogTitle>
                    <DialogContent dividers>
                        {/*<SearchBox*/}
                        {/*    label={"location"}*/}
                        {/*/>*/}
                        <Paper>
                            <List className={classes.p0}>
                                {this.state.locations.map((loc, idx) => {
                                    return (
                                        <Box key={idx}>
                                            <ListItem
                                                value={loc}
                                            >
                                                <ListItemText>{loc.building + ": " + loc.classroom}</ListItemText>
                                                <Button
                                                    color={'primary'}
                                                    variant={'contained'}
                                                    onClick={() => this.onClickEdit(loc)}
                                                >
                                                    Edit
                                                </Button>
                                            </ListItem>
                                            {(idx !== this.state.locations.length - 1) && <Divider/>}
                                        </Box>
                                    )
                                })}
                            </List>
                        </Paper>
                    </DialogContent>
                    <DialogActions className={classes.buttonBox}>
                        <Button
                            color={'primary'}
                            variant={'contained'}
                            onClick={() => this.onClickEdit()}
                            className={classes.button}
                        >
                            New location
                        </Button>
                        <Button
                            color={'secondary'}
                            variant={'contained'}
                            onClick={this.props.onClose}
                            className={classes.button}
                        >
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </>
        )
    }
}

export default withStyles(useStyles)(LocationsDialog)
