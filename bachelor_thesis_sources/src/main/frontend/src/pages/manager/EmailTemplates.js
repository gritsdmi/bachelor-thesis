import React from "react";
import {withStyles} from "@material-ui/core/styles";
import EmailListItem from "../../components/email/EmailListItem";
import {get, handleResponseError} from "../../utils/request";
import {ListItem, Paper, Snackbar} from "@material-ui/core";
import EmailTemplateEditDialog from "../../components/email/EmailTemplateEditDialog";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import Container from "@material-ui/core/Container";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Box from "@material-ui/core/Box";

const useStyles = theme => ({


});

const InitialState = {
    templates: [],
    templateDialogOpen: false,
    chosenTemplate: null,
    snackOpen: false,
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
            }))
            .catch(err => handleResponseError(err))
    }

    onClickEditTemplate = template => () => {

        this.setState({
            templateDialogOpen: true,
            chosenTemplateId: template.id,
        })
    }

    onCloseTemplateDialog = (updated) => {
        this.setState({
            templateDialogOpen: false,
            chosenTemplateId: null,
        }, () => {
            if (updated) {
                this.fetchTemplates()
                this.setState({snackOpen: true})
            }
        })
    }

    render() {
        const {classes} = this.props
        return (
            <Container className={'pageContent'}>
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={this.state.snackOpen}
                    autoHideDuration={4000}
                    onClose={() => this.setState({snackOpen: false})}
                    message="Email template saved"
                    action={
                        <React.Fragment>
                            <IconButton size="small" aria-label="close" color="inherit"
                                        onClick={() => this.setState({snackOpen: false})}
                            >
                                <CloseIcon fontSize="small"/>
                            </IconButton>
                        </React.Fragment>
                    }
                />
                <EmailTemplateEditDialog
                    open={this.state.templateDialogOpen}
                    onClose={this.onCloseTemplateDialog}
                    templateId={this.state.chosenTemplateId}
                />
                <h1>Email Templates</h1>
                <Paper>
                    <Box className={'titleBack'}>
                        <Typography className={'title'} variant={'h6'}>Templates</Typography>
                    </Box>
                    <List>
                        {this.state.templates.map((template, idx) => {
                            return (
                                <ListItem key={idx}>
                                    <EmailListItem
                                        template={template}
                                        onEditClick={this.onClickEditTemplate}
                                    />
                                </ListItem>
                            )
                        })}
                    </List>
                </Paper>
            </Container>
        )
    }
}

export default withStyles(useStyles)(EmailTemplates)
