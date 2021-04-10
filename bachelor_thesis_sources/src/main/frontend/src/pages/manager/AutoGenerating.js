import React from "react";
import {withStyles} from "@material-ui/core/styles";
import CommissionParameters from "../../components/CommissionParameters";
import {Paper} from "@material-ui/core";
import {post} from "../../utils/request"
import CommissionCard from "../../components/commission/CommissionCard";
import Pagination from "@material-ui/lab/Pagination";

const useStyles = theme => ({
    cardContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
    }
});

const InitialState = {
    commissions: [],

    currentPage: 1,
    size: 400, //count items in current page
    totalItemsCount: null,
    totalPagesCount: null,

    pageSizes: [2, 10, 25, 50, 100],
}

class AutoGeneratingPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ...InitialState,
        }
    }

    componentDidMount() {
        // get("/commission/draft")
        //     .then(res => {
        //         this.setState({
        //             // commissions: res.data,
        //         }, () => console.log(res.data))
        //     })

        this.fetchCommissions()
    }

    fetchCommissions() {

        const pageTO = {
            page: this.state.currentPage - 1,
            size: this.state.size,
            title: ' ',
        }

        post(`/commission/draft/page`, pageTO)
            .then(res => {
                this.setState({
                        commissions: res.data.list,
                        currentPage: res.data.currentPage,
                        totalItemsCount: res.data.totalItemsCount,
                        totalPagesCount: res.data.totalPagesCount,
                    }
                    // , () => console.log(res.data)
                )
            })
            .catch(err => console.log(err))
    }

    onGenerationComplete = (resp) => {
        console.log("on generationComplete", resp)
        this.setState({
            commissions: resp.data
        }, () => console.log(this.state.commissions))

    }

    onClickCreate = (commission) => {
        //todo make disable, after click

        console.log("onClickCreate", commission)
        post(`/commission/${commission.id}/toEditState`)
            .then(res => this.setState({
                commissions: res.data
            }))
    }

    onChangePagination = (event, value) => {
        this.setState({
            currentPage: value,
        }, () => this.fetchCommissions())
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
                        // onClose={this.onCommissionInfoClose}
                    />
                )
            })
        return (
            <>
                <h1>
                    AutoGenerating Page
                </h1>
                <CommissionParameters
                    onComplete={this.onGenerationComplete}
                />

                {/*<CommissionProps*/}
                {/*    onComplete={this.onGenerationComplete}*/}
                {/*/>*/}
                <Pagination
                    count={this.state.totalPagesCount}
                    page={this.state.currentPage + 1}
                    siblingCount={1}
                    boundaryCount={1}
                    shape="rounded"
                    onChange={this.onChangePagination}
                />
                <Paper className={classes.cardContainer}>
                    {comm}
                </Paper>
                <Pagination
                    count={this.state.totalPagesCount}
                    page={this.state.currentPage + 1}
                    siblingCount={1}
                    boundaryCount={1}
                    shape="rounded"
                    onChange={this.onChangePagination}
                />

            </>
        )
    }
}

export default withStyles(useStyles)(AutoGeneratingPage)
