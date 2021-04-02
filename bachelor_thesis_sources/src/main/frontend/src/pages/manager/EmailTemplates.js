import React from "react";
import {withStyles} from "@material-ui/core/styles";
import SearchBox from "../../components/SearchBox";
import Button from "@material-ui/core/Button";
import EmailListItem from "../../components/email/EmailListItem";
import {get} from "../../utils/request";
import {Paper} from "@material-ui/core";
import EmailTemplateEditDialog from "../../components/email/EmailTemplateEditDialog";

const useStyles = theme => ({
    cardContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    item: {
        margin: theme.spacing(1),
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
    }

});

const InitialState = {
    templates: [],
    templateDialogOpen: false,
    chosenTemplate: null,
}

class EmailTemplates extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...InitialState,
        }
    }

    componentDidMount() {
        this.fetchTemplates()
    }

    fetchTemplates() {
        get(`/template`)
            .then(res => this.setState({
                templates: res.data,
            }, () => {
                console.log(this.state.templates)
            }))
            .catch(err => console.log(err))
    }

    onClickEditTemplate = template => () => {
        console.log("onClickEditTemplate", template)

        this.setState({
            templateDialogOpen: true,
            chosenTemplateId: template.id,
        })
        console.log(this.state.chosenTemplate)
    }

    onCloseTemplateDialog = () => {
        console.log(this.state.chosenTemplate)
        this.setState({
            templateDialogOpen: false,
            chosenTemplateId: null,
        })
    }


    render() {
        return (
            <div>
                <EmailTemplateEditDialog
                    open={this.state.templateDialogOpen}
                    onClose={this.onCloseTemplateDialog}
                    templateId={this.state.chosenTemplateId}
                />
                <h1>Email Templates</h1>
                <SearchBox></SearchBox>
                <Button>
                    Create template....
                </Button>
                <Paper>
                    <EmailListItem
                        template={this.state.templates[0]}
                        onEditClick={this.onClickEditTemplate}
                    />
                </Paper>

            </div>
        );
    }

}

export default withStyles(useStyles)(EmailTemplates)
