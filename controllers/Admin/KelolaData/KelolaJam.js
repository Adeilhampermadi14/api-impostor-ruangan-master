const { ObjectId } = require("mongodb");
const { ApiResponse } = require("../../../config/ApiResponse");
const { connectToDatabase } = require("../../../config/database");
const moment = require("moment");
module.exports = {
  DataJam: async (req, res) => {
    try {
      const db = await connectToDatabase();
      const collection = db.collection("kel_jam");
      const result = await collection.find().sort({ _id: -1 }).toArray();
      return res
        .status(200)
        .send(ApiResponse("Berhasil mendapatkan data", true, 200, result));
    } catch (error) {
      return res.status(500).json({ message: "Ada problem nih " + error });
    }
  }, DataJamSearch: async (req, res) => {
    const {keyword} = req.body
    try {
      const db = await connectToDatabase();
      const collection = db.collection("kel_jam");
      const result = await collection.find({$or: [
        { "kategori": { $regex: keyword, $options: 'i' } }]}).sort({ _id: -1 }).toArray();
      return res
        .status(200)
        .send(ApiResponse("Berhasil mendapatkan data", true, 200, result));
    } catch (error) {
      return res.status(500).json({ message: "Ada problem nih " + error });
    }
  },
  CreateDataJam: async (req, res) => {
    const data = {
      jam_mulai: req.body.jam_mulai,
      jam_selesai: req.body.jam_selesai,
    };

    try {
      if (
        moment(req.body.jam_mulai, "HH:mm", "Indonesia/Jakarta").isAfter(
          moment(data.jam_selesai, "HH:mm", "Indonesia/Jakarta")
        )
      ) {
        return res
          .status(400)
          .send(
            ApiResponse("Jam mulai lebih dari jam selesai", false, 400, [])
          );
      }
      if (
        moment(req.body.jam_mulai, "HH:mm").isBefore(moment("11:00", "HH:mm"))
      ) {
        data.kategori = "pagi";
      } else if (
        moment(req.body.jam_mulai, "HH:mm").isBefore(moment("16:00", "HH:mm"))
      ) {
        data.kategori = "siang";
      } else if (
        moment(req.body.jam_mulai, "HH:mm").isBefore(moment("19:00", "HH:mm"))
      ) {
        data.kategori = "sore";
      } else {
        data.kategori = "malam";
      }

      const db = await connectToDatabase();
      const collection = db.collection("kel_jam");
      const checkData =  await collection.findOne({
        jam_mulai: data.jam_mulai,
        jam_selesai: data.jam_selesai,
      });
 
      if (checkData) {
        return res
          .status(400)
          .send(ApiResponse("Data sudah ada", true, 400, data));
      }
      await collection.insertOne(data);
      return res
        .status(200)
        .send(ApiResponse("Berhasil membuat data", true, 200, data));
    } catch (error) {
      return res.status(500).json({ message: "Ada problem nih " + error });
    }
  },
  EditDataJam: async (req, res) => {
    const data = {
      jam_mulai: req.body.jam_mulai,
      jam_selesai: req.body.jam_selesai,
    };
    try {
      if (
        moment(req.body.jam_mulai, "HH:mm", "Indonesia/Jakarta").isAfter(
          moment(data.jam_selesai, "HH:mm", "Indonesia/Jakarta")
        )
      ) {
        return res
          .status(400)
          .send(
            ApiResponse("Jam mulai lebih dari jam selesai", false, 400, [])
          );
      }
      if (
        moment(req.body.jam_mulai, "HH:mm").isBefore(moment("11:00", "HH:mm"))
      ) {
        data.kategori = "pagi";
      } else if (
        moment(req.body.jam_mulai, "HH:mm").isBefore(moment("16:00", "HH:mm"))
      ) {
        data.kategori = "siang";
      } else if (
        moment(req.body.jam_mulai, "HH:mm").isBefore(moment("19:00", "HH:mm"))
      ) {
        data.kategori = "sore";
      } else {
        data.kategori = "malam";
      }
      const db = await connectToDatabase();
      const collection = db.collection("kel_jam");
      await collection.updateOne(
        { _id: new ObjectId(req.params._id) },
        { $set: data }
      );
      return res
        .status(200)
        .send(ApiResponse("Berhasil mengubah data", true, 200, data));
    } catch (error) {
      return res.status(500).json({ message: "Ada problem nih " + error });
    }
  },
  DeleteDataJam: async (req, res) => {
    try {
      const db = await connectToDatabase();
      const collection = db.collection("kel_jam");
      const permcoll = db.collection("kel_permintaan")
      await permcoll.deleteOne({_jamID:new ObjectId(req.params._id)})
      await collection.deleteOne({ _id: new ObjectId(req.params._id) });
      return res
        .status(200)
        .send(ApiResponse("Berhasil menghapus data", true, 200, []));
    } catch (error) {
      return res.status(500).json({ message: "Ada problem nih " + error });
    }
  },
};
