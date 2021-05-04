import React from "react";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import SearchResultPanel from "../SearchResultPanel";
import SearchBox from "../SearchBox";
import {get, handleResponseError, post} from "../../utils/request";
import Button from "@material-ui/core/Button";

const useStyles = theme => ({
    item: {
        paddingLeft: theme.spacing(2),
        paddingTop: theme.spacing(1.5),
        paddingBottom: theme.spacing(1.5),
        paddingRight: theme.spacing(2),
    },
    cell: {
        border: 'none',
    },
    firstCol: {
        width: '150px',
        border: 'none',
    },
    inputCell: {
        maxWidth: '50px',
        border: 'none',
    },
    dialog: {
        maxHeight: '80vh',
    },
});

const InitialState = {
    teachers: [],
    commission: null,
}

class TeacherRecommendDialog extends React.Component {
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
            if (this.props.open) {
                this.fetchTeacher()
            }
        }
    }

    //fetch teachers who is available on this day
    fetchTeacher() {
        get(`/user/teacher/date/${this.props.date}`)
            .then(response => {
                this.setState({
                    teachers: response.data,
                }, () => console.log(response.data))
            })
            .catch(err => handleResponseError(err))
    }

    onClickRecommendTeacher = (teacherToRecommend) => {
        //remove current teacher from commission and chosen Teacher to the commission
        // /add/{commId}/{teacherId}
        console.log(this.props)
        post(`/commission/replace/${this.props.commission.id}/${this.props.currentTeacherId}`, teacherToRecommend)
            .then(res => {
                console.log(res)
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
                fullWidth
                className={classes.dialog}
            >

                <DialogTitle>
                    TeacherRecommendDialog
                </DialogTitle>
                <DialogContent dividers>
                    <SearchBox/>
                    <SearchResultPanel
                        data={this.state.teachers}
                        onClick={this.onClickRecommendTeacher}
                        rec={true}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        color={'primary'}
                        variant={'contained'}
                        onClick={this.props.onClose}
                    >Cancel</Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withStyles(useStyles)(TeacherRecommendDialog)
