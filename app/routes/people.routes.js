const multer  = require('multer')

module.exports =(app)=>{
    
    const people = require("../controllers/people.controller");

    var router = require("express").Router();

    router.post('/newPeople',people.uploadimage,people.createPeople)
    router.get('/allPeople',people.getAllUser)
    router.put('/updatePeople/:id',people.uploadimage,people.updateUser)
    router.post('/onePeople',people.getOneUser)
    router.delete('/deletePeople/:id',people.deleteUser)

    router.post('/deleteimageprofile',people.deleteImageProfile)
    router.post('/deleteimagedriving',people.deleteImageDriving)

    
    app.use("/api/people",router);
}