import moment from "moment";
export function diffYMD(date1, date2) {
  let years = date1.diff(date2, "years");
  date2.add(years, "years");
  let month = date1.diff(date2, "month");
  date2.add(month, "month");
  let days = date1.diff(date2, "days");
  return `${years}Y,` + ` ${month}M,` + ` ${days}D`;
}

export const ageCalculatorFunc = (dateOfBirth) => {
  const currentDate = moment();
  const dob = moment(new Date(dateOfBirth));
  const patientAge = diffYMD(currentDate, dob) || null;
  return patientAge;
};

export const getCurrentYear = () => {
  return new Date().getFullYear();
};


export const ageCalculate = (dateOB) => {
  const currentDate = moment();
  const dob = moment(dateOB);
  const years = currentDate.diff(dob, 'years');
  return `${years}Y`;
};


