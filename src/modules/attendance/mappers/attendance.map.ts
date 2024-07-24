import { Attendance as AttendancePrisma } from '@prisma/client';
import { Attendance, AttendanceStatus } from '../domain/attendance';
import { AttendanceDTO } from '../dtos/attendence.DTO';

export class AttendanceMapper {
  public static toDTO(attendance: Attendance): AttendanceDTO {
    return {
      id: attendance.id,
      userId: attendance.userId,
      eventId: attendance.eventId,
      registerEventsId: attendance.registerEventsId,
      checkedInAt: attendance.checkedInAt,
      status: attendance.status,
    };
  }

  public static toDomain(raw: AttendancePrisma): Attendance {
    const attendanceOrError = Attendance.create(
      {
        userId: raw.userId,
        eventId: raw.eventId,
        registerEventsId: raw.registerEventsId,
        checkedInAt: raw.checkedInAt,
        status: raw.status as AttendanceStatus,
      },
      raw.id,
    );
    return attendanceOrError;
  }

  public static async toPersistence(attendance: Attendance) {
    return {
      id: attendance.id,
      userId: attendance.userId,
      eventId: attendance.eventId,
      registerEventsId: attendance.registerEventsId,
      checkedInAt: attendance.checkedInAt,
      status: attendance.status,
    };
  }
}
