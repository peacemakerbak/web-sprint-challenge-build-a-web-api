// Write your "projects" router here!
const express = require("express");
const router = express.Router();
const Project = require('./projects-model')
const {validateProjectData, checkProjectExists} = require('./projects-middleware')
const Action = require('../actions/actions-model')


// Define your routes for projects here
// Example:
router.get("/", async (req, res, next) => {
  try{
const projects = await Project.get();
res.json(projects);
  } catch(err){
    next(err);
  }
});


router.get('/:id', async (req, res, next) => {
const { id } = req.params;
try{
  const project = await Project.get(id);
  if (project) {
    res.json(project);
  } else {
    res.status(404).json({message: "Project not found"})
  }
} catch (err) {
  next(err);
}
});

router.post("/", validateProjectData, async (req, res, next) => {
  const projectData = {
    name: req.body.name,
    description: req.body.description,
    completed: Boolean(req.body.completed) ?? false,
  };
  try {
    const newProject = await Project.insert(projectData);
    res.status(201).json(newProject);
  } catch (err) {
    next(err)
  }
});

router.put("/:id", validateProjectData, async (req, res, next) => {
  const { id } = req.params;
  if (
    req.body.name === undefined ||
    req.body.description === undefined ||
    req.body.completed === undefined
  ) {
    return res.status(400).json({
      message: "Missing required name, description, or completed field.",
    });
  }

  const changes = {
    name: req.body.name,
    description: req.body.description,
    completed: Boolean(req.body.completed),
  };

  try {
    const updatedProject = await Project.update(id, changes);
    res.status(200).json(updatedProject);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
try{
  const project = await Project.get(id);
  if (project) {
    await Project.remove(id);
    res.sendStatus(204);
  } else {
    res.status(404).json({ message: "Project not found" });
  }

} catch(err) {
  next(err)
}
})


router.get('/:id/actions', async (req, res, next) => {
  const { id } = req.params;
 try {
  const project = await Project.get(id);
  if (!project) {
    return res.status(404).json({message:"Project not found" })
  }
  const actions = await Project.getProjectActions(id);
  if(actions.length === 0) {
    return res.json([]);
  }
  res.json(actions)
 } catch (err) {
  next(err);
 }
});










router.use(errorHandler);

function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(400).json({error: "Something went wrong!"})
}



module.exports = router;