const Tenants = require('../models/Tenants')
const Room = require('../models/Room')
const Building = require('../models/Building')
const Otherbill = require('../models/Otherbill')
const OtherbillName = require('../models/OtherbillName')
const Enum = require('../utils/Enum')
const { QueryTypes } = require('sequelize')
const database = require('../config/db')

class TenantService {
  constructor() {
    this.tenantModel = new Tenants().getModel()
    this.roomModel = new Room().getModel()
    this.buildingModel = new Building().getModel()
    this.otherbill = new Otherbill().getModel()
    this.otherbillname = new OtherbillName().getModel()
    this.sequelize = this.tenantModel.sequelize

    // this.tenantModel.hasMany(this.roomModel, { foreignKey: 'TenantsID', as: 'Rooms' });
    // this.roomModel.belongsTo(this.tenantModel, { foreignKey: 'TenantsID', as: 'Tenant' });
  }

  async getAllTenants() {
    try {
      // const tenants = await this.tenantModel.findAll({
      //   where: {
      //     IsDelete: false,
      //   },
      //   order: [['ID', 'ASC']],
      //   include: [{
      //     model: this.roomModel,
      //     as: 'Rooms',
      //     attributes: ['RoomNumber', 'TenantsID'],
      //     required: true, // true สำหรับ INNER JOIN, false สำหรับ LEFT JOIN
      //   }],
      // });

      const query = `
              SELECT t.*, r."RoomNumber"
              FROM tenants t
              LEFT JOIN rooms r ON t."ID" = r."TenantsID"
              where t."IsDelete" = false 
              order by t."ID"
        `

      const tenants = await database.sequelize.query(query, {
        type: QueryTypes.SELECT,
      })

      const tenantsWithReadableStatus = tenants.map((tenant) => {
        return {
          ...tenant,
          ContactAbout: Enum.getStatusNameEnum(tenant.ContactAbout) || 'ทำสัญญาเข้าอยู่',
        }
      })

      return tenantsWithReadableStatus
    } catch (error) {
      throw new Error(error.message || 'เกิดข้อผิดพลาด')
    }
  }

