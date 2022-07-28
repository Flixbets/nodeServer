module.exports = (sequelize, Sequelize) => {
    const setstatus = sequelize.define("setstatus", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          status: {
            type: Sequelize.STRING
          }
    },{timestamps: false});
    return setstatus;
  };