const { ObjectId } = require("mongodb");
const { ApiResponse } = require("../../../config/ApiResponse");
const { connectToDatabase } = require("../../../config/database");

module.exports = {
  DataKompetensi: async (req, res) => {
    try {
      const db = await connectToDatabase();
      const collection = db.collection("kel_kompetensi");
      const result = await collection.find().sort({ _id: -1 }).toArray();
      return res
        .status(200)
        .send(ApiResponse("Berhasil mendapatkan data", true, 200, result));
    } catch (error) {
      return res.status(500).json({ message: "Ada problem nih " + error });
    }
  },
  DataKompetensiSearch: async (req, res) => {
    const {keyword} = req.body
    try {
      const db = await connectToDatabase();
      const collection = db.collection("kel_kompetensi");
      const result = await collection.find({$or: [
        { "nama_kompetensi": { $regex: keyword, $options: 'i' } }]}).sort({ _id: -1 }).toArray();
      return res
        .status(200)
        .send(ApiResponse("Berhasil mendapatkan data", true, 200, result));
    } catch (error) {
      return res.status(500).json({ message: "Ada problem nih " + error });
    }
  },
  CreateDataKompetensi: async (req, res) => {
    const data = {
      nama_kompetensi: req.body.nama_kompetensi,
    };
    try {
      const db = await connectToDatabase();
      const collection = db.collection("kel_kompetensi");
      await collection.insertOne(data);
      return res
        .status(200)
        .send(ApiResponse("Berhasil membuat data", true, 200, data));
    } catch (error) {
      return res.status(500).json({ message: "Ada problem nih " + error });
    }
  },
  EditDataKompetensi: async (req, res) => {
    const data = {
      nama_kompetensi: req.body.nama_kompetensi,
    };
    try {
      const db = await connectToDatabase();
      const collection = db.collection("kel_kompetensi");
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
  DeleteDataKompetensi: async (req, res) => {
    try {
      const db = await connectToDatabase();
      const collection = db.collection("kel_kompetensi");
      const permcoll = db.collection("kel_permintaan")
      await permcoll.deleteOne({_kompetensiID:new ObjectId(req.params._id)})
    
      await collection.deleteOne({ _id: new ObjectId(req.params._id) });
      return res
        .status(200)
        .send(ApiResponse("Berhasil menghapus data", true, 200, []));
    } catch (error) {
      return res.status(500).json({ message: "Ada problem nih " + error });
    }
  },
};