  async createTenants(data) {
    const {
      ID,
      roomnumber,
      date,
      billnameData = [],
      BilledToName,
      BilledToContact,
      BilledToAddress,
      BilledToCity,
      BilledToPhone,
      ShippedToAddress,
      ShippedToCity,
      ShippedToPhone,
      ...tenantData
    } = data
    const transaction = await this.sequelize.transaction()

    try {
      if (ID === 0) {
        // สร้างผู้เช่าใหม่
        console.log(tenantData)
        const newTenant = await this.tenantModel.create(
          {
            ...tenantData,
            IsDelete: false,
            createDate: Date.now(),
            updateDate: Date.now(),
          },
          { transaction },
        )

        const existingRoom = await this.roomModel.findOne({
          where: { RoomNumber: roomnumber, TenantsID: null },
          transaction,
        })

        if (!existingRoom) {
          throw new Error('ไม่พบเลขห้องนี้ในระบบหรือเลขห้องนี้ถูกจองไปแล้ว')
        }

        // สร้างบิลสำหรับผู้เช่าใหม่
        const newBill = await this.otherbill.create(
          {
            Roomid: existingRoom.ID,
            BilledToName: `${data.Firstname} ${data.Lastname}`,
            BilledToContact: BilledToContact || null,
            BilledToAddress: BilledToAddress || null,
            BilledToCity: BilledToCity || null,
            BilledToPhone: BilledToPhone || data.Phone || null,
            ShippedToAddress: ShippedToAddress || null,
            ShippedToCity: ShippedToCity || null,
            ShippedToPhone: ShippedToPhone || data.Phone || null,
            IsDelete: false,
            createDate: Date.now(),
            updateDate: Date.now(),
            date: date || new Date().toISOString(),
          },
          { transaction },
        )

        // สร้างรายการในบิลจาก billnameData
        await Promise.all(
          billnameData.map((item) =>
            this.otherbillname.create(
              {
                Billid: newBill.ID,
                BillName: item.BillName,
                Price: item.Price?.toString(),
                Quantity: item.Quantity || 1,
                Description: item.Description || null,
              },
              { transaction },
            ),
          ),
        )

        const [affectedRows] = await this.roomModel.update(
          {
            TenantsID: newTenant.ID,
            DateSignIn: Date.now(),
          },
          {
            where: {
              RoomNumber: roomnumber,
            },
            transaction,
          },
        )

        if (affectedRows === 0) {
          throw new Error('ไม่สามารถอัปเดตข้อมูลห้องได้')
        }

        const building = await this.buildingModel.findOne({
          where: { BuildType: data.Building },
          transaction,
        })

        if (!building) {
          throw new Error('ไม่พบประเภทอาคารที่ระบุในระบบ')
        }

        await this.buildingModel.update(
          {
            reserve: building.reserve + 1,
          },
          {
            where: {
              BuildType: data.Building,
            },
            transaction,
          },
        )

        const billResponse = {
          ID: newBill.ID,
        }

        await transaction.commit()
        return {
          tenant: newTenant,
          bill: billResponse,
        }
      } else {
        // แก้ไขผู้เช่าที่มีอยู่ (ส่วนที่เหลือคงเดิม)
        const existingTenant = await this.tenantModel.findOne({
          where: { ID: ID, IsDelete: false },
          transaction,
        })

        if (!existingTenant) {
          throw new Error('ไม่พบผู้เช่าที่ระบุ')
        }

        // หาห้องปัจจุบันของผู้เช่า
        const currentRoom = await this.roomModel.findOne({
          where: { TenantsID: ID },
          transaction,
        })

        // ถ้ามีการเปลี่ยนห้อง
        if (currentRoom && currentRoom.RoomNumber !== roomnumber) {
          // ตรวจสอบห้องใหม่
          const newRoom = await this.roomModel.findOne({
            where: { RoomNumber: roomnumber, TenantsID: null },
            transaction,
          })

          if (!newRoom) {
            throw new Error('ห้องที่ต้องการย้ายไปไม่ว่างหรือไม่มีในระบบ')
          }

          // อัปเดตห้องเก่าให้ว่าง
          await this.roomModel.update(
            {
              TenantsID: null,
              DateSignIn: null,
            },
            {
              where: { RoomNumber: currentRoom.RoomNumber },
              transaction,
            },
          )

          // อัปเดตห้องใหม่
          await this.roomModel.update(
            {
              TenantsID: ID,
              DateSignIn: Date.now(),
            },
            {
              where: { RoomNumber: roomnumber },
              transaction,
            },
          )

          // ถ้ามีการเปลี่ยนประเภทอาคาร
          if (currentRoom.BuildingNumber !== Enum.getBuildingIDEnum(data.Building)) {
            // ลดจำนวนคนในอาคารเก่า
            const oldBuilding = await this.buildingModel.findOne({
              where: { ID: currentRoom.BuildingNumber },
              transaction,
            })

            if (oldBuilding) {
              await this.buildingModel.update(
                {
                  reserve: Math.max(0, oldBuilding.reserve - 1),
                },
                {
                  where: { ID: currentRoom.BuildingNumber },
                  transaction,
                },
              )
            }

            // เพิ่มจำนวนคนในอาคารใหม่
            const newBuilding = await this.buildingModel.findOne({
              where: { BuildType: data.Building },
              transaction,
            })

            if (!newBuilding) {
              throw new Error('ไม่พบประเภทอาคารใหม่ที่ระบุในระบบ')
            }

            await this.buildingModel.update(
              {
                reserve: newBuilding.reserve + 1,
              },
              {
                where: { BuildType: data.Building },
                transaction,
              },
            )
          }
        }

        // อัปเดตข้อมูลผู้เช่า
        await existingTenant.update(
          {
            ...tenantData,
            updateDate: Date.now(),
          },
          { transaction },
        )

        await transaction.commit()
        return await this.tenantModel.findByPk(ID)
      }
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

  async deleteTenant(id) {
    const transaction = await this.sequelize.transaction()

    try {
      const tenant = await this.tenantModel.findOne({
        where: { ID: id, IsDelete: false },
        transaction,
      })

      if (!tenant) {
        throw new Error('ไม่พบผู้เช่าที่ระบุ')
      }

      // หาห้องของผู้เช่า
      const room = await this.roomModel.findOne({
        where: { TenantsID: id },
        transaction,
      })

      if (room) {
        // อัปเดตห้องให้ว่าง
        await this.roomModel.update(
          {
            TenantsID: null,
            DateSignIn: null,
          },
          {
            where: { RoomNumber: room.RoomNumber },
            transaction,
          },
        )

        // ลดจำนวนคนในอาคาร
        const building = await this.buildingModel.findOne({
          where: { ID: room.BuildingNumber },
          transaction,
        })

        if (building) {
          await this.buildingModel.update(
            {
              reserve: Math.max(0, building.reserve - 1),
            },
            {
              where: { ID: room.BuildingNumber },
              transaction,
            },
          )
        }
      }

      await tenant.update(
        {
          IsDelete: true,
          updateDate: Date.now(),
        },
        { transaction },
      )

      await transaction.commit()
      return { message: 'ลบข้อมูลผู้เช่าเรียบร้อยแล้ว' }
    } catch (error) {
      await transaction.rollback()
      throw new Error(error.message || 'เกิดข้อผิดพลาดในการลบข้อมูลผู้เช่า')
    }
  }
}

module.exports = TenantService
