function requireAdmin(req, res, next) {
  const passcode = req.header('x-admin-passcode');

  if (!passcode || passcode !== process.env.ADMIN_PASSCODE) {
    return res.status(401).json({ error: 'Invalid or missing admin passcode.' });
  }

  next();
}

module.exports = { requireAdmin };
