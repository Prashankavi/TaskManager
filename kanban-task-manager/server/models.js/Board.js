const mongoose = require('mongoose');


const BoardSchema = new mongoose.Schema({
owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
title: { type: String, required: true },
listOrder: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TaskList' }], // saves layout
// Team features
members: [{ 
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  role: { type: String, enum: ['admin', 'member'], default: 'member' },
  joinedAt: { type: Date, default: Date.now }
}],
invitations: [{
  email: { type: String, required: true },
  role: { type: String, enum: ['admin', 'member'], default: 'member' },
  invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
}],
}, { timestamps: true });


module.exports = mongoose.model('Board', BoardSchema);