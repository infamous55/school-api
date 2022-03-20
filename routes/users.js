const router = require('express').Router();
const users = require('../controllers/users.controller');
const auth = require('../middlewares/auth');
const schema = require('../validators/users.validator');
const validate = require('../middlewares/validate');

router.post('/', auth('ADMIN'), validate(schema.createUser), users.createOne);
router.get('/', auth(), users.getAll);
router.get('/me', auth(), (req, res) => res.redirect(req.user.id));
router.get('/:id', auth(), users.getOne);
router.put(
  '/me',
  auth(),
  validate(schema.updateCurrentUser),
  users.updateCurrent
);
router.put('/:id', auth('ADMIN'), validate(schema.updateUser), users.updateOne);
router.delete('/:id', auth('ADMIN'), users.deleteOne);

module.exports = router;
