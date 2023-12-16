module.exports = (sequelize, Sequelize) => {
    const Evaluate = sequelize.define("evaluate", {
        comments: {
            type: Sequelize.STRING
        },
        likes: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        }
        
    });
    return Evaluate;
};