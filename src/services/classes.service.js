const createError = require('http-errors');
const { PrismaClientKnownRequestError } = require('@prisma/client/runtime');

const prisma = require('../utils/prisma');

class classService {
  static async createOne({ data }) {
    try {
      const createdClass = await prisma.class.create({ data });
      return createdClass;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002')
        throw createError.Conflict('Class Already Exists');
      else if (e instanceof PrismaClientKnownRequestError && e.code === 'P2003')
        throw createError.Conflict('Year Does Not Exist');
      else throw createError.InternalServerError();
    }
  }

  static async getAll({ options }) {
    try {
      const classes = await prisma.class.findMany({
        skip: options.skip,
        take: options.take,
        orderBy: { id: options.sort },
      });
      return classes;
    } catch (e) {
      throw createError.InternalServerError();
    }
  }

  static async getOne({ data }) {
    try {
      const selectedClass = await prisma.class.findUnique({
        where: { id: data.classId },
      });
      if (!selectedClass) throw createError.NotFound('Class Not Found');

      return selectedClass;
    } catch (e) {
      if (createError.isHttpError(e)) throw e;
      else throw createError.InternalServerError();
    }
  }

  static async updateOne({ data }) {
    try {
      const classId = { data };
      delete data.classId;

      const updatedClass = await prisma.class.update({
        where: { id: classId },
        data,
      });
      return updatedClass;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2002')
        throw createError.Conflict('Class Already Exists');
      else if (e instanceof PrismaClientKnownRequestError && e.code === 'P2003')
        throw createError.Conflict('Year Does Not Exist');
      else if (e instanceof PrismaClientKnownRequestError && e.code === 'P2025')
        throw createError.NotFound('Class Not Found');
      else throw createError.InternalServerError();
    }
  }

  static async deleteOne({ data }) {
    try {
      await prisma.class.delete({ where: { id: data.classId } });
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError && e.code === 'P2025')
        throw createError.NotFound('Class Not Found');
      else if (e instanceof PrismaClientKnownRequestError && e.code === 'P2003')
        throw createError.Conflict('Foreign Key Violation');
      else throw createError.InternalServerError();
    }
  }
}

module.exports = classService;
