function parseTime(time: string) {
  return parseInt(time.split(":")[0]) * 60 + parseInt(time.split(":")[1]);
}

function toTime(min: number) {
  let hours = (min / 60).toString().split(".")[0];
  if (parseInt(hours) < 10) hours = "0" + hours;
  let minutes = (min % 60).toString().split(".")[0];
  if (parseInt(minutes) < 10) minutes = "0" + minutes;
  return `${hours}:${minutes}`;
}

export default { parseTime, toTime };
