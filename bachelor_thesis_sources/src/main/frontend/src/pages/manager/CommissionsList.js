import React from "react";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";

import {del, handleResponseError, post} from "../../utils/request"
import Button from "@material-ui/core/Button";
import CommissionCard from "../../components/commission/CommissionCard";
import {withStyles} from "@material-ui/core/styles";
import Pagination from '@material-ui/lab/Pagination';

import CommissionSearchBox from "../../components/commission/CommissionSearchBox";
import CommissionInfoDialog from "../../components/commission/CommissionInfoDialog";
import CommissionListItem from "../../components/CommissionListItem";
import GenerateCSVDialog from "../../components/GenerateCSVDialog";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import {Typography} from "@material-ui/core";

const useStyles = theme => ({
    cardContainer: {
        display: 'flex',
        padding: theme.spacing(2),
    },
    cardContainerCard: {
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    cardContainerList: {
        flexDirection: 'column',
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
    typography: {
        alignSelf: 'center',
    },
    flex: {
        display: 'flex',
    },
});

const InitialState = {
    commissions: [],
    commissionInfoDialogOpen: false,
    currentCommission: null,
    cardView: false,

    currentPage: 0,
    size: 10, //count items in current page
    totalItemsCount: null,
    totalPagesCount: null,

    pageSizes: [6, 10, 25, 50, 100],

    filterProps: null,
    csvDialogOpen: false,

}

class CommissionsListPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ...InitialState,
        }
        this.state.size = this.state.cardView ? 6 : 10
    }

    componentDidMount() {
    }

    fetchByFilter(filterProps, paginationChanged) {

        let props = filterProps
        props.selectedState = null
        const pageTO = {
            page: paginationChanged ? this.state.currentPage - 1 : this.state.currentPage,
            size: this.state.size,
            pattern: ' ',
            props: {...props},
        }
        console.log(pageTO)

        post(`/commission/filter/page`, pageTO)
            .then(res => {
                this.setState({
                        commissions: res.data.list,
                        currentPage: res.data.currentPage,
                        totalItemsCount: res.data.totalItemsCount,
                        totalPagesCount: res.data.totalPagesCount,
                    }
                    , () => console.log(res.data)
                )
            })
            .catch(err => handleResponseError(err))
    }

    onChangePagination = (event, value) => {
        this.setState({
            currentPage: value,
        }, () => this.fetchByFilter(this.state.filterProps, true))
    }

    onChangeFilter = (filterProps) => {
        this.setState({
            filterProps: filterProps,
        }, () => this.fetchByFilter(filterProps, false))

    }

    onClearButtonClick = () => {
        del("/commission")
            .then((response) => {
                this.setState({commissions: response.data})
            })
    }

    onClickCommissionInfoButton = (commission) => {
        this.setState({
            commissionInfoDialogOpen: true,
            currentCommission: commission,
        })
    }

    updateCommission = (commission) => {
        const comm = this.state.commissions;
        comm[comm.indexOf(this.state.currentCommission)] = commission;
        this.setState({
            commissions: comm,
        })
    }

    onCommissionInfoClose = () => {
        console.log("onCommissionInfoClose")
        //todo refresh edited commisiion
        this.setState({
            commissionInfoDialogOpen: false,
            currentCommission: null,
        })

    }

    onClickCommissionEditButton = (commission) => {
        console.log("onCommissionEditButtonClick", commission)
        this.props.history.push({
            pathname: "/manual",
            commission: commission,
        });
    }

    onClickGenerateCSV = () => {
        this.setState({
            csvDialogOpen: true,
        })
    }

    onCloseCSVDialog = () => {
        this.setState({
            csvDialogOpen: false,
        })
    }

    onChangePageSize = (e) => {
        this.setState({
                size: e.target.value,
            }, () => this.fetchByFilter(this.state.filterProps, false)
        )
    }

    onClickChangeView = () => {
        this.setState({
                cardView: !this.state.cardView,
            }, () => this.fetchByFilter(this.state.filterProps, false)
        )
    }


    render() {
        const {classes} = this.props

        const cardsList = this.state.commissions
            && this.state.commissions.map((commission, idx) => {
                return (
                    this.state.cardView ?
                        <CommissionCard
                            key={idx}
                            commission={commission}
                            onInfoClick={this.onClickCommissionInfoButton}
                            onEditClick={this.onClickCommissionEditButton}
                        /> :
                        <CommissionListItem
                            key={idx}
                            commission={commission}
                            onClickInfoButton={this.onClickCommissionInfoButton}
                            onClickEditButton={this.onClickCommissionEditButton}
                        />
                )
            })

        return (
            <Container className={'pageContent'}>
                <CommissionInfoDialog
                    open={this.state.commissionInfoDialogOpen}
                    commission={this.state.currentCommission}
                    history={this.props.history}
                    onClose={this.onCommissionInfoClose}
                    updComm={this.updateCommission}
                />

                <GenerateCSVDialog
                    open={this.state.csvDialogOpen}
                    onClose={this.onCloseCSVDialog}
                />

                <Box>
                    <h1>
                        Commissions List Page
                    </h1>
                </Box>
                <Box>
                    <Button onClick={this.onClearButtonClick}>Clear commissions</Button>
                </Box>
                <CommissionSearchBox
                    onChange={this.onChangeFilter}
                    onClickGenButton={this.onClickGenerateCSV}
                    onClickChangeView={this.onClickChangeView}
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
                                <MenuItem
                                    key={idx}
                                    value={size}
                                >
                                    {size}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                </Box>

                <Paper
                    className={`${classes.cardContainer} ${this.state.cardView ? classes.cardContainerCard : classes.cardContainerList}`}>
                    {cardsList}
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
                                <MenuItem
                                    key={idx}
                                    value={size}
                                >
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

export default withStyles(useStyles)(CommissionsListPage)
