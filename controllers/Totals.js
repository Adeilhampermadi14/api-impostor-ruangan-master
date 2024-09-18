const { connectToDatabase } = require("../config/database.js");
const { ApiResponse } = require("../config/ApiResponse.js");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
module.exports = {
  TotalDocument: async (req, res, next) => {
    try {
      const db = await connectToDatabase();
      const mhscollection = db.collection("user");
      const dosencollection = db.collection("kel_dosen");
      const kompecollection = db.collection("kel_kompetensi");
      const ruangcollection = db.collection("kel_ruang");
      const mhs = await mhscollection.countDocuments({
        role:{$ne:  "_adminX69_"}
      });
      const dosen = await dosencollection.countDocuments();
      const kompe = await kompecollection.countDocuments();
      const ruang = await ruangcollection.countDocuments();
      return res.status(200).send(
        ApiResponse("Berhasil mendapatkan data", false, 200, [
          {
            total_mahasiswa: mhs,
            total_dosen: dosen,
            total_kompetensi: kompe,
            total_matkul: dosen,
            total_ruangan: ruang,
          },
        ])
      );
    } catch (error) {
      return res.status(500).json({ message: "Ada problem nih " + error });
    }
  },
};
