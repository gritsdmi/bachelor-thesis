import React from "react";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import {Paper} from "@material-ui/core";

import {del, get} from "../../utils/request"
import Button from "@material-ui/core/Button";
import CommissionCard from "../../components/commission/CommissionCard";
import {withStyles} from "@material-ui/core/styles";

import CommissionSearchBox from "../../components/commission/CommissionSearchBox";
import CommissionInfoDialog from "../../components/commission/CommissionInfoDialog";

const useStyles = theme => ({
    cardContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    }
});

class CommissionsListPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            commissions: [],
            commissionInfoDialogOpen: false,
            currentCommission: null,
            cardView: true,
        }
    }

    componentDidMount() {
        get("/commission/notDraft").then((response) => {
            this.setState({commissions: response.data}
                , () => console.log(this.state.commissions))
        })
    }

    componentDidUpdate(prevProps) {
        console.log("componentDidUpdate");
    }

    // onGenerateButtonClick = () => {
    //     get("/util/gen/2").then((response) => {
    //         this.setState({commissions: response.data})
    //     })
    // }

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
        //todo redirect to manual commission
        console.log("onCommissionEditButtonClick", commission)
        // return <Redirect to="/manual/"/> //todo do not work
        // this.props.history.push('/manual'); //todo but add props
        this.props.history.push({
            pathname: "/manual",
            commission: commission,
        });

    }

    render() {
        const {classes} = this.props

        const cardsList = this.state.commissions
            && this.state.commissions.map((commission, k) => {
                return (
                    <CommissionCard
                        key={k}
                        commission={commission}
                        onInfoClick={this.onCommissionInfoButtonClick}
                        onEditClick={this.onCommissionEditButtonClick}
                        onClose={this.onCommissionInfoClose}
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
                        {/*<Button onClick={this.onGenerateButtonClick}>Generate 2</Button>*/}
                        <Button onClick={this.onClearButtonClick}>Clear commissions</Button>
                    </Box>
                    <CommissionSearchBox>

                    </CommissionSearchBox>
                    <Paper className={classes.cardContainer}>
                        {cardsList}
                    </Paper>
                </Container>
            </>


        )
    }

}

export default withStyles(useStyles)(CommissionsListPage);