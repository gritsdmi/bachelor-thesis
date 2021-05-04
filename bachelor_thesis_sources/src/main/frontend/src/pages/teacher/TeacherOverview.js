import React from "react";
import {withStyles} from "@material-ui/core/styles";
import TeacherEventsFilter from "../../components/teacher/TeacherEventsFilter";
import {get, getUserFromLS, handleResponseError, post} from "../../utils/request";
import {Paper, Typography} from "@material-ui/core";
import CommissionListItem from "../../components/CommissionListItem";
import TeacherCommissionInfoDialog from "../../components/teacher/TeacherCommissionInfoDialog";
import Pagination from "@material-ui/lab/Pagination";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import {enumerateDaysBetweenDates} from "../../utils/constants";

const useStyles = theme => ({
    cardContainer: {
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(2),
    },
    item: {
        margin: theme.spacing(1),
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
    },
    paginationBox: {
        margin: theme.spacing(1),
        display: 'flex',
        justifyContent: 'flex-end',
    },
    pageSelect: {
        width: '70px',
        marginLeft: '10px',
    },
    menuSelect: {
        paddingLeft: '10px',
    },
    typography: {
        alignSelf: 'center',
    },
    flex: {
        display: 'flex',
    },

});
const InitialState = {
    degrees: [],
    commissions: [],
    teacher: null,
    comStates: ['ALL', 'EDITABLE', 'APPROVED'],
    semesters: [],

    commissionInfoDialogOpen: false,
    currentCommission: null,
    selectedDegree: '',
    selectedState: 'ALL',
    selectedSemester: '',
    bySemester: 'sem',

    selectedDateFrom: new Date(),
    selectedDateTo: new Date(),

    currentPage: 0,
    size: 10, //count items in current page
    totalItemsCount: null,
    totalPagesCount: null,

    pageSizes: [10, 25, 50, 100],

}

