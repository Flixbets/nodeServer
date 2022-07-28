const db = require("../models");
const setstatus = db.setstatus;
const people = db.people;

exports.createStatus = async (req, res) => {
    inputStatus = req.body.status;
    setstatus.findOne({ where: { status: inputStatus } }).then(async (check) => {
        if (check) {
            res.status(400).send({
                status: 400,
                message: "Failed! Status is already in use!"
            });
            return;
        }
        return await setstatus.create({ status: inputStatus })
            .then(data => {
                res.status(200).send({ status: true });
            })
            .catch(err => {
                res.status(500).send({
                    status: 500,
                    message:
                        err.message || "Some error occurred while creating the Status."
                });
            });
    });



};

exports.getAllStatus = async (req, res) => {
    setstatus.findAll()
        .then(data => {
            res.send(data);
        }).catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Status."
            });
        });
}

exports.getOneStatus = (req, res) => {
    setstatus.findOne({ where: { status: req.body.status } })
        .then(setstatus => {
            if (!setstatus) {
                return res.status(404).send({ message: "Status Not found." });
            }
            res.status(200).send({ setstatus });
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Status."
            });
        });

}

exports.updateStatus = async (req, res) => {
    const id = req.params.id;
    setstatus.update(req.body, {
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.send({
                    message: "Status was updated successfully."
                });
            } else {
                res.send({
                    message: `Cannot update Status with id=${id}. Maybe Question was not found or req.body is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Status with id=" + id
            });
        });
}

exports.deleteStatus = (req, res) => {
    const id = req.params.id;

    setstatus.destroy({
        where: { id: id }
    })
        .then(async () => {
            try {
                let string = JSON.stringify(await people.findAll({ where: { setstatusId: null } }));
                let list_data = JSON.parse(string);
                for (let i in list_data) {
                    people.update({ setstatusId: 1 }, {
                        where: { id: list_data[i].id }
                    })

                }
                people.findAll({ where: { setstatusId: null } })
                res.status(200).send({
                    message: "Status was deleted successfully!"
                });
            } catch (err) {

            }

        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Status with id=" + id
            });
        });
};

exports.updateStatus1 = async (req, res) => {


    people.findAll({ where: { setstatusId: null } }).then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err
        });
    })


    // setstatus.update(req.body, {
    //     where: { id: id }
    // })
    //     .then(num => {
    //         if (num == 1) {
    //             res.send({
    //                 message: "Status was updated successfully."
    //             });
    //         } else {
    //             res.send({
    //                 message: `Cannot update Status with id=${id}. Maybe Question was not found or req.body is empty!`
    //             });
    //         }
    //     })
    //     .catch(err => {
    //         res.status(500).send({
    //             message: "Error updating Status with id=" + id
    //         });
    //     });
}

