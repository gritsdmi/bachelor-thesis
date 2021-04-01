import React from "react";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";
import {withStyles} from "@material-ui/core/styles";
import SearchResultPanel from "../SearchResultPanel";
import SearchBox from "../SearchBox";
import {get, post} from "../../utils/request";

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
    }
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
        console.log("TeacherRecommendDialog DID MOUNT")
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
        get(`/teacher/date/${this.props.date}`)
            .then(response => {
                this.setState({
                    teachers: response.data,
                }, () => console.log(response.data))
            })
            .catch(error => console.log(error))
    }

    onClickRecommendTeacher = (teacher) => {
        //remove current teacher from commission and chosen Teacher to the commission
        // /add/{commId}/{teacherId}
        console.log(this.props)
        post(`/commission/replace/${this.props.commission.id}/${this.props.currentTeacherId}`, teacher)
            .then(res => console.log(res))
            .catch(err => console.log(err))

        console.log("onClickRecommendTeacher", teacher)

    }

    render() {
        return (
            <Dialog
                open={this.props.open}
                onClose={this.props.onClose}
                fullWidth
            >

                <DialogTitle>
                    TeacherRecommendDialog
                </DialogTitle>
                <DialogContent>
                    <SearchBox/>

                    <SearchResultPanel
                        data={this.state.teachers}
                        onClick={this.onClickRecommendTeacher}
                        rec={true}
                    />
                </DialogContent>
                <DialogActions>

                </DialogActions>
            </Dialog>
        );
    }

}

export default withStyles(useStyles)(TeacherRecommendDialog)