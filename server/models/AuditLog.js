import mongoose from 'mongoose';
const auditSchema = new mongoose.Schema({
  actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  actorEmail: String,
  action: String,   // CREATE, UPDATE, DELETE, LOGIN, TRANSFER
  entity: String,   // Account, Transaction...
  entityId: String,
  details: Object,
}, { timestamps: true });
export default mongoose.model('AuditLog', auditSchema);
