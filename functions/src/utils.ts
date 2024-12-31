export const degreesToRadians = (degrees: number) => {
    return degrees % 360 * (Math.PI / 180);
};
export const radiansToDegrees = (radians: number) => {
    return radians * (180 / Math.PI);
};
export const correctionArrayHour = (array: Array<number>, values: { minutes: number, seconds: number }) => {
    let hour = array[0];
    let minute = array[1] + values.minutes;
    let second = array[2] + values.seconds;
    if (second >= 60) {
        minute = minute + 1;
        second = second - 60;
    } else if (second < 0) {
        minute = minute - 1;
        second = 60 - Math.abs(second);
    }
    if (minute >= 60) {
        hour = hour + 1;
        minute = minute - 60;
    } else if (minute < 0) {
        hour = hour - 1;
        minute = 60 - Math.abs(minute);
    }
    return [hour, minute, second];
};
