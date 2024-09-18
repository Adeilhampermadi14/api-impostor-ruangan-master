const  {ObjectId}  = require("mongodb");
const { ApiResponse } = require("../../../config/ApiResponse");
const { connectToDatabase } = require("../../../config/database");

module.exports = {
  DataDosen: async (req, res) => {
    try {
      const db = await connectToDatabase();
      const collection = db.collection("kel_dosen");
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
  DataDosenSearch: async (req, res) => {
    const {keyword} = req.body
    try {
      const db = await connectToDatabase();
      const collection = db.collection("kel_dosen");
      const result = await collection.find({$or: [
        { "nama_dosen": { $regex: keyword, $options: 'i' } }]}).sort({_id:-1}).toArray();
 
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
  CreateDataDosen: async (req, res) => {
    const data = {
        nama_dosen:req.body.nama_dosen,
        matkul: req.body.matkul
    }
    try {
      const db = await connectToDatabase();
      const collection = db.collection("kel_dosen");
      const checkData = await collection.findOne({  nama_dosen:data.nama_dosen,
        matkul: data.matkul})
 
        if (checkData) {
          return res
          .status(400)
          .send(
            ApiResponse("Data sudah ada", true, 400,
              data
            )
          );
        }
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
  EditDataDosen: async (req, res) => {
    const data = {
      nama_dosen:req.body.nama_dosen,
      matkul: req.body.matkul
  }
    try {
      const db = await connectToDatabase();
      const collection = db.collection("kel_dosen");
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
  DeleteDataDosen: async (req, res) => {
    try {
      const db = await connectToDatabase();
      const collection = db.collection("kel_dosen");
      const permcoll = db.collection("kel_permintaan")
      await permcoll.deleteOne({_dosenID:new ObjectId(req.params._id)})
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
