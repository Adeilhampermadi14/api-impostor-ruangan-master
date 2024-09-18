const { ObjectId } = require("mongodb");
const { ApiResponse } = require("../../config/ApiResponse");
const { connectToDatabase } = require("../../config/database");

module.exports = {
  Dashboard: async (req, res) => {
    try {
      const db = await connectToDatabase();
      const count_kom_collection = db.collection("kel_kompetensi");
      const count_kompetensi = await count_kom_collection.find().toArray();
      const count_mhs_collection = db.collection("user");
      const count_mhs = await count_mhs_collection
        .find({ role: "mahasiswa" })
        .toArray();
      const count_dosen_collection = db.collection("kel_dosen");
      const count_dosen = await count_dosen_collection.find().toArray();
      const count_ruangan_collection = db.collection("kel_ruangan");
      const count_ruangan = await count_ruangan_collection.find().toArray();
      const count_matkul_collection = db.collection("kel_dosen");
      const count_matkul = await count_matkul_collection.find().toArray();

      return res.status(200).send(
        ApiResponse("Berhasil mendapatkan data", true, 200, {
          count_ruangan: count_ruangan.length,
          count_mhs: count_mhs.length,
          count_matkul: count_matkul.length,
          count_kompetensi: count_kompetensi.length,
          count_dosen: count_dosen.length,
        })
      );
    } catch (error) {
      return res.status(500).json({ message: "Ada problem nih " + error });
    }
  },
  Profile: async (req, res) => {
    try {
      const db = await connectToDatabase();
      const collection = db.collection("user");

      const result = await collection.findOne(
        { _id: new ObjectId(req.user._id) },
        {
          projection: {
            role: 1,
            username: 1,
            profilePath: 1,
            mhs_name: 1,
            nim: 1,
            no_wa: 1,
            _id: 1,
          },
        }
      );
      return res
        .status(200)
        .send(ApiResponse("Berhasil mendapatkan data", true, 200, result));
    } catch (error) {
      return res.status(500).json({ message: "Ada problem nih " + error });
    }
  },
  ProfileV2: async (req, res) => {
    try {
      const db = await connectToDatabase();
      const collection = db.collection("user");
      const result = await collection.findOne(
        { _id: new ObjectId(req.user._id) },
        {
          projection: {
            username: 1,
            profilePath: 1,
            mhs_name: 1,
            nim: 1,
            password:1,
            no_wa: 1,
            _id:0
          },
        }
      );
      return res
        .status(200)
        .send(ApiResponse("Berhasil mendapatkan data", true, 200, result));
    } catch (error) {
      return res.status(500).json({ message: "Ada problem nih " + error });
    }
  }
  
  ,EditProfile: async (req, res) => {
    const data = {
      username: req.body.username,
      mhs_name: req.body.mhs_name,
      nim: parseInt(req.body.nim),
      no_wa: parseInt(req.body.no_wa),
      password: req.body.password,
    };
    try {
      const db = await connectToDatabase();
      const collection = db.collection("user");
      const name = await collection.findOne({
        username: data.username,
        _id: { $not: { $eq: new ObjectId(req.user._id) } },
      });
      const no_wa = await collection.findOne({
        no_wa: data.no_wa,
        _id: { $not: { $eq: new ObjectId(req.user._id) } },
      });
      const nim = await collection.findOne({
        nim: data.nim,
        _id: { $not: { $eq: new ObjectId(req.user._id) } },
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
        { _id: new ObjectId(req.user._id) },
        { $set: data }
      );
      return res
        .status(200)
        .send(ApiResponse("Berhasil mengubah data", true, 200, data));
    } catch (error) {
      return res.status(500).json({ message: "Ada problem nih " + error });
    }
  }
};
