module.exports = (sequelize, Sequelize) => {
    const News = sequelize.define("news", {
        title: {
            type: Sequelize.STRING
        },
        img: {
            type: Sequelize.STRING
        },
        content: {
            type: Sequelize.STRING
        },
        published: {
            type: Sequelize.STRING
        },
        genre: {
            type: Sequelize.STRING
        },
        newviews: {
            type: Sequelize.STRING
        },
        poststatus: {
            type: Sequelize.STRING
        },
        userId: {
            type: Sequelize.STRING
        },
    });
    return News;
};