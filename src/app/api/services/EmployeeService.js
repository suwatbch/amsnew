const Employee = require('../models/Employee');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt');
const { Op, where } =  require('sequelize') 


class EmployeeService {
  constructor() {
    this.employeeModel = new Employee().getModel();
  }

  async getAllEmployees() {
    try {
      const users = await this.employeeModel.findAll();
      return users;
    } catch (error) {
      throw new Error(error.message || 'Something went wrong while fetching employees');
    }
  }

  async login(Userlogin, Password) {
    try {
      const user = await this.employeeModel.findOne({
        where: { Userlogin, IsDelete: false }
      });

      if (!user || Password !== user.Password) {
        throw new Error('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
      }

      const token = jwt.sign(
        { id: user.ID, Userlogin: user.Userlogin },
        jwtConfig.secret,
        { expiresIn: jwtConfig.expiresIn }
      );

      const { Password: _, ...userWithoutPassword } = user.toJSON();

      return { user: userWithoutPassword, token };
    } catch (error) {
      throw new Error(error.message || 'เกิดข้อผิดพลาด');
    }
  }

  async createEmployee(data) {
    const { Userlogin, Email , ID } = data;

    if(ID === 0)
    {
      const existingUser = await this.employeeModel.findOne({ where: { Userlogin } });
      if (existingUser) {
        throw new Error('ชื่อผู้ใช้ถูกใช้ไปแล้ว');
      }
  
      const existingEmail = await this.employeeModel.findOne({ where: { Email } });
      if (existingEmail) {
        throw new Error('อีเมลถูกใช้ไปแล้ว');
      }
  
      const newUser = await this.employeeModel.create({
        ...data,
        isdelete: false,
        createDate: Date.now(),
        updateDate: Date.now()
      });
  
      const { Password, ...userWithoutPassword } = newUser.toJSON();
      return userWithoutPassword;
    }else{
      const findID = await this.employeeModel.findOne({ where: { ID } });
      if (findID) {
        const existingUser = await this.employeeModel.findOne({ 
          where: { 
            Userlogin,
            ID: { [Op.ne]: ID }, //ไม่เท่ากับ ID ตัวเอง
            IsDelete: false
          } 
        });
        if (existingUser) {
          throw new Error('ชื่อผู้ใช้ถูกใช้ไปแล้ว');
        }
        const existingEmail = await this.employeeModel.findOne({ 
          where: { 
            Email,
            ID: { [Op.ne]: ID },
            IsDelete: false
          } 
        });
        if (existingEmail) {
          throw new Error('อีเมลถูกใช้ไปแล้ว');
        }
        await findID.update({
          ...data,
          IsDelete: false,
          updateDate: Date.now()
        });

        const updatedEmployee = await findID.reload();
        return updatedEmployee;
      }else{
        throw new Error('ไม่พบ ID นี้ในระบบ');
      }
    }
  }

  async deleteEmployee(id) {
    try {
      const employee = await this.employeeModel.findOne({where: {ID: id , IsDelete: false}});

      if (!employee) {
        throw new Error('ไม่พบข้อมูลพนักงานนี้');
      }
      await employee.update({ IsDelete: true ,updateDate: Date.now()});

      return { message: 'ลบข้อมูลพนักงานเรียบร้อยแล้ว' };
    } catch (error) {
      throw new Error(error.message || 'เกิดข้อผิดพลาดในการลบข้อมูลพนักงาน');
    }
  }
}

module.exports = EmployeeService;
