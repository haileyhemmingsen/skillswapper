function verify(req, res) {
    const tokenHeaderKey = 'jwt-token'
    const authToken = req.headers[tokenHeaderKey]
    try {
      const verified = jwt.verify(authToken, jwtSecretKey)
      if (verified) {
        return res.status(200).json({ status: 'logged in', message: 'success' })
      } else {
        // Access Denied
        return res.status(401).json({ status: 'invalid auth', message: 'error' })
      }
    } catch (error) {
      // Access Denied
      return res.status(401).json({ status: 'invalid auth', message: 'error' })
    }
};

module.exports = { verify };