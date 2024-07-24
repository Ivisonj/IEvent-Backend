export class CustomDate {
  public static customHours(date: Date): Date {
    date.setHours(23, 59, 59, 999);
    const utcDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return utcDate;
  }

  public static fixTimezoneoffset(date: Date): Date {
    const utcDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return utcDate;
  }
}
