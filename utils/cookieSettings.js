const cookieSettings = {
  maxAge: 3600000 * 24 * 7,
  httpOnly: true,
  sameSite: true,
  /* sameSite: 'None', */
  /* secure: true, */
};

module.exports = cookieSettings;
