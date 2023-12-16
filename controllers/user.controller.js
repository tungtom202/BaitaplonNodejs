const db = require("../models");
const User  = db.user;
const Op = db.Sequelize.Op;
// const { getPagination, getPagingData } = require("./utils");
const { QueryTypes } = require('sequelize');
var bcrypt = require("bcryptjs");
const multer = require('multer');
const authJwt =require("../middleware/authJwt")

var bodyParser = require('body-parser')

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './public/upload');
    },
    filename: function(req, file, cb) {
      cb(null, file.originalname);
    },
  });
var upload = multer({ storage: storage }).single('uploadfile')
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// Create and Save a new User
exports.create = (req, res) => { 
  // Create a User
  const entity = {
      username: req.body.username,
      email: req.body.email,
      displayname: req.body.displayname,
      fistname:req.body.fistname,
      lastname:req.body.lastname,
      avartar:req.body.avartar,          
      password: bcrypt.hashSync(req.body.password, 8),
      roleid: req.body.roleid,     
  };
  // Save User in the database
  User.create(entity)
  .then(data => {
      res.send(data);
  })
  .catch(err => {
      res.status(500).send({
          message:
          err.message || "Some error occurred while creating the User."
      });
  });
};

exports.createUser = (req, res) => {
    upload(req, res, function(err) {
      if (err instanceof multer.MulterError) {
        // Một lỗi của Multer xảy ra khi upload.
        res.send("lỗi");
      } else {
        // Một lỗi không xác định xảy ra khi upload.
        if (req.file == undefined) {
          res.send("Bạn chưa chọn file");
        } else {
          const user = {
            username: req.body.username,
            email: req.body.email,
            displayname: req.body.displayname,
            fistname:req.body.fistname,
            lastname:req.body.lastname,
            avartar:req.file.originalname,      
            description: req.body.description,  
            password: bcrypt.hashSync(req.body.password, 8),
            roleId: req.body.roleId ? req.body.roleId : false,  
          };
          User.create(user)
            .then((createdUser) => {
              res.render("userAdmin", { user: createdUser }); // Render giao diện newAdmin với dữ liệu tin tức đã tạo
            })
            .catch((error) => {
              res.status(500).send("Đã xảy ra lỗi trong quá trình tạo user mới"); // Gửi phản hồi lỗi
            });
        }
      }
    });
  };

//create đưa ra giao diện
exports.createUserRegister = async (req, res) => {
    // Validate request
    if (!req.body.username) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }
  
    // Create a user
    const users = {
      username: req.body.username,
            email: req.body.email,
            displayname: req.body.displayname,
            fistname:req.body.fistname,
            lastname:req.body.lastname,
            // avartar:req.file.originalname,      
            // description: req.body.description,  
            password: bcrypt.hashSync(req.body.password, 8),
    };

    const namebody = await User.create(users)
    return namebody;

  };


//key ngoại của evaluate
exports.findbyQueryForeignUser = async () => {
    try {
      const userall = await db.sequelize.query('SELECT * FROM users', {
        nest: true,
        type: QueryTypes.SELECT,
      });
  
      console.log(userall);
      return userall;
    } catch (err) {
      console.error(err);
      throw new Error("Đã xảy ra lỗi trong quá trình lấy thông tin user.");
    }
  };
// Retrieve all Users from the database.
exports.findbyQuery = (req, res) => {
    
    db.sequelize.query('select * from users',
    {
        nest: true,                 
        type: QueryTypes.SELECT       
        
    }).then(data => {
        res.send(data);
        console.log(data);
    })
    .catch(err => {
        res.status(500).send({
        message:
            err.message || "Some error occurred while retrieving Users."
        });
    });
};
// Retrieve all Users from the database.
exports.findAll = (req, res) => {
    const username = req.query.username;
    var condition = username ? { username: { [Op.like]: `%${username}%` } } : null;
    User.findAll({ where: condition })
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
        message:
            err.message || "Some error occurred while retrieving Users."
        });
    });
};
// Retrieve all user from the database.
exports.findbyQueryUser = async (req, res) => {
    const userDoc = await authJwt.userToken(req);
    const name = userDoc.User.displayname;
    const avarta = userDoc.User.avartar;

    db.sequelize.query('SELECT * FROM users ORDER BY id DESC', {
      nest: true,
      type: QueryTypes.SELECT,
    })
      .then(data => {
        // console.log(data);
        const dataUser = {
            results: data,
            name: name,
            avarta: avarta
        }
        res.render('manageAdmin/userAdmin.ejs', { dataUser });
      })
      .catch(err => {
        res.status(500).send({
          message: err.message || 'Some error occurred while retrieving Users.',
        });
      });
  };
