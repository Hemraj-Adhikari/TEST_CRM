const leads = [
  { id: 1, name: "Rajesh Kumar", email: "rajesh@gmail.com", phone: "+977 9801234567", company: "Kumar Corp", source: "Website", status: "New", assignedTo: "Hemraj Ji", value: 50000, createdAt: "2026-05-01" },
  { id: 2, name: "Anita Bhattarai", email: "anita@mail.com", phone: "+977 9812233445", company: "Bhattarai Ltd", source: "Referral", status: "Contacted", assignedTo: "Jitendra Sharma", value: 75000, createdAt: "2026-04-28" },
];

export const getLeads = (req, res) => {
  res.json(leads);
};

export const createLead = (req, res) => {
  const { name, email, phone, company, source, status, assignedTo, value } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  const newLead = {
    id: leads.length + 1,
    name,
    email,
    phone: phone || "",
    company: company || "",
    source: source || "Website",
    status: status || "New",
    assignedTo: assignedTo || "Hemraj Ji",
    value: Number(value) || 0,
    createdAt: new Date().toISOString().split("T")[0],
  };
  leads.push(newLead);
  res.status(201).json(newLead);
};

export const updateLead = (req, res) => {
  const id = Number(req.params.id);
  const lead = leads.find((item) => item.id === id);
  if (!lead) {
    return res.status(404).json({ error: "Lead not found" });
  }

  const { name, email, phone, company, source, status, assignedTo, value } = req.body;
  Object.assign(lead, { name, email, phone, company, source, status, assignedTo, value: Number(value) });
  res.json(lead);
};

export const deleteLead = (req, res) => {
  const id = Number(req.params.id);
  const index = leads.findIndex((item) => item.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Lead not found" });
  }
  const removed = leads.splice(index, 1);
  res.json({ message: "Lead deleted", lead: removed[0] });
};
