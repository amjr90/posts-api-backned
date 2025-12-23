const NodeEnvironment = require('jest-environment-node').TestEnvironment

class CustomEnvironment extends NodeEnvironment {
  constructor (config, context) {
    super(config, context)

    // Add a mock localStorage to prevent initialization errors
    this.global.localStorage = {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
      clear: () => {}
    }
  }
}

module.exports = CustomEnvironment
