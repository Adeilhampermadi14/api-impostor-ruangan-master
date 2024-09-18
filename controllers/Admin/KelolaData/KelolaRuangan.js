const  {ObjectId}  = require("mongodb");
const { ApiResponse } = require("../../../config/ApiResponse");
const { connectToDatabase } = require("../../../config/database");

module.exports = {
  DataRuangan: async (req, res) => {
    try {
      const db = await connectToDatabase();
      const collection = db.collection("kel_ruang");
      const result = await collection.find().sort({_id:-1}).toArray();
      return res
        .status(200)
        .send(
          ApiResponse("Berhasil mendapatkan data", true, 200,
            result
          )
        );
    } catch (error) {
      return res.status(500).json({ message: "Ada problem nih " + error });
    }
  },
  DataRuanganSearch: async (req, res) => {
    const {keyword} = req.body
    try {
      const db = await connectToDatabase();
      const collection = db.collection("kel_ruang");
      const result = await collection.find( {$or: [
        { "nama_ruangan": { $regex: keyword, $options: 'i' } }]}).sort({_id:-1}).toArray();
 
        return res
        .status(200)
        .send(
          ApiResponse("Berhasil mendapatkan data", true, 200,
            result
          )
        );
    } catch (error) {
      return res.status(500).json({ message: "Ada problem nih " + error });
    }
  },
  CreateDataRuangan: async (req, res) => {
    const data = {
        nama_ruangan:req.body.nama_ruangan,
        lantai: req.body.lantai
    }
    try {
      const db = await connectToDatabase();
      const collection = db.collection("kel_ruang");
      await collection.insertOne(data)
      return res
        .status(200)
        .send(
          ApiResponse("Berhasil membuat data", true, 200,
            data
          )
        );
    } catch (error) {
      return res.status(500).json({ message: "Ada problem nih " + error });
    }
  },
  EditDataRuangan: async (req, res) => {
    const data = {
        nama_ruangan:req.body.nama_ruangan,
        lantai: req.body.lantai
    }
    try {
      const db = await connectToDatabase();
      const collection = db.collection("kel_ruang");
      await collection.updateOne({_id:new ObjectId(req.params._id)},{$set:data})
      return res
        .status(200)
        .send(
          ApiResponse("Berhasil mengubah data", true, 200,
            data
          )
        );
    } catch (error) {
      return res.status(500).json({ message: "Ada problem nih " + error });
    }
  },
  DeleteDataRuangan: async (req, res) => {
    try {
      const db = await connectToDatabase();
      const collection = db.collection("kel_ruang");
      const permcoll = db.collection("kel_permintaan")
      await permcoll.deleteOne({_ruanganID:new ObjectId(req.params._id)})
      await collection.deleteOne({_id:new ObjectId(req.params._id)})
      return res
        .status(200)
        .send(
          ApiResponse("Berhasil menghapus data", true, 200,
            []
          )
        );
    } catch (error) {
      return res.status(500).json({ message: "Ada problem nih " + error });
    }
  },
};
