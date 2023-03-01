export const DateFormat = (date: string | undefined | Date) => {
  const timeOption: { [key: string]: string } = {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };

  if (date) {
    const nowLocalString = new Date(date).toLocaleString('ko', timeOption);
    const nowRepalce = nowLocalString.replace(/\.\s/g, '-');
    return nowRepalce.slice(0, -1);
  }

  const nowLocalString = new Date().toLocaleString('ko', timeOption);
  const nowRepalce = nowLocalString.replace(/\.\s/g, '-');
  return nowRepalce.slice(0, -1);
};

export const timestampFormat = (date: string | undefined | Date) => {
  const timeOption: { [key: string]: string | boolean } = {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };

  if (date) {
    const nowLocalString = new Date(date).toLocaleString('ko', timeOption);
    const nowRepalce = nowLocalString.replace(/(^\d{4})\.\s(\d{2}).\s(\d{2})\.\s(\d{2}:\d{2}:\d{2})$/, '$1-$2-$3T$4+09:00');
    return nowRepalce;
  }

  const nowLocalString = new Date().toLocaleString('ko', timeOption);
  const nowRepalce = nowLocalString.replace(/(^\d{4})\.\s(\d{2}).\s(\d{2})\.\s(\d{2}:\d{2}:\d{2})$/, '$1-$2-$3T$4+09:00');
  return nowRepalce;
};

export const timeFormat = (date: string | undefined | Date) => {
  const timeOption: { [key: string]: string | boolean } = {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  };

  if (date) {
    const nowLocalString = new Date(date).toLocaleString('ko', timeOption);
    const nowRepalce = nowLocalString.replace(/(^\d{4})\.\s(\d{2}).\s(\d{2})\.\s(\d{2}:\d{2}:\d{2})$/, '$4+09:00');
    return nowRepalce;
  }

  const nowLocalString = new Date().toLocaleString('ko', timeOption);
  const nowRepalce = nowLocalString.replace(/(^\d{4})\.\s(\d{2}).\s(\d{2})\.\s(\d{2}:\d{2}:\d{2})$/, '$4+09:00');
  return nowRepalce;
};
