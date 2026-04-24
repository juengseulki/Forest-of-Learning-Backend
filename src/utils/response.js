export const success = (res, data, message = 'success', status = 200) => {
  return res.status(status).json({ data, message });
};

export const fail = (res, code, message, status = 400) => {
  return res.status(status).json({ error: { code, message } });
};
