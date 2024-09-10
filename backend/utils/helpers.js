  exports.handleError = (res, error) => {
    res.status(500).json({ message: error.message });
  };
  
  exports.handleSuccess = (res, data) => {
    res.status(200).json(data);
  };
   