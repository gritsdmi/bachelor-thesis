import React from "react";
import Container from "@material-ui/core/Container";
import {withStyles} from "@material-ui/core/styles";
import SearchBox from "../components/SearchBox";
import {Grid, ListItem, Paper, Table, TableBody, TableCell, TableRow} from "@material-ui/core";
import CommissionProps from "../components/CommissionProps";
import {get, post} from "../utils/request"
import format from "date-fns/format";
import List from "@material-ui/core/List";
import SearchResultPanel from "../components/SearchResultPanel";
import Button from "@material-ui/core/Button";
import ClearIcon from '@material-ui/icons/Clear';

const dateFormat = 'dd.MM.yyyy'

const InitialState = {
    searchPattern: '',
    teachers: [],
    locations: [],
    degrees: [],

    selectedDegree: '',
    selectedLocation: '',
    selectedDate: format(new Date(), dateFormat),

    commission: null,
}

const useStyles = theme => ({
    cardContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
    }
});

class ManualCreatingPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            ...InitialState,
        }
    }

    componentDidMount() {
        if (!this.props.commission) {
            //click on header's button
            //there are none any graft
            console.log("ManualCreatingPage DID MOUNT props new == true")
            this.fetchLocations(this.state.selectedDate);
            this.fetchDegrees()
        } else {
            //edit some commission

            console.log("ManualCreatingPage DID MOUNT props new == false")
            this.setState({...this.props})

        }
        this.fetchTeachers()

    }

    fetchLocations(dateF) {
        console.log("fetchLocations payload")

        get(`/location/free/${dateF}`)
            .then(response => {
                this.setState({
                    locations: response.data,
                }, () => console.log(this.state.locations))
            })
            .catch(error => console.log(error))
    }

    fetchDegrees() {
        get("/exam/degrees")
            .then(response => {
                this.setState({
                    degrees: response.data,
                }, () => console.log(response.data))
            })
            .catch(error => console.log(error))
    }

    fetchTeachers() {
        // get("/teacher")
        get(`/teacher/date/${this.state.selectedDate}`)
            .then((response) => {
                this.setState({teachers: response.data})
            })
            .catch(err => console.log(err))
    }


    handleSearchBoxInput = (event) => {
        const value = event.target.value;
        if (value && value !== '') {
            console.log("apply filter")
            this.setState({searchPattern: value})
        } else {
            console.log("clear filter")
            this.setState({searchPattern: ''})
        }
    }

    handleChangeDate = (event) => {
        //dd.MM.yyyy
        console.log("handleChangeDate", format(event, dateFormat))
        this.setState({
            selectedDate: format(event, dateFormat),
        }, () => this.fetchLocations(this.state.selectedDate))

    }

    handleChangeLocation = (event) => {
        console.log("handleChangeLocation")
        this.setState({
            selectedLocation: event.target.value,
        })
    }

    handleChangeDegree = (event) => {
        console.log("handleChangeDegree")
        this.setState({
            selectedDegree: event.target.value,
        })
    }

    teachersFilteredList() {

        if (this.state.searchPattern.length < 2) {
            return []
        }

        if (this.state.searchPattern === '') {
            return this.state.teachers
        }

        return this.state.teachers
            && this.state.searchPattern
            && this.state.teachers.filter(teacher => {
                    return (
                        (teacher.name ? teacher.name.toLowerCase().startsWith(this.state.searchPattern.toLowerCase()) : false)
                        || (teacher.surname ? teacher.surname.toLowerCase().startsWith(this.state.searchPattern.toLowerCase()) : false)
                        || (teacher.login ? teacher.login.toLowerCase().startsWith(this.state.searchPattern.toLowerCase()) : false))
                }
            )
    }

    onClickAddTeacherButton = (teacher) => {
        console.log("onClickAddTeacherButton", teacher)

        if (!this.state.commission) {
            let newComm = {
                teachers: [teacher],
                exam: {
                    degree: this.state.selectedDegree,
                    location: this.state.selectedLocation,
                    fieldOfStudy: null,
                    date: this.state.selectedDate,
                },
                state: "EDITABLE",
            }
            console.log(newComm)
            this.setState({
                commission: newComm,
            })
        } else {
            if (!this.state.commission.teachers.includes(teacher)) {
                let com = {...this.state.commission}
                com.teachers.push(teacher)
                this.setState({
                    commission: com,
                })
            }
        }
    }

    onClickRemoveTeacher = teacher => () => {
        console.log("onClickRemoveTeacher", teacher)
        let com = {...this.state.commission}
        com.teachers = com.teachers.filter(item => item !== teacher)
        console.log(com)
        this.setState({
            commission: com,
        }, () => console.log(this.state.commission))

    }

    onClickSaveCommission = () => {
        console.log("onClickSaveCommission")
        if (!this.state.commission) {
            return
        }
        //creationTO object
        const payload = {
            date: this.state.selectedDate,
            degree: this.state.selectedDegree,
            locationId: this.state.selectedLocation.id,
            teachers: this.state.commission.teachers,
        }

        // let payload = {
        //     ...this.state.commission,
        // }
        console.log(payload)


        post(`/commission/create`, payload)
            .then(res => console.log(res))
        this.setState({
            ...InitialState
        }, () => this.fetchTeachers())
    }


    render() {
        const teachersFilteredList = this.teachersFilteredList()

        return (
            <>
                <Container>
                    <h1>
                        Manual Creating Page
                    </h1>
                    <SearchBox
                        // onClickButton={}
                        searchPattern={this.state.searchPattern}
                        onChange={this.handleSearchBoxInput}
                    />
                    {/*<CommissionParameters>*/}

                    {/*</CommissionParameters>*/}

                    <CommissionProps
                        date={this.state.selectedDate}
                        degrees={this.state.degrees}
                        locations={this.state.locations}
                        onChangeDate={this.handleChangeDate}
                        onChangeDegree={this.handleChangeDegree}
                        onChangeLoc={this.handleChangeLocation}
                    >

                    </CommissionProps>

                    <Grid container>
                        <Grid item xs>
                            <Paper>
                                Search results
                                <SearchResultPanel
                                    data={teachersFilteredList}
                                    onEditClick={this.onClickAddTeacherButton}
                                    add={true}
                                />
                            </Paper>
                        </Grid>
                        <Grid item xs={4}>
                            <Paper>
                                Current Commission
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>
                                                <List>
                                                    {this.state.commission &&
                                                    this.state.commission.teachers.map((t, k) => {
                                                        return (
                                                            <ListItem>
                                                                {t.name + " " + t.surname}
                                                                <Button
                                                                    onClick={this.onClickRemoveTeacher(t)}
                                                                >
                                                                    <ClearIcon/>
                                                                </Button>
                                                            </ListItem>
                                                        )
                                                    })}
                                                </List>
                                            </TableCell>

                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                Location
                                            </TableCell>
                                            <TableCell> {this.state.selectedLocation &&
                                            this.state.selectedLocation.building + ":" +
                                            this.state.selectedLocation.classroom
                                            }
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                Date
                                            </TableCell>
                                            <TableCell>
                                                {this.state.selectedDate}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                                <Button
                                    onClick={this.onClickSaveCommission}
                                >
                                    Save
                                </Button>
                            </Paper>
                        </Grid>
                    </Grid>

                </Container>

            </>
        )
    }
}

export default withStyles(useStyles)(ManualCreatingPage);