const mock = () => {
  let storage = {};

  return {
    getItem: key => (key in storage ? storage[key] : undefined),
    setItem: (key, value) => (storage[key] = value || ''),
    removeItem: key => delete storage[key],
    clear: () => (storage = {}),
  };
};

module.exports = mock;
