module.exports = {
    //HOST: "192.168.1.161",
    HOST: "localhost",
    PORT: "3306",
    USER: 'root',
    PASSWORD: "",
    DB: "tvnews",
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    options: {
        encrypt: false,
        trustServerCertificate: true,
    }
};