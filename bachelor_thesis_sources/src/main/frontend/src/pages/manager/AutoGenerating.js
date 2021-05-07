import React from "react";
import {withStyles} from "@material-ui/core/styles";
import CommissionParameters from "../../components/CommissionParameters";
import {Paper} from "@material-ui/core";
import {handleResponseError, post} from "../../utils/request"
import CommissionCard from "../../components/commission/CommissionCard";
import Pagination from "@material-ui/lab/Pagination";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Container from "@material-ui/core/Container";

const useStyles = theme => ({
    cardContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    typography: {
        alignSelf: 'center',
        textAlign: 'center',
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
    flex: {
        display: 'flex',
    },
});

const InitialState = {
    commissions: [],

    currentPage: 0,
    size: 100, //count items in current page
    totalItemsCount: null,
    totalPagesCount: null,

    pageSizes: [10, 25, 50, 100],
    disabledGenerateButton: false,
}

class AutoGeneratingPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ...InitialState,
        }
    }

    componentDidMount() {
        this.fetchCommissions()
    }

    fetchCommissions(paginationChanged) {

        const pageTO = {
            page: paginationChanged ? this.state.currentPage - 1 : this.state.currentPage,
            size: this.state.size,
            pattern: ' ',
        }

        post(`/commission/draft/page`, pageTO)
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

    onGenerationComplete = (resp) => {
        this.fetchCommissions(false)
    }

    onClickCreate = (commission) => {
        //todo make disable, after click

        console.log("onClickCreate", commission)
        post(`/commission/${commission.id}/toEditState`)
            .then(res => this.setState({
                commissions: res.data
            }))
            .catch(err => handleResponseError(err))
    }

    onChangePagination = (event, value) => {
        this.setState({
            currentPage: value,
        }, () => this.fetchCommissions(true))
    }

    onChangePageSize = (e) => {
        this.setState({
                size: e.target.value,
                currentPage: 0,
            }, () => this.fetchCommissions(false)
        )
    }

    render() {
        const {classes} = this.props
        const comm = this.state.commissions &&
            this.state.commissions.map((commission, k) => {
                return (
                    <CommissionCard
                        key={k}
                        commission={commission}
                        onEditClick={this.onClickCreate}
                    />
                )
            })
        return (
            <Container className={'pageContent'}>
                <h1>
                    AutoGenerating Page
                </h1>
                <CommissionParameters
                    onComplete={this.onGenerationComplete}
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
                <Paper className={classes.cardContainer}>
                    {comm}
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

export default withStyles(useStyles)(AutoGeneratingPage)
