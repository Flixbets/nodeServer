const express = require("express");
const cors = require("cors");
const app = express();
var corsOptions = 
"https://react-fontend-5c241.web.app";
//"http://localhost:3000";
// app.use(cors(corsOptions));
app.use(cors({credentials: true, origin: corsOptions}));
// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.static('public')); 
app.use(express.urlencoded({ extended: true }));


//static image folder

app.use('/app/images',express.static('./app/images'))
// app.use('/app/images/driving',express.static('./app/images/driving'))

const db = require("./app/models");
const Role = db.role;
const SetStatus = db.setstatus;
const User = db.user;


// db.sequelize.sync();

db.sequelize.sync({force: true}).then(() => {
    console.log('Drop and Resync Db');
    initial();
    initial2();
    
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});


require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
require('./app/routes/admin.routes')(app);
// require('./app/routes/mod.routes')(app);
require('./app/routes/people.routes')(app);
require('./app/routes/setstatus.routes')(app);



// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});


function initial() {
  Role.create({
    id: 1,
    name: "user"
  });

  Role.create({
    id: 3,
    name: "mod"
  });

  Role.create({
    id: 2,
    name: "admin"
  });
}

function initial2() {
  SetStatus.create({
    status: "None"
  });
  // SetStatus.create({
  //   status: "อยู่ระหว่างการยืนยันตัวตนกับเจ้าหน้าที่"
  // });

  // SetStatus.create({
  //   status: "อยู่ระหว่างการชำระค่าใบขับขี่"
  // });

  // SetStatus.create({
  //   status: "อยู่ระหว่างการชำระค่าใบอบรม"
  // });

  // SetStatus.create({
  //   status: "อยู่ระหว่างการชำระค่าคำขอออกบัตร"
  // });

  // SetStatus.create({
  //   status: "อยู่ระหว่างการชำระค่ามัดจำขนส่ง"
  // });

  // SetStatus.create({
  //   status: "สินค้าถูกตีกลับ"
  // });

}

