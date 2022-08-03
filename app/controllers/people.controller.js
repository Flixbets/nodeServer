const db = require("../models");
const people = db.people;
const setstatus = db.setstatus;
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const sharp = require('sharp');


// import multer from 'multer'




const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => { // setting destination of uploading files        
    if (file.fieldname === "imageprofile") { // if uploading resume
      cb(null, './app/images')
    } else { // else uploading image
      cb(null, './app/images/driving')
    }
  },
  filename: (req, file, cb) => { // naming file
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "imageprofile") { // if uploading resume
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) { // check file type to be pdf, doc, or docx
      cb(null, true);
    } else {
      cb(null, false); // else fails
    }
  } else { // else uploading image
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) { // check file type to be png, jpeg, or jpg
      cb(null, true);
    } else {
      cb(null, false); // else fails
    }
  }

};

var upload_test = multer(
  {
    storage: fileStorage,
    limits:
    {
      fileSize: '1048576'
    },
    fileFilter: fileFilter
  }
).fields(
  [
    {
      name: 'imageprofile',
      maxCount: 1
    },
    {
      name: 'imagedriving',
      maxCount: 1
    }
  ]
)



exports.deleteImageProfile = async (req, res) => {

  const filePath = req.body.imageprofileBackup;

  const id = req.body.id;


  fs.unlink(filePath, async (err) => {
    if (err) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return
    }
    await people.update({ imageprofile: null }, {
      where: { id: id }
    })
      .then(num => {
        return res.send({
          message: "User was updated successfully."
        });
      })
      .catch(err => {
        return res.status(500).send({
          message: "Error updating User "
        });
      });

  })

  return;

}

exports.deleteImageDriving = async (req, res) => {

  const filePath = req.body.imagedrivingBackup;

  const id = req.body.id;



  fs.unlink(filePath, async (err) => {
    if (err) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return
    }
    await people.update({ imagedriving: null }, {
      where: { id: id }
    })
      .then(num => {
        return res.send({
          message: "User was updated successfully."
        });
      })
      .catch(err => {
        return res.status(500).send({
          message: "Error updating User "
        });
      });

  })

  return;

}



exports.uploadimage = upload_test;




exports.createPeople = async (req, res) => {
  if (req.body.idcard == null) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }
  if (req.body == null) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }


  people.findOne({ where: { idcard: req.body.idcard } }).then(async (user) => {
    if (user) {
      res.status(400).send({
        status: 400,
        message: "Failed! Username is already in use!"
      });
      return;
    }
    var data_people = {}

    try{await sharp(req.files.imageprofile[0].path)
      .resize(400, 400)
     .jpeg({ quality: 50 })
     .toFile(
      path.resolve(req.files.imageprofile[0].destination,'resized',req.files.imageprofile[0].filename)

     )
     fs.unlinkSync(req.files.imageprofile[0].path)}catch(err){}
    
     try{await sharp(req.files.imagedriving[0].path)
      // .resize(400, 650)
     .jpeg({ quality: 50 })
     .toFile(
      path.resolve(req.files.imagedriving[0].destination,'resized',req.files.imagedriving[0].filename)

     )
     fs.unlinkSync(req.files.imagedriving[0].path)}catch(err){}
      
    try {
      data_people = {
        imageprofile: 'app\\images\\resized\\'+req.files.imageprofile[0].filename,
        imagedriving: 'app\\images\\driving\\resized\\'+req.files.imagedriving[0].filename,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        phone: req.body.phone,
        birth: req.body.birth,
        idcard: req.body.idcard,
        setstatusId: req.body.setstatusId,
        use: req.body.use,
      }
    } catch (err) {
      try {
        data_people = {
          imageprofile: 'app\\images\\resized\\'+req.files.imageprofile[0].filename,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          phone: req.body.phone,
          birth: req.body.birth,
          idcard: req.body.idcard,
          setstatusId: req.body.setstatusId,
          use: req.body.use,
        }
      } catch (err) {
        try {
          data_people = {
            imagedriving: 'app\\images\\driving\\resized\\'+req.files.imagedriving[0].filename,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            phone: req.body.phone,
            birth: req.body.birth,
            idcard: req.body.idcard,
            setstatusId: req.body.setstatusId,
            use: req.body.use,
          }
        } catch (err) {
          data_people = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            phone: req.body.phone,
            birth: req.body.birth,
            idcard: req.body.idcard,
            setstatusId: req.body.setstatusId,
            use: req.body.use,
          }
        }

      }
    }


    return await people.create(data_people)
      .then(data => {
        res.status(200).send({ status: true });
      })
      .catch(err => {
        res.status(500).send({
          status: 500,
          message:
            err.message || "Some error occurred while creating the People."
        });
      });

  })


};

