const customers = [
  { id: 1, name: 'Pramila Shakya', email: 'pramil@gmail.com', phone: '+977 9709709019', company: 'Tech Ventures', address: 'Kathmandu, Nepal', status: 'Active' },
  { id: 2, name: 'Arjun Thapa', email: 'arjun@business.com', phone: '+977 9812345678', company: 'Global Solutions', address: 'Pokhara, Nepal', status: 'Active' },
];

export const getCustomers = (req, res) => {
  res.json(customers);
};

export const createCustomer = (req, res) => {
  const { name, email, phone, company, address, status } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const newCustomer = {
    id: customers.length + 1,
    name,
    email,
    phone: phone || '',
    company: company || '',
    address: address || '',
    status: status || 'Active',
  };
  customers.push(newCustomer);
  res.status(201).json(newCustomer);
};

export const updateCustomer = (req, res) => {
  const id = Number(req.params.id);
  const customer = customers.find((item) => item.id === id);
  if (!customer) {
    return res.status(404).json({ error: 'Customer not found' });
  }

  const { name, email, phone, company, address, status } = req.body;
  Object.assign(customer, { name, email, phone, company, address, status });
  res.json(customer);
};

export const deleteCustomer = (req, res) => {
  const id = Number(req.params.id);
  const index = customers.findIndex((item) => item.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Customer not found' });
  }
  const removed = customers.splice(index, 1);
  res.json({ message: 'Customer deleted', customer: removed[0] });
};
