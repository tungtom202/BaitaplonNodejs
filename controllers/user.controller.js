const db = require("../models");
const User  = db.user;
const Op = db.Sequelize.Op;
// const { getPagination, getPagingData } = require("./utils");
const { QueryTypes } = require('sequelize');
var bcrypt = require("bcryptjs");
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
            res.send({
            message: "User was deleted successfully!"
            });
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

