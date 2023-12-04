const createTokenUser = ({ users }) => {
  return { name: users.name, userId: users._id, role: users.role };
};
module.exports = createTokenUser;
