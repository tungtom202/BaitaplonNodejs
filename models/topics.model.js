module.exports = (sequelize, Sequelize) => {
    const Columns = sequelize.define("topics", {
        name: {
            type: Sequelize.STRING
        }  
    });
    return Columns;
};