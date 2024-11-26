const Building = require('../models/Building');

class BuildService {
  constructor() {
    this.building = new Building().getModel();
  }

  async getAllBuild() {
    try {
      const users = await this.building.findAll();
      return users;
    } catch (error) {
      throw new Error(error.message || 'มีบางอย่างผิดดึงข้อมูลอาคารมาไม่ได้');
    }
  }
 
}

module.exports = BuildService;
