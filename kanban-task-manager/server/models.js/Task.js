const mongoose = require('mongoose');


const TaskSchema = new mongoose.Schema({
board: { type: mongoose.Schema.Types.ObjectId, ref: 'Board', index: true },
list: { type: mongoose.Schema.Types.ObjectId, ref: 'TaskList', index: true },
title: { type: String, required: true },
description: { type: String },
dueDate: { type: Date },
priority: { type: String, enum: ['low','medium','high','urgent'], default: 'medium' },
labels: [{ type: String }], // color codes or text labels
// Team features
createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });


module.exports = mongoose.model('Task', TaskSchema);