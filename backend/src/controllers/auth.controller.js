import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const users = [
  {
    id: 1,
    name: 'Admin User',
    email: 'hemraj.route2uni@gmail.com',
    password: bcrypt.hashSync('password123', 10),
    role: 'Admin',
  },
];

const createToken = (user) => {
  const secret = process.env.JWT_SECRET || 'route2uni_secret_key';
  return jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.name }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

export const login = (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const passwordMatches = bcrypt.compareSync(password, user.password);
  if (!passwordMatches) {
    return res.status(401).json({ error: 'Password incorrect' });
  }

  return res.json({ token: createToken(user), user: { id: user.id, name: user.name, email: user.email, role: user.role } });
};

export const register = (req, res) => {
  const { name, email, password, role = 'User' } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  if (users.find((u) => u.email === email)) {
    return res.status(409).json({ error: 'Email already exists' });
  }

  const hashed = bcrypt.hashSync(password, 10);
  const newUser = { id: users.length + 1, name, email, password: hashed, role };
  users.push(newUser);

  return res.status(201).json({ user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role } });
};
