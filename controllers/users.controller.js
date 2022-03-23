const service = require('../services/users.service');
const createError = require('http-errors');

const getOptions = require('../utils/options');

class usersController {
  static async createOne(req, res, next) {
    try {
      const user = await service.createOne({ data: req.body });
      res.status(201).json(user);
    } catch (e) {
      next(createError(e.statusCode, e.message));
    }
  }

  static async getAll(req, res, next) {
    try {
      const options = getOptions(req);
      const users = await service.getAll({ options });

      res.status(200).json({ users });
    } catch (e) {
      next(createError(e.statusCode, e.message));
    }
  }

  static async getOne(req, res, next) {
    try {
      const userId = parseInt(req.params.userId);
      const user = await service.getOne({
        data: { userId },
      });

      res.status(200).json(user);
    } catch (e) {
      console.log(e);
      next(createError(e.statusCode, e.message));
    }
  }

  static async updateOne(req, res, next) {
    try {
      const userId = parseInt(req.params.userId);
      const user = await service.updateOne({
        data: { userId, ...req.body },
      });

      res.status(200).json(user);
    } catch (e) {
      next(createError(e.statusCode, e.message));
    }
  }

  static async updateCurrent(req, res, next) {
    try {
      const userId = parseInt(req.params.userId);
      const user = await service.updateOne({
        data: { userId, ...req.body },
      });

      res.status(200).json(user);
    } catch (e) {
      next(createError(e.statusCode, e.message));
    }
  }

  static async deleteOne(req, res, next) {
    try {
      const userId = parseInt(req.params.userId);
      await service.deleteOne({ data: { userId } });

      res.status(204).send();
    } catch (e) {
      next(createError(e.statusCode, e.message));
    }
  }
}

module.exports = usersController;
