const Otherbill = require('../models/Otherbill')
const OtherbillName = require('../models/OtherbillName')
const { QueryTypes, where } = require('sequelize')
const database = require('../config/db')

class OtherService {
  constructor() {
    this.otherbill = new Otherbill().getModel()
    this.otherbillname = new OtherbillName().getModel()
    this.sequelize = this.otherbill.sequelize
  }

  async getBillAll() {
    try {
      const getAllbill = await this.otherbill.findAll({ where: { IsDelete: false }, order: [['ID', 'DESC']] })
      return getAllbill
    } catch (error) {
      throw new Error(error.message || 'Something went wrong while fetching bills')
    }
  }

  async getBillById(id) {
    try {
      if (!id) {
        throw new Error('ไม่เจอid ')
      }
      const getbillID = await this.otherbill.findOne({ where: { ID: id, IsDelete: false } })
      if (!getbillID) {
        throw new Error('ไม่เจอบิลนี้ ')
      }
      const getbillname = await this.otherbillname.findAll({ where: { Billid: id } })
      const billnameData = getbillname.map((item) => ({
        BillName: item.BillName,
        Price: item.Price,
        Quantity: item.Quantity,
        Description: item.Description,
      }))

      const result = {
        ID: getbillID.ID,
        Roomid: getbillID.Roomid,
        BilledToName: getbillID.BilledToName,
        BilledToContact: getbillID.BilledToContact,
        BilledToAddress: getbillID.BilledToAddress,
        BilledToCity: getbillID.BilledToCity,
        BilledToPhone: getbillID.BilledToPhone,
        ShippedToAddress: getbillID.ShippedToAddress,
        ShippedToCity: getbillID.ShippedToCity,
        ShippedToPhone: getbillID.ShippedToPhone,
        date: getbillID.updateDate,
        billnameData,
      }

      // const query = `
      //     select * from otherbills o
      //     left join otherbillnames o2 on o."ID"  = o2."Billid"
      //     where o2."Billid" is not null AND  o."ID"  = ${id}
      //   `
      //   const data = await database.sequelize.query(query, {
      //     replacements: {id},
      //     type: QueryTypes.SELECT
      // });
      return result
    } catch (error) {
      throw new Error(error.message || 'Something went wrong while fetching bills')
    }
  }

  async createBill(data) {
    const { ID, billnameData, ...billData } = data

    const transaction = await this.sequelize.transaction()
    try {
      if (ID === 0) {
        const Billnew = await this.otherbill.create(
          {
            ...billData,
            IsDelete: false,
            createDate: Date.now(),
            updateDate: Date.now(),
          },
          { transaction },
        )

        if (!Billnew) {
          throw new Error('ไม่สามารถบันทึกข้อมูลบิลได้')
        }
        const billId = Billnew.ID || Billnew.id

        const billnameInsert = await Promise.all(
          billnameData.map(async (value) => {
            const billNameNew = await this.otherbillname.create(
              {
                ...value,
                Billid: billId,
              },
              { transaction },
            )
            return billNameNew
          }),
        )

        await transaction.commit()
        return { message: 'สร้างบิลสำเร็จ' }
      } else {
        const existingBill = await this.otherbill.findOne({ where: { ID: ID, IsDelete: false } }, { transaction })

        if (!existingBill) {
          throw new Error('ไม่พบบิลที่ต้องการแก้ไข')
        }

        await existingBill.update(
          {
            ...billData,
            updateDate: Date.now(),
          },
          { transaction },
        )

        //ลบ billname เก่าและสร้างใหม่
        await this.otherbillname.destroy({
          where: { Billid: ID },
          transaction,
        })

        const billnameUpdate = await Promise.all(
          billnameData.map(async (value) => {
            const billNameNew = await this.otherbillname.create(
              {
                ...value,
                Billid: ID,
              },
              { transaction },
            )
            return billNameNew
          }),
        )

        await transaction.commit()
        return billnameUpdate
      }
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }

  async deleteOtherBill(id) {
    try {
      const otherbillData = await this.otherbill.findOne({
        where: {
          ID: id,
          IsDelete: false,
        },
      })

      if (!otherbillData) {
        throw new Error('ไม่พบข้อมูลบิลนี้')
      }

      const t = await this.sequelize.transaction()

      try {
        await otherbillData.update(
          {
            IsDelete: true,
            updateDate: new Date(),
          },
          { transaction: t },
        )

        await this.otherbillname.destroy(
          {
            where: {
              Billid: id,
            },
          },
          { transaction: t },
        )

        await t.commit()

        return { message: 'ลบข้อมูลบิลเรียบร้อยแล้ว' }
      } catch (error) {
        await t.rollback()
        throw error
      }
    } catch (error) {
      throw new Error(error.message || 'เกิดข้อผิดพลาดในการลบข้อมูลบิล')
    }
  }
}

module.exports = OtherService
