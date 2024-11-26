const Room = require('../models/Room');

class RoomService {
  constructor() {
    this.room = new Room().getModel();
  }

  // ดึงข้อมูลห้องตาม BuildingNumber ที่ส่งมา
  async getRoomByBuildingNumber(IDBuilding) {
    console.log('sssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss:', IDBuilding);
    
    try {
      const rooms = await this.room.findAll({
        where: { BuildingNumber: IDBuilding }, // ใช้เงื่อนไข where
      });
      return rooms;
    } catch (error) {
      throw new Error(error.message || 'มีบางอย่างผิดพลาดในการดึงข้อมูลห้อง');
    }
  }
}

module.exports = RoomService;
