import React from "react";
import {Collapse, Divider, Grid, ListItem, ListItemIcon, ListItemText, MenuItem, Select,} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {withStyles} from "@material-ui/core/styles";
import {get, post} from "../utils/request"
import List from "@material-ui/core/List";
import {DatePicker, MuiPickersUtilsProvider,} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import format from 'date-fns/format';


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

const dateFormat = 'dd.MM.yyyy'

class CreatingParametersField extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            degrees: [],
            locations: [],
            commissions: [],

            selectedDegree: '',
            selectedLocation: '',
            selectedDate: format(new Date(), dateFormat),

            paperOpen: false,
            collapsesOpen: [],
        }

    }

    componentDidMount() {
        console.log("CreatingParametersField DID MOUNT")
        get("/exam/degrees")
            .then(response => {
                this.setState({
                    degrees: response.data,
                }, () => console.log(response.data))
            })
            .catch(error => console.log(error))
        // get("/location/map")
        //     .then(response => {
        //         this.setState({
        //             // locations: this.test(response.data),
        //             locations: response.data,
        //         })
        //     })
        //     .catch(error => console.log(error))
        get("/location")
            .then(response => {
                this.setState({
                    // locations: this.test(response.data),
                    locations: response.data,
                }, () => console.log(this.state.locations))
            })
            .catch(error => console.log(error))

    }

    test(loc) {
        let test = []
        for (let [key, value] of Object.entries(loc)) {
            let obj = {}
            obj[key] = value;
            test.push(obj)
        }
        console.log(test)
        return test
    }

    handlePaper = () => {
        console.log("handle paper")
        this.setState({
            paperOpen: !this.state.paperOpen,
        }, () => console.log(this.state.paperOpen))
    }

    handlePaperItem = item => () => {
        console.log("handle item", item)
        let obj = {
            item: true,
        }
    }

    handleChangeDate = (event) => {
        //dd.MM.yyyy
        console.log("handleChangeDate", format(event, dateFormat))
        this.setState({
            selectedDate: format(event, dateFormat),
        })
    }

    handleChangeDegree = (event) => {
        console.log("handleChangeDegree")
        this.setState({
            selectedDegree: event.target.value,
        })
    }

    handleChangeLocation = (event) => {
        console.log("handleChangeLocation")
        this.setState({
            selectedLocation: event.target.value,
        })
    }

    onClickGenerateButton = () => {

        //creationTO object
        const payload = {
            date: this.state.selectedDate,
            degree: this.state.selectedDegree,
            locationId: this.state.selectedLocation.id,
        }
        console.log("onClickGenerateButton", payload)

        post("/util/gen/2", payload)
            // .then(response => console.log(response))
            .then(response => this.props.onComplete(response))

    }


    render() {
        if (!this.state.locations || !this.state.degrees) {
            return <></>
        }

        const {classes} = this.props

        return (
            <div>
                <Grid container>
                    <Grid
                        item
                        xs={1}
                        className={classes.item}
                    >
                        <Select
                            fullWidth
                            onChange={this.handleChangeDegree}
                        >
                            {
                                this.state.degrees.map((degree, idx) => {
                                    return (
                                        <MenuItem
                                            key={idx}
                                            value={degree}
                                        >{degree}
                                        </MenuItem>
                                    )
                                })
                            }
                        </Select>
                    </Grid>
                    <Grid
                        className={classes.item}
                        item
                    >
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <DatePicker
                                //todo css
                                disableToolbar
                                // variant="inline"
                                format="MM.dd.yyyy"//poebat мб это изза разных версий пикера и форматера

                                autoOk={true}
                                // placeholderText={"Enter date"}
                                // margin="normal"
                                id="date-picker-inline"
                                // label="Date picker inline"
                                value={this.state.selectedDate}
                                onChange={this.handleChangeDate}
                                // KeyboardButtonProps={{
                                //     'aria-label': 'change date',
                                // }}
                            />
                        </MuiPickersUtilsProvider>
                    </Grid>
                    <Grid
                        item
                        xs={2}
                        className={classes.item}
                    >
                        <Select
                            fullWidth
                            onChange={this.handleChangeLocation}
                        >
                            {
                                this.state.locations.map((location, idx) => {
                                    return (
                                        <MenuItem
                                            key={idx}
                                            value={location}
                                        >{location.building + ":" + location.classroom}
                                        </MenuItem>
                                    )
                                })
                            }
                        </Select>
                    </Grid>
                    <Grid
                        item
                        className={classes.item}
                    >
                        <Button
                            onClick={this.onClickGenerateButton}
                        >
                            Generate 2
                        </Button>
                    </Grid>
                </Grid>

                {/*<Paper>*/}
                {/*    <Typography*/}
                {/*        onClick={this.handlePaper}*/}
                {/*    >*/}
                {/*        text*/}
                {/*    </Typography>*/}
                {/*    <Collapse*/}
                {/*        in={this.state.paperOpen}*/}
                {/*    >*/}
                {/*        <List>*/}
                {/*            <ListItem*/}
                {/*                key={0}*/}
                {/*                onClick={this.handlePaperItem(0)}*/}
                {/*            >*/}
                {/*                <Typography*/}
                {/*                    // onClick={this.handlePaper}*/}
                {/*                >*/}
                {/*                    kn*/}
                {/*                </Typography>*/}
                {/*                <Collapse*/}
                {/*                    in={this.state.collapsesOpen[0]}*/}
                {/*                >*/}
                {/*                    <List>*/}
                {/*                        <ListItem*/}
                {/*                            key={0}*/}
                {/*                            onClick={this.handlePaperItem(0)}*/}
                {/*                        >*/}
                {/*                            <Typography*/}
                {/*                                // onClick={this.handlePaper}*/}
                {/*                            >*/}
                {/*                                kn*/}
                {/*                            </Typography>*/}
                {/*                        </ListItem>*/}
                {/*                        <ListItem*/}
                {/*                            key={1}*/}
                {/*                            onClick={this.handlePaperItem(1)}*/}
                {/*                        >*/}
                {/*                            <Typography*/}
                {/*                                // onClick={this.handlePaper}*/}
                {/*                            >*/}
                {/*                                t2*/}
                {/*                            </Typography>*/}
                {/*                        </ListItem>*/}
                {/*                    </List>*/}
                {/*                </Collapse>*/}
                {/*            </ListItem>*/}
                {/*            <ListItem*/}
                {/*                key={1}*/}
                {/*                onClick={this.handlePaperItem(1)}*/}
                {/*            >*/}
                {/*                <Typography*/}
                {/*                    // onClick={this.handlePaper}*/}
                {/*                >*/}
                {/*                    t2*/}
                {/*                </Typography>*/}
                {/*            </ListItem>*/}
                {/*        </List>*/}
                {/*    </Collapse>*/}
                {/*</Paper>*/}
            </div>
        );
    }
}

