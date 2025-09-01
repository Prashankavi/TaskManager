const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const UserSchema = new mongoose.Schema({
email: { type: String, unique: true, required: true, lowercase: true, index: true },
name: { type: String, required: true },
passwordHash: { type: String, required: true },
// Team features
boards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Board' }], // Boards user has access to
pendingInvitations: [{ 
  boardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Board' },
  invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  role: { type: String, enum: ['member', 'admin'], default: 'member' },
  createdAt: { type: Date, default: Date.now }
}],
}, { timestamps: true });


UserSchema.methods.verifyPassword = function (pwd) {
return bcrypt.compare(pwd, this.passwordHash);
};


module.exports = mongoose.model('User', UserSchema);