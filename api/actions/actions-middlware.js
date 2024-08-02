
const Project = require('./actions-model')

function validateAction(req, res, next) {
  const { notes, description, completed, project_id } = req.body;
  if (
    notes == null ||
    description == null ||
    completed == null ||
    project_id == null
  ) {
    return res.status(400).json({
      message:
        "Missing required notes, description, completed, or project_id field",
    });
  }
  next();
}



async function validateProjectId(req, res, next) {
  const { project_id } = req.body;
  try {
    const project = await Project.get(project_id);
    if (!project) {

      return res.status(400).json({ message: "Invalid project_id: Project does not exist." });
    }
    next();
  } catch (error) {
    next(error); 
  }
}



module.exports = {
  validateAction,
  validateProjectId,
}