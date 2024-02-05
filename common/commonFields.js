const createField = (dataType, isRequired, isUnique, defaultVal) => ({
  type: dataType,
  required: isRequired,
  unique: isUnique,
  default: defaultVal,
});

module.exports = createField;
