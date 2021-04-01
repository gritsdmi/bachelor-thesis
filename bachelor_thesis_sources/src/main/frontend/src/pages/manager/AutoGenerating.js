import React from "react";
import {withStyles} from "@material-ui/core/styles";
import CommissionParameters from "../../components/CommissionParameters";
import {Paper} from "@material-ui/core";
import {get, post} from "../../utils/request"
import CommissionCard from "../../components/commission/CommissionCard";


const useStyles = theme => ({
    cardContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
    }
});

class AutoGeneratingPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            commissions: [],
        }
    }

    componentDidMount() {
        console.log("AutoGeneratingPage DID MOUNT")
        get("/commission/draft")
            .then(res => {
                this.setState({
                    commissions: res.data,
                })
            })
    }

    onGenerationComplete = (resp) => {
        console.log("on generationComplete", resp)
        let t = resp.data;
        // get("/commission/draft")
        //     .then(res => t = res.data)

        // console.log(t)
        this.setState({
            commissions: t
        }, () => console.log(this.state.commissions))
        // console.log(this.state)

    }

    onClickCreate = (commission) => {
        //todo make disable, after click

        const payload = {
            commission: commission,
        }
        console.log("onClickCreate", commission)
        post(`/commission/${commission.id}/nextState`, commission)
            .then(response => console.log(response.data))
    }


    render() {
        const {classes} = this.props
        const comm = this.state.commissions &&
            this.state.commissions.map((commission, k) => {
                return (
                    <CommissionCard
                        key={k}
                        commission={commission}
                        // onInfoClick={this.onCommissionInfoButtonClick}
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
                <Paper className={classes.cardContainer}>
                    {comm}
                </Paper>

            </>
        )
    }
}

export default withStyles(useStyles)(AutoGeneratingPage);