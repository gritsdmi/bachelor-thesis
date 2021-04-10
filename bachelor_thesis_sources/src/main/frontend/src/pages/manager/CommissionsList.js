import React from "react";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import {Paper} from "@material-ui/core";

import {del, post} from "../../utils/request"
import Button from "@material-ui/core/Button";
import CommissionCard from "../../components/commission/CommissionCard";
import {withStyles} from "@material-ui/core/styles";
import Pagination from '@material-ui/lab/Pagination';

import CommissionSearchBox from "../../components/commission/CommissionSearchBox";
import CommissionInfoDialog from "../../components/commission/CommissionInfoDialog";
import CommissionListItem from "../../components/CommissionListItem";

const useStyles = theme => ({
    cardContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    }
});

const InitialState = {
    commissions: [],
    commissionInfoDialogOpen: false,
    currentCommission: null,
    cardView: true,

    currentPage: 1,
    size: 3, //count items in current page
    totalItemsCount: null,
    totalPagesCount: null,

    pageSizes: [2, 10, 25, 50, 100],

}

class CommissionsListPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ...InitialState,
        }
    }

    componentDidMount() {
        // get("/commission/notDraft").then((response) => {
        //     this.setState({commissions: response.data}
        //         , () => console.log(this.state.commissions))
        // })
        this.fetchCommissions()
    }

    fetchCommissions() {

        const pageTO = {
            page: this.state.currentPage - 1,
            size: this.state.size,
            title: ' ',
        }

        post(`/commission/page`, pageTO)
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
            .catch(err => console.log(err))
    }

    onChangePagination = (event, value) => {
        console.log("onChangePagination", value)
        this.setState({
            currentPage: value,
        }, () => this.fetchCommissions())
    }

    onClearButtonClick = () => {
        del("/commission").then((response) => {
            this.setState({commissions: response.data})
        })
    }

    onCommissionInfoButtonClick = (commission) => {
        console.log("onCommissionInfoButtonClick", commission.teachers)
        this.setState({
            commissionInfoDialogOpen: true,
            currentCommission: commission,
        })
    }

    updateCommission = (commission) => {
        console.log("updateCommission", commission)
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

    onCommissionEditButtonClick = (commission) => {
        // redirect to manual commission
        console.log("onCommissionEditButtonClick", commission)
        // return <Redirect to="/manual/"/> // do not work
        this.props.history.push({
            pathname: "/manual",
            commission: commission,
        });

    }

    render() {
        const {classes} = this.props
        const cardView = this.state.cardView

        const cardsList = this.state.commissions
            && this.state.commissions.map((commission, idx) => {
                return (
                    this.state.cardView ?
                        <CommissionCard
                            key={idx}
                            commission={commission}
                            onInfoClick={this.onCommissionInfoButtonClick}
                            onEditClick={this.onCommissionEditButtonClick}
                            onClose={this.onCommissionInfoClose}
                        /> :
                        <CommissionListItem
                            key={idx}
                            commission={commission}
                            onClickInfoButton={this.onCommissionInfoButtonClick}
                        />
                )
            })

        return (
            <>
                <CommissionInfoDialog
                    open={this.state.commissionInfoDialogOpen}
                    commission={this.state.currentCommission}
                    onEditClick={this.onCommissionEditButtonClick}
                    onClose={this.onCommissionInfoClose}
                    updComm={this.updateCommission}
                />

                <Container>
                    <Box>
                        <h1>
                            Commissions List Page
                        </h1>
                    </Box>
                    <Box>
                        <Button onClick={this.onClearButtonClick}>Clear commissions</Button>
                    </Box>
                    <CommissionSearchBox>

                    </CommissionSearchBox>
                    <Pagination
                        count={this.state.totalPagesCount}
                        page={this.state.currentPage + 1}
                        siblingCount={1}
                        boundaryCount={1}
                        shape="rounded"
                        onChange={this.onChangePagination}
                    />
                    <Paper className={classes.cardContainer}>
                        {cardsList}
                    </Paper>
                    <Pagination
                        count={this.state.totalPagesCount}
                        page={this.state.currentPage + 1}
                        siblingCount={1}
                        boundaryCount={1}
                        shape="rounded"
                        onChange={this.onChangePagination}
                    />
                </Container>
            </>
        )
    }
}

export default withStyles(useStyles)(CommissionsListPage)
