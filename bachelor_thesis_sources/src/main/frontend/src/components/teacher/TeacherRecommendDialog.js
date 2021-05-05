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
        minHeight: '60vh !important',
        maxHeight: '60vh !important',
    },
});

const InitialState = {
    teachers: [],
    commission: null,
    searchPattern: '',
}

class TeacherRecommendDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...InitialState,
        }
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
                    }
                )
            })
            .catch(err => handleResponseError(err))
    }

    teachersFilteredList() {
        if (this.state.searchPattern === '') {
            return this.state.teachers
        }
        return this.state.teachers.filter(teacher => {
                return (
                    (teacher.name ? teacher.name.toLowerCase().startsWith(this.state.searchPattern.toLowerCase()) : false)
                    || (teacher.surname ? teacher.surname.toLowerCase().startsWith(this.state.searchPattern.toLowerCase()) : false)
                    || (teacher.login ? teacher.login.toLowerCase().startsWith(this.state.searchPattern.toLowerCase()) : false))
            }
        )
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

    handleInputChange = (e) => {
        this.setState({
            searchPattern: e.target.value ? e.target.value : '',
        })
    }

    render() {
        const {classes} = this.props
        const teachersFilteredList = this.teachersFilteredList()

        return (
            <Dialog
                open={this.props.open}
                onClose={this.props.onClose}
                fullWidth
            >
                <DialogTitle>
                    Recommend another teacher
                </DialogTitle>
                <DialogContent
                    dividers
                    className={classes.dialog}
                >
                    <SearchBox
                        onChange={this.handleInputChange}
                    />
                    <SearchResultPanel
                        data={teachersFilteredList}
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
        )
    }
}

export default withStyles(useStyles)(TeacherRecommendDialog)
