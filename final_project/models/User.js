const bcrypt = require('bcrypt');

class User {
  constructor() {
    this.users = []; // In-memory storage (replace with database in production)
  }

  async create(username, password) {
    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      username,
      password: hashedPassword,
      createdAt: new Date(),
    };
    this.users.push(user);
    return { username: user.username, createdAt: user.createdAt };
  }

  async findByUsername(username) {
    return this.users.find(user => user.username === username) || null;
  }

  async validatePassword(user, password) {
    if (!user) return false;
    return await bcrypt.compare(password, user.password);
  }

  async exists(username) {
    return this.users.some(user => user.username === username);
  }

  getAll() {
    return this.users.map(user => ({
      username: user.username,
      createdAt: user.createdAt,
    }));
  }
}

module.exports = new User();



