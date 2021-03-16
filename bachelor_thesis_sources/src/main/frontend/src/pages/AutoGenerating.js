import React from "react";
import {withStyles} from "@material-ui/core/styles";
import CreatingParametersField from "../components/CreatingParametersField";
import {Paper} from "@material-ui/core";
import {post} from "../utils/request"
import CommissionCard from "../components/commission/CommissionCard";


const useStyles = theme => ({
    cardContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
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
        const payload = {
            commission: commission,
        }
        console.log("onClickCreate", commission)
        post(`/commission/${commission.id}/nextState`, commission)
            .then(response => console.log(response))
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
                <CreatingParametersField
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