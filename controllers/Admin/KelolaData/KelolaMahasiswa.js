const { ObjectId } = require("mongodb");
const { ApiResponse } = require("../../../config/ApiResponse");
const { connectToDatabase } = require("../../../config/database");
const Ngeregex = (param) => {
  if (!/^[a-zA-Z0-9\s]+$/.test(param)) {
    return true;
  }
};
module.exports = {
  DataMahasiswa: async (req, res) => {
    try {
      const db = await connectToDatabase();
      const collection = db.collection("user");
      const result = await collection
        .find({ role: "mahasiswa", verify: true })
        .sort({ _id: -1 })
        .toArray();
      return res
        .status(200)
        .send(ApiResponse("Berhasil mendapatkan data", true, 200, result));
    } catch (error) {
      return res.status(500).json({ message: "Ada problem nih " + error });
    }
  },
  DataMahasiswaSearch: async (req, res) => {
    const {keyword} = req.body
    try {
      const db = await connectToDatabase();
      const collection = db.collection("user");
      const result = await collection
        .find({ role: "mahasiswa", verify: true,$or: [
          { "mhs_name": { $regex: keyword, $options: 'i' } }] })
        .sort({ _id: -1 })
        .toArray();
      return res
        .status(200)
        .send(ApiResponse("Berhasil mendapatkan data", true, 200, result));
    } catch (error) {
      return res.status(500).json({ message: "Ada problem nih " + error });
    }
  },
  DataMahasiswaNotVerify: async (req, res) => {
    try {
      const db = await connectToDatabase();
      const collection = db.collection("user");
      const result = await collection
        .find({ role: "mahasiswa", verify: false })
        .sort({ _id: -1 })
        .toArray();
      return res
        .status(200)
        .send(ApiResponse("Berhasil mendapatkan data", true, 200, result));
    } catch (error) {
      return res.status(500).json({ message: "Ada problem nih " + error });
    }
  },
  CreateDataMahasiswa: async (req, res) => {
    const data = {
      username: req.body.username,
      mhs_name: req.body.mhs_name,
      nim: parseInt(req.body.nim),
      no_wa: parseInt(req.body.no_wa),
      password: req.body.password,
      verify: false,
      role: "mahasiswa",
      profilePath: null,
    };
    try {
      const db = await connectToDatabase();
      const collection = db.collection("user");
      const name = await collection.findOne({
        username: data.username,
       });
      const no_wa = await collection.findOne({
        no_wa: data.no_wa,
       });
      const nim = await collection.findOne({
        nim: data.nim,
       });
     
      const resultCheck = name || no_wa || nim;
      if (resultCheck) {
        return res
          .status(400)
          .send(
            ApiResponse(
              `Data sudah di gunakan atas nama ${resultCheck.mhs_name} , mohon cek kembali`,
              false,
              400,
              []
            )
          );
      }
      collection.insertOne(data);
      return res
        .status(200)
        .send(
          ApiResponse(
            "Akun mahasiswa sudah bisa di gunakan, balas verify dulu ",
            true,
            200,
            []
          )
        );
    } catch (error) {
      return res.status(500).json({ message: "Ada problem nih " + error });
    }
  },
  EditDataMahasiswa: async (req, res) => {
    const data = {
      username: req.body.username,
      mhs_name: req.body.mhs_name,
      nim: parseInt(req.body.nim),
      no_wa: parseInt(req.body.no_wa),
      password: req.body.password,
      verify: req.body.verify === true ? true : false,
      role: "mahasiswa",
    };
    try {
      const db = await connectToDatabase();
      const collection = db.collection("user");
      const name = await collection.findOne({
        username: data.username,
        _id: { $not: { $eq: new ObjectId(req.params._id) } },
      });
      const no_wa = await collection.findOne({
        no_wa: data.no_wa,
        _id: { $not: { $eq: new ObjectId(req.params._id) } },
      });
      const nim = await collection.findOne({
        nim: data.nim,
        _id: { $not: { $eq: new ObjectId(req.params._id) } },
      });
     
      const resultCheck = name || no_wa || nim;
      if (resultCheck) {
        return res
          .status(400)
          .send(
            ApiResponse(
              `Data sudah di gunakan atas nama ${resultCheck.mhs_name} , mohon cek kembali`,
              false,
              400,
              []
            )
          );
      }
      await collection.updateOne(
        { _id: new ObjectId(req.params._id) },
        { $set: data }
      );
      return res
        .status(200)
        .send(ApiResponse("Berhasil mengubah data", true, 200, data));
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Ada problem nih " + error });
    }
  },
  AccDataMahasiswa: async (req, res) => {
    const data = {
      verify: true,
    };

    try {
      const db = await connectToDatabase();
      const collection = db.collection("user");
      await collection.updateOne(
        { _id: new ObjectId(req.params._id) },
        { $set: data }
      );
      return res
        .status(200)
        .send(ApiResponse("Berhasil menerima verify mahasiswa", true, 200, []));
    } catch (error) {
      return res.status(500).json({ message: "Ada problem nih " + error });
    }
  },
  DeleteDataMahasiswa: async (req, res) => {
    try {
      const db = await connectToDatabase();
      const collection = db.collection("user");  const permcoll = db.collection("kel_permintaan")
      await permcoll.deleteOne({_mhsID:new ObjectId(req.params._id)})
    
      await collection.deleteOne({ _id: new ObjectId(req.params._id) });
      return res
        .status(200)
        .send(ApiResponse("Berhasil menghapus data", true, 200, []));
    } catch (error) {
      return res.status(500).json({ message: "Ada problem nih " + error });
    }
  },
};
