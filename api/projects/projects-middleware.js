// add middlewares here related to projects
function validateProjectData(req, res, next) {
    const { name, description} = req.body;
    if(!name || !description) {
      return res.status(400).json({message: "Missing required name and description fields" });
    }
    next();
  }
  
  
  module.exports = {
      validateProjectData,
  
  }