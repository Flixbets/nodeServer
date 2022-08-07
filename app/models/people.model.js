
module.exports = (sequelize, Sequelize) => {
  const People = sequelize.define("peoples", {
    
    firstname: {
      type: Sequelize.STRING,
      defaultValue: "-",
    },
    lastname: {
      type: Sequelize.STRING,
      defaultValue: "-",
    },
    phone: {
      type: Sequelize.STRING
    },
    birth: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    idcard: {
      type: Sequelize.STRING,
      unique: true
    },
    use: {
      type: Sequelize.TINYINT,
    },
    callback: {
      type: Sequelize.TINYINT,
    },
    imageprofile: {
      type: Sequelize.STRING
    },
    imagedriving: {
      type: Sequelize.STRING
    }

  });
  return People;
};