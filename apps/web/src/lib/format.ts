import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export function formatDateTimeRelative(date: string) {
  return dayjs().to(date);
}

export function formatDateTime(date: string) {
  return dayjs(date).format("DD/MM/YY HH:mm");
}

export function formatDateTimeLong(date: string) {
  return dayjs(date).format("DD MMM[.] YYYY[,] HH:mm");
}