exports.getAllUser = async (req, res) => {
  people.findAll({
    include: [
      {
        model: setstatus,
        as: "setstatuses",

      }
    ]
  })
    .then(data => {
      res.send(data);
    }).catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving User."
      });
    });
}

exports.getOneUser = (req, res) => {
  people.findOne({
    include: [
      {
        model: setstatus,
        as: "setstatuses",

      }
    ], where: { idcard: req.body.idcard, use: 1 }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      if (req.body.phone != user.phone) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }
      res.status(200).send({ user });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Exams."
      });
    });

}

exports.updateUser = async (req, res) => {



  people.findAll({ where: { idcard: req.body.idcard } })
    .then(async (user) => {

      if (user.length > 1) {
        res.status(400).send({
          status: 400,
          message: "Failed! Username is already in use!"
        });
        return;
      }

      try{await sharp(req.files.imageprofile[0].path)
        .resize(400, 400)
       .jpeg({ quality: 50 })
       .toFile(
        path.resolve(req.files.imageprofile[0].destination,'resized',req.files.imageprofile[0].filename)
  
       )
       fs.unlinkSync(req.files.imageprofile[0].path)}catch(err){}
      
       try{await sharp(req.files.imagedriving[0].path)
        // .resize(400, 650)
       .jpeg({ quality: 50 })
       .toFile(
        path.resolve(req.files.imagedriving[0].destination,'resized',req.files.imagedriving[0].filename)
  
       )
       fs.unlinkSync(req.files.imagedriving[0].path)}catch(err){}


      try {
        data_people = {
          imageprofile: 'app\\images\\resized\\'+req.files.imageprofile[0].filename,
        imagedriving: 'app\\images\\driving\\resized\\'+req.files.imagedriving[0].filename,
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          phone: req.body.phone,
          birth: req.body.birth,
          idcard: req.body.idcard,
          setstatusId: req.body.setstatusId,
          use: req.body.use,
        }
      } catch (err) {
        try {
          data_people = {
            imageprofile: 'app\\images\\resized\\'+req.files.imageprofile[0].filename,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            phone: req.body.phone,
            birth: req.body.birth,
            idcard: req.body.idcard,
            setstatusId: req.body.setstatusId,
            use: req.body.use,
          }
        } catch (err) {
          try {
            data_people = {
              imagedriving: 'app\\images\\driving\\resized\\'+req.files.imagedriving[0].filename,
              firstname: req.body.firstname,
              lastname: req.body.lastname,
              phone: req.body.phone,
              birth: req.body.birth,
              idcard: req.body.idcard,
              setstatusId: req.body.setstatusId,
              use: req.body.use,
            }
          } catch (err) {
            data_people = {
              firstname: req.body.firstname,
              lastname: req.body.lastname,
              phone: req.body.phone,
              birth: req.body.birth,
              idcard: req.body.idcard,
              setstatusId: req.body.setstatusId,
              use: req.body.use,
            }
          }

        }
      }

      const id = req.params.id;
      people.update(data_people, {
        where: { id: id }
      })
        .then(num => {
          if (num == 1) {
            res.send({
              message: "User was updated successfully."
            });
          } else {
            res.send({
              message: `Cannot update User with id=${id}. Maybe Question was not found or req.body is empty!`
            });
          }
        })
        .catch(err => {
          res.status(500).send({
            message: "Error updating User with id=" + id
          });
        });
    });


}

exports.deleteUser = (req, res) => {
  const id = req.params.id;

  people.destroy({
    where: { id: id }
  })
    .then(() => {
      res.status(200).send({
        message: "User was deleted successfully!"
      });
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete User with id=" + id
      });
    });
};
