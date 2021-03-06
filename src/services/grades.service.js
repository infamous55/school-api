const createError = require('http-errors');
const { PrismaClientKnownRequestError } = require('@prisma/client/runtime');

const prisma = require('../utils/prisma');
const mail = require('../utils/mail');

class gradesService {
  static async createOne({ data }) {
    try {
      const student = await prisma.user.findUnique({
        where: { id: data.studentId },
      });
      if (!student) throw createError.Conflict('Student Does Not Exist');
      else if (student.role !== 'STUDENT')
        throw createError.Conflict('Not A Student');

      const grade = await prisma.grade.create({
        data,
        include: {
          discipline: true,
          semester: {
            include: {
              year: true,
            },
          },
        },
      });

      await mail(
        student.email,
        'New Grade',
        `Hi ${student.name}, you got a(n) ${grade.value} in ${grade.discipline.name}!`
      );

      return grade;
    } catch (e) {
      if (createError.isHttpError(e)) throw e;
      else if (
        e instanceof PrismaClientKnownRequestError &&
        e.code === 'P2003'
      ) {
        console.log(e);
        if (e.meta.field_name === 'Grade_semesterId_fkey (index)')
          throw createError.Conflict('Semester Does Not Exist');
        else if (e.meta.field_name === 'Grade_disciplineId_fkey (index)')
          throw createError.Conflict('Discipline Does Not Exist');
      } else throw createError.InternalServerError();
    }
  }

  static async getAll({ options, data }) {
    try {
      const grades = await prisma.grade.findMany({
        skip: options.skip,
        take: options.take,
        include: {
          discipline: true,
          semester: {
            include: {
              year: true,
            },
          },
        },
        where: {
          studentId: data.studentId,
          semesterId: data.semesterId,
          disciplineId: data.disciplineId,
        },
        orderBy: { id: options.sort },
      });
      return grades;
    } catch (e) {
      console.log(e);
      throw createError.InternalServerError();
    }
  }

  static async getOne({ data }) {
    try {
      const grade = await prisma.grade.findUnique({
        where: { id: data.gradeId },
        include: {
          discipline: true,
          semester: {
            include: {
              year: true,
            },
          },
        },
      });
      if (!grade) throw createError.NotFound('Grade Not Found');

      return grade;
    } catch (e) {
      if (createError.isHttpError(e)) throw e;
      else throw createError.InternalServerError();
    }
  }

  static async updateOne({ data }) {
    try {
      if (data.studentId) {
        const student = await prisma.user.findUnique({
          where: { id: data.studentId },
        });
        if (!student) throw createError.Conflict('Student Does Not Exist');
        else if (student.role !== 'STUDENT')
          throw createError.Conflict('Not A Student');
      }

      const { gradeId } = data;
      delete data.gradeId;

      const grade = await prisma.grade.update({
        where: { id: gradeId },
        include: {
          discipline: true,
          semester: {
            include: {
              year: true,
            },
          },
        },
        data,
      });
      return grade;
    } catch (e) {
      if (createError.isHttpError(e)) throw e;
      else if (e instanceof PrismaClientKnownRequestError && e.code === 'P2025')
        throw createError.NotFound('Grade Not Found');
      else if (
        e instanceof PrismaClientKnownRequestError &&
        e.code === 'P2003'
      ) {
        if (e.meta.field_name === 'Grade_semesterId_fkey (index)')
          throw createError.Conflict('Semester Does Not Exist');
        else if (e.meta.field_name === 'Grade_disciplineId_fkey (index)')
          throw createError.Conflict('Discipline Does Not Exist');
      } else throw createError.InternalServerError();
    }
  }

  static async deleteOne({ data }) {
    try {
      await prisma.grade.delete({ where: { id: data.gradeId } });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2025')
        throw createError.NotFound('Grade Not Found');
      throw createError.InternalServerError();
    }
  }
}

module.exports = gradesService;
