const schools = require('./source.js.js');
const simpleSchools = schools.map(item => ({
  name: item.name,
  school_id: item.school_id,
  province_name: item.province_name,
  province_id: item.province_id,
}))

module.exports = simpleSchools
