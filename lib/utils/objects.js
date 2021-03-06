/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

var o = null // eslint-disable-line no-unused-vars

function Objects () {
  this.counter = 0
  this.container = {}
}

Objects.prototype.add = function (category, member) {
  if (!member) {
    member = 'o' + this.counter
  }
  if (!this.has(category)) {
    this.container[category] = []
  }
  this.container[category].push({type: category, name: member})
  ++this.counter
  return this.container[category].slice(-1)[0].name
}

Objects.prototype.get = function (category, last) {
  if (!(category in this.container)) {
    // return {type:null, name:null};
    logger.traceback()
    throw new Error(category + ' is not available.')
  }
  if (last) {
    return this.container[category].slice(-1)[0]
  }
  return random.pick(this.container[category])
}

Objects.prototype.pick = function (category, last) {
  try {
    return this.get(category, last).name
  } catch (e) {
    logger.traceback()
    throw logger.JSError('Error: pick(\'' + category + '\') is undefined.')
  }
}

Objects.prototype.pop = function (objectName) {
  let self = this
  utils.common.getKeysFromHash(this.container).forEach(function (category) {
    self.container[category].forEach(function (obj) {
      if (obj.name === objectName) {
        self.container[category].splice(self.container[category].indexOf(obj), 1)
      }
    })
  })
}

Objects.prototype.contains = function (categoryNames) {
  let categories = []
  let self = this
  categoryNames.forEach(function (name) {
    if (self.has(name)) {
      categories.push(name)
    }
  })
  return (categories.length === 0) ? null : categories
}

Objects.prototype.show = function (category) {
  return (category in this.container) ? this.container[category] : this.container
}

Objects.prototype.count = function (category) {
  return (category in this.container) ? this.container[category].length : 0
}

Objects.prototype.has = function (category) {
  if (category in this.container) {
    this.check(category)
    return this.container[category].length > 0
  }
  return false
}

Objects.prototype.valid = function () {
  let items = []
  let self = this
  utils.common.getKeysFromHash(self.container).forEach(function (category) {
    self.check(category)
  })
  utils.common.getKeysFromHash(self.container).forEach(function (category) {
    for (let i = 0; i < self.container[category].length; i++) {
      items.push(self.container[category][i].name)
    }
  })
  return items
}

Objects.prototype.check = function (category) {
  let self = this
  self.container[category].forEach(function (object) {
    try {
      let x = /* frame.contentWindow. */ eval(object.name) // eslint-disable-line no-eval
      if (x === undefined || x === null) {
        self.pop(object.name)
      }
    } catch (e) {
      self.pop(object.name)
    }
  })
}
