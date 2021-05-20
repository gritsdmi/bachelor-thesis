import moment from "moment";

export const dateFormatMoment = "DD.MM.yyyy";
export const timeFormatMoment = "HH:mm";
export const dateTimeFormatMoment = dateFormatMoment.concat(' ').concat(timeFormatMoment)

export const intOrFloatPattern = /^\d+([.]\d+)?$/;
export const intPattern = /^\d*$/;
export const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;


export const enumerateDaysBetweenDates = function (startDate, endDate) {
    let dates = [];

    let currDate = moment(startDate).startOf('day');
    const lastDate = moment(endDate).startOf('day');

    dates.push(currDate.clone().format(dateFormatMoment))
    while (currDate.add(1, 'days').diff(lastDate) <= 0) {
        dates.push(currDate.clone().format(dateFormatMoment));
    }

    return dates;
};