class TeacherOverview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...InitialState,
            teacherId: getUserFromLS().userId,
        }
        console.log(getUserFromLS())
    }

    componentDidMount() {
        this.fetchTeacher()
        this.fetchDegrees(true)
    }

    fetchTeacher() {
        get(`/user/teacher/${this.state.teacherId}`)
            .then(response => {
                this.setState({
                        teacher: response.data,
                    }
                )
            })
            .catch(err => handleResponseError(err))
    }

    fetchDegrees(didMount) {
        get("/exam/degrees")
            .then(response => {
                this.setState({
                        degrees: response.data,
                        selectedDegree: response.data[0],
                    }
                    , () => {
                        if (didMount) {
                            this.fetchSemesters()
                        } else {
                            this.fetchCommissions(false)
                        }
                    }
                )
            })
            .catch(err => handleResponseError(err))
    }

    fetchSemesters() {
        get('/exam/semesters')
            .then(res => this.setState({
                    semesters: res.data,
                    selectedSemester: res.data[res.data.length - 1],
                }
                , () => {
                    this.fetchCommissions(false)
                }
            ))
            .catch(err => handleResponseError(err))
    }

    fetchCommissions(paginationChanged) {

        let filterProps = {
            selectedDegree: this.state.selectedDegree,
            selectedField: null,
            selectedDatesRange: enumerateDaysBetweenDates(this.state.selectedDateFrom, this.state.selectedDateTo),
            selectedState: null,
            selectedSemester: this.state.bySemester === 'sem' ? this.state.selectedSemester : null,
        }
        // filterProps.selectedState = null

        const pageTO = {
            page: paginationChanged ? this.state.currentPage - 1 : this.state.currentPage,
            size: this.state.size,
            pattern: ' ',
            props: {...filterProps},
        }
        post(`/commission/byTeacher/${this.state.teacherId}/page`, pageTO)
            .then(res => {
                this.setState({
                        commissions: res.data.list,
                        currentPage: res.data.currentPage,
                        totalItemsCount: res.data.totalItemsCount,
                        totalPagesCount: res.data.totalPagesCount,
                    }
                )
            })
            .catch(err => handleResponseError(err))
    }

    onChangeSelect = (evt) => {
        this.setState({
            [evt.target.name]: evt.target.value,
        }, () => this.fetchCommissions(false))
    }

    handleChangeDateFrom = (e) => {
        this.setState({
                selectedDateFrom: e,
            }
            , () => this.fetchCommissions(false)
        )
    }

    handleChangeDateTo = (e) => {
        this.setState({
                selectedDateTo: e,
            }
            , () => this.fetchCommissions(false)
        )
    }

    onClickInfoButton = comm => {
        this.setState({
            currentCommission: comm,
            commissionInfoDialogOpen: true,
        })
    }

    onCloseCommissionInfoDialog = () => {

        this.setState({
            currentCommission: null,
            commissionInfoDialogOpen: false,
        })
    }

    onChangePagination = (event, value) => {
        this.setState({
            currentPage: value,
        }, () => this.fetchCommissions(true))
    }

    onChangePageSize = (e) => {
        this.setState({
                size: e.target.value,
            }
            , () => this.fetchCommissions(false))
    }

    onChangeRadio = (e) => {
        this.setState({
            [e.target.name]: e.target.value,
        }, () => {
            this.fetchCommissions(false)
        })
    }

    render() {
        const comList = this.state.commissions.map((comm, idx) => {
            return (
                <CommissionListItem
                    key={idx}
                    commission={comm}
                    onClickInfoButton={this.onClickInfoButton}
                />
            )
        })
        const {classes} = this.props

        return (
            <Container>
                <TeacherCommissionInfoDialog
                    open={this.state.commissionInfoDialogOpen}
                    onClose={this.onCloseCommissionInfoDialog}
                    commission={this.state.currentCommission}
                    currentTeacherId={this.state.teacherId}
                />
                <h1>
                    Teacher Events
                </h1>
                <TeacherEventsFilter
                    comStates={this.state.comStates}
                    degrees={this.state.degrees}
                    selectedState={this.state.selectedState}
                    selectedDegree={this.state.selectedDegree}
                    onChangeSelect={this.onChangeSelect}
                    selectedDateFrom={this.state.selectedDateFrom}
                    selectedDateTo={this.state.selectedDateTo}
                    handleChangeDateFrom={this.handleChangeDateFrom}
                    handleChangeDateTo={this.handleChangeDateTo}
                    bySemester={this.state.bySemester}
                    semesters={this.state.semesters}
                    selectedSemester={this.state.selectedSemester}
                    onChangeRadio={this.onChangeRadio}
                />
                <Box className={classes.paginationBox}>
                    <Pagination
                        count={this.state.totalPagesCount}
                        page={this.state.currentPage + 1}
                        siblingCount={1}
                        boundaryCount={1}
                        shape="rounded"
                        onChange={this.onChangePagination}
                    />
                    <Box className={classes.flex}>
                        <Typography className={classes.typography}>Items per page: </Typography>
                        <TextField
                            select
                            value={this.state.size}
                            onChange={this.onChangePageSize}
                            className={classes.pageSelect}
                        >
                            {this.state.pageSizes.map((size, idx) => (
                                <MenuItem key={idx} value={size}>
                                    {size}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                </Box>
                <Paper
                    className={classes.cardContainer}
                >
                    {comList}
                </Paper>
                <Box className={classes.paginationBox}>
                    <Pagination
                        count={this.state.totalPagesCount}
                        page={this.state.currentPage + 1}
                        siblingCount={1}
                        boundaryCount={1}
                        shape="rounded"
                        onChange={this.onChangePagination}
                    />
                    <Box className={classes.flex}>
                        <Typography className={classes.typography}>Items per page: </Typography>
                        <TextField
                            select
                            value={this.state.size}
                            onChange={this.onChangePageSize}
                            className={classes.pageSelect}
                        >
                            {this.state.pageSizes.map((size, idx) => (
                                <MenuItem key={idx} value={size}>
                                    {size}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                </Box>
            </Container>
        )
    }
}

export default withStyles(useStyles)(TeacherOverview)
