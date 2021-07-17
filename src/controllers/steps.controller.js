const Step = require("../models/steps.model");
const Course = require("../models/courses.model")

// Validation Middleware

// Checks if step exists
function stepExists(req, res, next) {
  const { stepId } = req.params;
  Step.findById(stepId, (err, step) => {
    if (err) return next();
    if (!step) return next({
      status: 404,
      message: `Step id ${req.params.stepId} cannot be found`
    });
    res.locals.step = step;
  });
}

// Create Step
function create(req, res, next) {
  Step.create({ ...req.body }, (err, newStep) => {
    if (err) return next(err);
    res.status(201).json({ message: "New step created", newStep });
  });
}

// Add Step to course
function addStep(req, res, next) {
  const { step } = res.locals;
  Course.findByIdAndUpdate(req.params.courseId, { $addToSet: { steps: step } }, (err, course) => {
    if (err) return next();
    if (!course) return next({
      status: 404,
      message: `Course id ${req.params.courseId} cannot be found`
    });
    course.save((err, savedCourse) => {
      if (err) return next({
        status: 400,
        message: err
      });
      res.json({ message: "Step added to course", savedCourse });
    });
  });
}

// Remove step from course
function removeStep(req, res, next) {
  const { step } = res.locals;
  Course.findByIdAndUpdate(req.params.courseId, { $pull: { steps: step } }, (err, course) => {
    if (err) return next();
    if (!course) return next({
      status: 404,
      message: `Course id ${req.params.courseId} cannot be found`
    });
    course.save((err, savedCourse) => {
      if (err) return next({
        status: 400,
        message: err
      });
      res.json({ message: "Step removed from course", savedCourse });
    });
  });
}

// Fetch Steps
function list(req, res, next) {
  Step.find({}, (err, steps) => {
    if (err) return next();
    res.status(200).json({ steps });
  });
}

// Fetch Single Step
function read(req, res, next) {
  const stepId = req.params.stepId;
  Step.findById(stepId, (err, step) => {
    if (err) return next();
    if (!step) return next({
      status: 404,
      message: `Step id ${stepId} cannot be found`
    });
    res.json({ step });
  });
}

// Update Single Step
function update(req, res, next) {
  const { name } = req.body;
  Step.findByIdAndUpdate(req.params.stepId, { name }, (err, step) => {
    if (err) return next();
    if (!step) return next({
      status: 404,
      message: `Step id ${req.params.stepId} cannot be found`
    });
    step.save((err, savedstep) => {
      if (err) return next({
        status: 400,
        message: err
      });
      res.json({ message: "step successfaully updated", savedstep });
    });
  });
}

// Delete Single Step
function destroy(req, res, next) {
  Step.findByIdAndDelete(req.params.stepId, (err, step) => {
    if (err) return next();
    if (!step) return next({
      status: 400,
      message: `Step id ${req.params.stepId} cannot be found`
    });
    res.json({ message: "Step deleted successfully" });
  });
}


module.exports = {
  create,
  addStep: [stepExists, addStep],
  removeStep: [stepExists, removeStep],
  list,
  read,
  update,
  destroy,
}