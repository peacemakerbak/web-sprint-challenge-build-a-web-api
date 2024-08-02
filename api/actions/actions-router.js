// Write your "actions" router here!
const express = require("express");
const router = express.Router();
const Action = require('./actions-model')
const {validateAction, validateProjectId} = require('./actions-middlware')

// Define your routes for actions here
// Example:
router.get("/", async (req, res, next) => {
try{
  const actions = await Action.get();
  if (!actions) {
    res.json(actions)
  } else {
    res.json(actions);
  }
} catch (error) {
  next(error);
}

});
router.get('/:id', async (req, res, next) => {
  try{
    const { id } = req.params;
    const action = await Action.get(id);
    if (action) {
      res.json(action)
    } else {
      res.status(404).json({ message: "Action not found"})
    }
  } catch (error) {
    next(error)
  }
})

router.post('/', validateAction, validateProjectId,  async (req, res, next) => {
try {
  const action = await Action.insert(req.body);
  res.status(201).json(action);
} catch (error) {
  next(error);
}
})
router.put('/:id', validateProjectId, validateAction, async (req, res, next) => {
  try {
    const { id } = req.params;
    const changes = req.body;
    const updatedAction = await Action.update(id, changes);
    res.json(updatedAction)
  } catch (error){
    next(error)
  }
} )

router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  try{
    const count = await Action.remove(id);
    if(count > 0) {
      res.status(200).json({ message: 'The action has been deleted'})
    } else {
      res.status(404).json({message: 'The action could not be found'})
    }

  } catch (error) {
    next(error);
  }
})


router.use(errorHandler);

function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(400).json({ error: "Something went wrong!" });
}

module.exports = router;