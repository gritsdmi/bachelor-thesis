import React from "react";
import Container from "@material-ui/core/Container";
import {withStyles} from "@material-ui/core/styles";
import SearchBox from "../../components/SearchBox";
import {Grid, ListItem, Paper, Table, TableBody, TableCell, TableRow} from "@material-ui/core";
import CommissionProps from "../../components/CommissionProps";
import {get, post} from "../../utils/request"
import format from "date-fns/format";
import List from "@material-ui/core/List";
import SearchResultPanel from "../../components/SearchResultPanel";
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
        if (!this.props.location.commission) {
            //click on header's button
            //there are none any graft
            console.log("ManualCreatingPage DID MOUNT props new == true")
        } else {
            //edit some commission

            // console.log("ManualCreatingPage DID MOUNT props new == false", this.props)
            this.setState({
                commission: this.props.location.commission,
                selectedDegree: this.props.location.commission.exam.degree,
                selectedLocation: this.props.location.commission.exam.location,
                selectedDate: this.props.location.commission.exam.date.date,
            }, () => console.log(this.state))

        }
        console.log("ManualCreatingPage DID MOUNT props new == false", this.props)

        this.fetchAll()

    }

    fetchLocations(dateF) {
        get(`/location/free/${dateF}`)
            .then(response => {
                this.setState({
                        locations: response.data,
                        selectedLocation: response.data.length > 0 ? response.data[0] : '',
                    }
                    // , () => console.log(this.state.locations)
                )
            })
            .catch(error => console.log(error))
    }

    fetchDegrees() {
        get("/exam/degrees")
            .then(response => {
                this.setState({
                        degrees: response.data,
                        selectedDegree: response.data.length > 0 ? response.data[0] : '',
                    }
                    // , () => console.log(response.data)
                )
            })
            .catch(error => console.log(error))
    }

    fetchTeachers() {
        get(`/user/teacher/date/${this.state.selectedDate}`)
            .then((response) => {
                this.setState({teachers: response.data})
            })
            .catch(err => console.log(err))
    }

    fetchAll() {
        this.fetchTeachers()
        this.fetchDegrees()
        this.fetchLocations(this.state.selectedDate);
    }


    handleSearchBoxInput = (event) => {
        const value = event.target.value;
        if (value && value !== '') {
            this.setState({searchPattern: value})
        } else {
            this.setState({searchPattern: ''})
        }
    }

    handleChangeDate = (event) => {
        //dd.MM.yyyy
        console.log("handleChangeDate", format(event, dateFormat))
        this.setState({
            selectedDate: format(event, dateFormat),
        }, () => this.fetchAll())

    }

    handleChangeLocation = (event) => {
        this.setState({
            selectedLocation: event.target.value,
        })
    }

    handleChangeDegree = (event) => {
        this.setState({
            selectedDegree: event.target.value,
        })
    }

    teachersFilteredList() {

        // if (this.state.searchPattern.length < 2) {
        //     return []
        // }

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

        let payload
        if (this.props.location.commission) {
            payload = {
                ...this.state.commission,
            }
            post(`/commission/${this.state.commission.id}`, payload)
                .then(res => console.log(res))
            this.setState({
                ...InitialState
            }, () => this.fetchAll())
        } else {
            //creationTO object
            payload = {
                date: this.state.selectedDate,
                degree: this.state.selectedDegree,
                locationId: this.state.selectedLocation.id,
                teachers: this.state.commission.teachers,
            }
            post(`/commission/create`, payload)
                .then(res => console.log(res))
            this.setState({
                ...InitialState
            }, () => this.fetchAll())
        }

        console.log(payload)
    }


    render() {

        if (!this.state.locations || !this.state.degrees) {
            return <></>
        }
        const teachersFilteredList = this.teachersFilteredList()
        const defaults = {
            date: this.state.selectedDate,
            loc: this.state.selectedLocation,
            degree: this.state.selectedDegree,
        }

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

                    <CommissionProps
                        date={this.state.selectedDate}
                        degrees={this.state.degrees}
                        locations={this.state.locations}
                        onChangeDate={this.handleChangeDate}
                        onChangeDegree={this.handleChangeDegree}
                        onChangeLoc={this.handleChangeLocation}
                        defaults={defaults}
                    />

                    <Grid container>
                        <Grid item xs>
                            <Paper>
                                Search results
                                <SearchResultPanel
                                    data={teachersFilteredList}
                                    onClick={this.onClickAddTeacherButton}
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
                                                    this.state.commission.teachers.map((t, idx) => {
                                                        return (
                                                            <ListItem
                                                                key={idx}
                                                            >
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

export default withStyles(useStyles)(ManualCreatingPage)
