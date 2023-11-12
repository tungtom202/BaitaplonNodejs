// const config = require('./model.config')
module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: {
          args: true,
          msg: 'Username address already in use!'
        },
        validate: {
          notEmpty: {
            args: true,
            msg: 'username can not be empty !'
          },
          notNull: {
            args: true,
            msg: 'Please enter username !'
          },
        }
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true
        },
        unique: {
          args: true,
          msg: 'Email address already in use!'
        },
        validate: {
          notEmpty: {
            args: true,
            msg: 'Email can not be empty !'
          },
          notNull: {
            args: true,
            msg: 'Please enter email !'
          },
        }
      },
      password: {
        type: Sequelize.STRING,
        //   validate: {
        //     len: { 
        //        args: [7, 42],
        //        msg: "The password length should be between 8 and 42 characters."
        //     }
        //  }
      },
      displayname: {
        type: Sequelize.STRING
      },
      fistname: {
        type: Sequelize.STRING
      },
      lastname: {
        type: Sequelize.STRING
      },
      avartar: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      roleId: {
        type: Sequelize.BIGINT
      }
    }
    );
  
    return User;
  };