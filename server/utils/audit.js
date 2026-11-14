import AuditLog from '../models/AuditLog.js';
// who did what, when (timestamps give the "when")
export const audit = (req, action, entity, entityId, details = {}) =>
  AuditLog.create({ actor: req.user?._id, actorEmail: req.user?.email, action, entity, entityId: String(entityId || ''), details })
    .catch(() => {});
