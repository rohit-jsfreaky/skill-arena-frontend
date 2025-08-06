import { format, parseISO, formatDistanceToNow as originalFormatDistanceToNow } from 'date-fns';
import { zonedTimeToUtc, utcToZonedTime } from 'date-fns-tz';

const IST_TIMEZONE = 'Asia/Kolkata';

/**
 * Converts a UTC timestamp from the database to IST and formats the distance
 * @param {string | Date} timestamp - The timestamp from the database
 * @param {object} options - Options for formatDistanceToNow
 * @returns {string} - Formatted distance string
 */
export const formatDistanceToNowIST = (timestamp: string | Date, options = {}) => {
  try {
    // Parse the timestamp (assuming it comes from DB as UTC)
    const utcDate = typeof timestamp === 'string' ? parseISO(timestamp) : timestamp;
    
    // Convert UTC to IST
    const istDate = utcToZonedTime(utcDate, IST_TIMEZONE);
    
    // Return formatted distance using the IST date
    return originalFormatDistanceToNow(istDate, { 
      addSuffix: true,
      ...options
    });
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    // Fallback to original function
    const date = typeof timestamp === 'string' ? parseISO(timestamp) : timestamp;
    return originalFormatDistanceToNow(date, options);
  }
};

/**
 * Formats a timestamp to IST timezone
 * @param {string | Date} timestamp - The timestamp to format
 * @param {string} formatString - The format string (default: 'PPP p')
 * @returns {string} - Formatted date string in IST
 */
export const formatToIST = (timestamp: string | Date, formatString = 'PPP p') => {
  try {
    const utcDate = typeof timestamp === 'string' ? parseISO(timestamp) : timestamp;
    const istDate = utcToZonedTime(utcDate, IST_TIMEZONE);
    return format(istDate, formatString);
  } catch (error) {
    console.error('Error formatting timestamp to IST:', error);
    const date = typeof timestamp === 'string' ? parseISO(timestamp) : timestamp;
    return format(date, formatString);
  }
};

/**
 * Gets current time in IST
 * @returns {Date} - Current time in IST
 */
export const getCurrentTimeIST = () => {
  return utcToZonedTime(new Date(), IST_TIMEZONE);
};

/**
 * Converts IST time to UTC for database storage
 * @param {Date} istDate - Date in IST
 * @returns {Date} - Date in UTC
 */
export const convertISTToUTC = (istDate: Date) => {
  return zonedTimeToUtc(istDate, IST_TIMEZONE);
};
