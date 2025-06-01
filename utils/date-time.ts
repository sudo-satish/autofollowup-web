import moment from 'moment';

export const formatDateTime = (dateTime: Date) => {
  return moment(dateTime).format('DD-MMM, hh:mm a');
};