// Find a single User with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    User.findByPk(id)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
        message: "Error retrieving User with id=" + id
        });
    });
};

// exports.updateUser = async (req, res) => {
//     const id = req.params.id;
//     try {
//       upload(req, res, async function (err) {
//         if (err) {
//           return res.status(500).send('Error uploading file');
//         }
  
//         if (typeof req.file === 'undefined') {
//           await User.update(
//             {
//                 username: req.body.username,
//                 email: req.body.email,
//                 displayname: req.body.displayname,
//                 fistname:req.body.fistname,
//                 lastname:req.body.lastname,
//                 // avartar:req.file.originalname,      
//                 description: req.body.description,  
//                 password: bcrypt.hashSync(req.body.password, 8),
//                 roleId: req.body.roleId ? req.body.roleId : false,  
//             },
//             {
//               where: { id: id }
//             }
//           );
  
//           console.log('User updated successfully');
//           res.render('manageAdmin/userAdmin.ejs'); // Render giao diện newadmin
//         } else {
//           await User.update(
//             {
//                 username: req.body.username,
//                 email: req.body.email,
//                 displayname: req.body.displayname,
//                 fistname:req.body.fistname,
//                 lastname:req.body.lastname,
//                 avartar:req.file.originalname,      
//                 description: req.body.description,  
//                 password: bcrypt.hashSync(req.body.password, 8),
//                 roleId: req.body.roleId ? req.body.roleId : false,  
//             },
//             {
//               where: { id: id }
//             }
//           );
  
//           console.log('User updated successfully');
//           res.render('manageAdmin/userAdmin.ejs'); // Render giao diện newadmin
//         }
//       });
//     } catch (err) {
//       console.error(err);
//       return res.status(500).send('Internal Server Error');
//     }
//   };
exports.updateUser = async (req, res) => {
  const id = req.params.id;
  try {
    upload(req, res, async function (err) {
      if (err) {
        return res.status(500).send('Error uploading file');
      }

      if (typeof req.file === 'undefined') {
        await User.update(
          {
              username: req.body.username,
              email: req.body.email,
              displayname: req.body.displayname,
              fistname:req.body.fistname,
              lastname:req.body.lastname,
              // avartar:req.file.originalname,      
              description: req.body.description,  
              password: req.body.password,
              roleId: req.body.roleId ? req.body.roleId : false,  
          },
          {
            where: { id: id }
          }
        );

        console.log('User updated successfully');
        res.render('manageAdmin/userAdmin.ejs'); // Render giao diện newadmin
      } else {
        await User.update(
          {
              username: req.body.username,
              email: req.body.email,
              displayname: req.body.displayname,
              fistname:req.body.fistname,
              lastname:req.body.lastname,
              avartar:req.file.originalname,      
              description: req.body.description,  
              password: req.body.password,
              roleId: req.body.roleId ? req.body.roleId : false,  
          },
          {
            where: { id: id }
          }
        );

        console.log('User updated successfully');
        res.render('manageAdmin/userAdmin.ejs'); // Render giao diện newadmin
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Internal Server Error');
  }
};
// Update a User by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    User.update(req.body, {
        where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({
            message: "User was updated successfully."
            });
        } else {
            res.send({
            message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Error updating User with id=" + id
        });
    });
};
// Delete a User with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    User.destroy({
      where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            res.redirect("http://localhost:3000/manageAdmin/userAdmin")
        } else {
            res.send({
            message: `Cannot delete User with id=${id}. Maybe User was not found!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Could not delete User with id=" + id
        });
    });
};

 //get theo id
 exports.findUserById = async (userId) => {
    try {
      const data = await db.sequelize.query('SELECT * FROM users WHERE id = :id', {
        replacements: { id: userId },
        nest: true,
        type: QueryTypes.SELECT,
      });
  
      if (data.length === 0) {
        throw new Error("Không tìm thấy user.");
      }
  
      console.log(data);
      return data;
    } catch (err) {
      console.error(err);
      throw new Error("Đã xảy ra lỗi trong quá trình lấy thông tin user.");
    }
  };