class CategoriesResults extends React.Component {
    render() {
        const docs = data.documents;  //this coming from a json file, please see below for the sample json
        return (
            <div>
                <List component='nav' aria-labelledby='nested-list-subheader'>
                    {docs.map(doc => {
                        return (
                            <CustomizedListItem key={doc.id} doc={doc}/>
                        );
                    })}
                </List>
            </div>
        );
    }
}

class CustomizedListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            inOpen: false,
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        console.log("Handle Clicked....");
        this.setState(prevState => ({
            open: !prevState.open
        }));
    }

    handleClick2(data) {
        console.log("Handle Clicked.22222", data);
    }

    render() {
        const {doc} = this.props;
        return (
            <div>
                <ListItem button key={doc.Id} onClick={this.handleClick}>
                    <ListItemText primary={doc.Name}/>
                    {/* {this.state.open ? <ExpandLess /> : <ExpandMore />} */}
                </ListItem>
                <Collapse
                    key={doc.Sheets.Id}
                    in={this.state.open}
                    timeout='auto'
                    unmountOnExit
                >
                    <List component='li' disablePadding key={doc.Id}>
                        {/* <Collapse
          key={doc.Sheets.Id}
          in={this.state.inOpen}
          timeout='auto'
          unmountOnExit
          > */}
                        {doc.Sheets.map(sheet => {
                            return (
                                <ListItem onClick={() => this.handleClick2(sheet)} button key={sheet.Id}>
                                    <ListItemIcon/>
                                    <ListItemText key={sheet.Id} primary={sheet.Title}/>
                                </ListItem>
                            );
                        })}
                        {/* </Collapse> */}
                    </List>

                </Collapse>
                <Divider/>
            </div>
        )
    }
}

const data = {
    "documents": [
        {
            "Id": 1,
            "Name": "Category 1",
            "Sheets": [
                {
                    "Id": 1,
                    "Title": "Title1 ",
                    "data": [1, 2, 3]
                },
                {
                    "Id": 2,
                    "Title": "Title 2",
                    "data": [1, 2, 3]
                },
                {
                    "Id": 3,
                    "Title": "Title 3",
                    "data": [1, 2, 3]
                }
            ]
        },
        // {
        //   "Id": 1,
        //   "Name": "Category 2",
        //   "Sheets": [
        //     {
        //       "Id": 1,
        //       "Title": "Title1 "
        //     },
        //     {
        //       "Id": 2,
        //       "Title": "Title 2"
        //     },
        //     {
        //       "Id": 3,
        //       "Title": "Title 3"
        //     }
        //   ]
        // }
    ]
}

export default withStyles(useStyles)(CreatingParametersField);