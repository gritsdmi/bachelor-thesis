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
        get("/commission/draft")
            .then(res => {
                this.setState({
                    commissions: res.data,
                }, () => console.log(res.data))
            })
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
                <Paper className={classes.cardContainer}>
                    {comm}
                </Paper>

            </>
        )
    }
}

export default withStyles(useStyles)(AutoGeneratingPage)
