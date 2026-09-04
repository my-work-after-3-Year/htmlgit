module.exports.register = function h(handlebars) {
  const getArrayLength = (array) => (Array.isArray(array) ? array.length : 0);

  handlebars.registerHelper('ifLengthBetween', (array, min, max, options) => {
    const length = getArrayLength(array);

    if (length >= min && length <= max) {
      return options.fn(this);
    }

    return options.inverse(this);
  });

  handlebars.registerHelper('ifLongerThan', (array, min, options) => {
    const length = getArrayLength(array);

    if (length > min) {
      return options.fn(this);
    }

    return options.inverse(this);
  });

  handlebars.registerHelper('log', (something) => {
    console.log(something);
  });
};
