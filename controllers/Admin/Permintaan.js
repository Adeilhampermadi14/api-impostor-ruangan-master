const { ObjectId } = require("mongodb");
const { ApiResponse } = require("../../config/ApiResponse");
const { connectToDatabase } = require("../../config/database");
const Ngeregex = (param) => {
  if (!/^[a-zA-Z0-9\s]+$/.test(param)) {
    return true;
  }
};
const moment = require("moment");
module.exports = {
  DataPermintaan: async (req, res) => {
    try {
      const db = await connectToDatabase();
      const collection = db.collection("kel_permintaan");
      const result = await collection
        .aggregate([
          {
            $lookup: {
              from: "user",
              localField: "_mhsID",
              foreignField: "_id",
              as: "mahasiswa",
            },
          },
          {
            $lookup: {
              from: "kel_dosen",
              localField: "_dosenID",
              foreignField: "_id",
              as: "dosen",
            },
          },
          {
            $lookup: {
              from: "kel_kompetensi",
              localField: "_kompetensiID",
              foreignField: "_id",
              as: "kompetensi",
            },
          },
          {
            $lookup: {
              from: "kel_ruang",
              localField: "_ruanganID",
              foreignField: "_id",
              as: "ruangan",
            },
          },
          {
            $lookup: {
              from: "kel_jam",
              localField: "_jamID",
              foreignField: "_id",
              as: "jam",
            },
          },
          {
            $match: {
              status_permintaan: {
                $not: { $eq: false },
              },
              tanggal: {
                $gte: moment()
                  .subtract(1, "week")
                  .startOf("day")
                  .format("YYYY-MM-DD"),
              },
            },
          },
          {
            $sort: { _id: -1 },
          },
          { $unwind: "$mahasiswa" },
          { $unwind: "$dosen" },
          { $unwind: "$ruangan" },
          { $unwind: "$kompetensi" },
          { $unwind: "$jam" },
          {
            $project: {
              mahasiswa: { username: 1, profilPath: 1 },
              "dosen.nama_dosen": 1,
              "kompetensi.nama_kompetensi": 1,
              ruangan: { nama_ruangan: 1, lantai: 1 },
              jam: { jam_mulai: 1, jam_selesai: 1 },
              tanggal: 1,
              status_permintaan: 1,
              _mhsID: 1,
              _dosenID: 1,
              _kompetensiID: 1,
              _ruanganID: 1,
              _jamID: 1,
            },
          },
        ])
        .toArray();
      return res
        .status(200)
        .send(ApiResponse("Berhasil mendapatkan data", true, 200, result));
    } catch (error) {
      return res.status(500).json({ message: "Ada problem nih " + error });
    }
  },
  DataPermintaanSearch: async (req, res) => {
    const {keyword} = req.body
    try {
      const db = await connectToDatabase();
      const collection = db.collection("kel_permintaan");
      const result = await collection
        .aggregate([
          {
            $lookup: {
              from: "user",
              localField: "_mhsID",
              foreignField: "_id",
              as: "mahasiswa",
            },
          },
          {
            $lookup: {
              from: "kel_dosen",
              localField: "_dosenID",
              foreignField: "_id",
              as: "dosen",
            },
          },
          {
            $lookup: {
              from: "kel_kompetensi",
              localField: "_kompetensiID",
              foreignField: "_id",
              as: "kompetensi",
            },
          },
          {
            $lookup: {
              from: "kel_ruang",
              localField: "_ruanganID",
              foreignField: "_id",
              as: "ruangan",
            },
          },
          {
            $lookup: {
              from: "kel_jam",
              localField: "_jamID",
              foreignField: "_id",
              as: "jam",
            },
          },
          {
            $match: {
              status_permintaan: {
                $not: { $eq: false },
              },
              $or: [
                { "mahasiswa.mhs_name": { $regex: keyword, $options: 'i' } }],
              tanggal: {
                $gte: moment()
                  .subtract(1, "week")
                  .startOf("day")
                  .format("YYYY-MM-DD"),
              },
            },
          },
          {
            $sort: { _id: -1 },
          },
          { $unwind: "$mahasiswa" },
          { $unwind: "$dosen" },
          { $unwind: "$ruangan" },
          { $unwind: "$kompetensi" },
          { $unwind: "$jam" },
          {
            $project: {
              mahasiswa: { username: 1, profilPath: 1 },
              "dosen.nama_dosen": 1,
              "kompetensi.nama_kompetensi": 1,
              ruangan: { nama_ruangan: 1, lantai: 1 },
              jam: { jam_mulai: 1, jam_selesai: 1 },
              tanggal: 1,
              status_permintaan: 1,
              _mhsID: 1,
              _dosenID: 1,
              _kompetensiID: 1,
              _ruanganID: 1,
              _jamID: 1,
            },
          },
        ])
        .toArray();
      return res
        .status(200)
        .send(ApiResponse("Berhasil mendapatkan data", true, 200, result));
    } catch (error) {
      return res.status(500).json({ message: "Ada problem nih " + error });
    }
  },
  DataPermintaanBulanan: async (req, res) => {
    try {
      const db = await connectToDatabase();
      const collection = db.collection("kel_permintaan");

      const result = await collection
        .aggregate([
          {
            $lookup: {
              from: "user",
              localField: "_mhsID",
              foreignField: "_id",
              as: "mahasiswa",
            },
          },
          {
            $lookup: {
              from: "kel_dosen",
              localField: "_dosenID",
              foreignField: "_id",
              as: "dosen",
            },
          },
          {
            $lookup: {
              from: "kel_kompetensi",
              localField: "_kompetensiID",
              foreignField: "_id",
              as: "kompetensi",
            },
          },
          {
            $lookup: {
              from: "kel_ruang",
              localField: "_ruanganID",
              foreignField: "_id",
              as: "ruangan",
            },
          },
          {
            $lookup: {
              from: "kel_jam",
              localField: "_jamID",
              foreignField: "_id",
              as: "jam",
            },
          },
          {
            $match: {
              status_permintaan: {
                $not: { $eq: false },
              },
              tanggal: {
                $gte: req.body.startDate
      ? req.body.startDate
      : moment().subtract(3, "month").startOf("day").format("YYYY-MM-DD"),
    ...(req.body.endDate && { $lt: req.body.endDate })
              },
            },
          },
          {
            $sort: { _id: -1 },
          },
          { $unwind: "$mahasiswa" },
          { $unwind: "$dosen" },
          { $unwind: "$ruangan" },
          { $unwind: "$kompetensi" },
          { $unwind: "$jam" },
          {
            $project: {
              _id: 0,
              mahasiswa: "$mahasiswa.username",
              nim: "$mahasiswa.nim",
              dosen: "$dosen.nama_dosen",
              kompetensi: "$kompetensi.nama_kompetensi",
              ruangan: "$ruangan.nama_ruangan",
              jam_mulai: "$jam.jam_mulai",
              jam_selesai: "$jam.jam_selesai",
              tanggal: 1,
            },
          },
        ])
        .toArray();
      
      return res
        .status(200)
        .send(ApiResponse("Berhasil mendapatkan data", true, 200, result));
    } catch (error) {
      return res.status(500).json({ message: "Ada problem nih " + error });
    }
  },
  DataPermintaanKompetensiBulanan: async (req, res) => {
    try {
      const db = await connectToDatabase();
      const collection = db.collection("kel_permintaan");

      const result = await collection
        .aggregate([
          {
            $lookup: {
              from: "user",
              localField: "_mhsID",
              foreignField: "_id",
              as: "mahasiswa",
            },
          },
          {
            $lookup: {
              from: "kel_dosen",
              localField: "_dosenID",
              foreignField: "_id",
              as: "dosen",
            },
          },
          {
            $lookup: {
              from: "kel_kompetensi",
              localField: "_kompetensiID",
              foreignField: "_id",
              as: "kompetensi",
            },
          },
          {
            $lookup: {
              from: "kel_ruang",
              localField: "_ruanganID",
              foreignField: "_id",
              as: "ruangan",
            },
          },
          {
            $lookup: {
              from: "kel_jam",
              localField: "_jamID",
              foreignField: "_id",
              as: "jam",
            },
          },
          {
            $match: {
              status_permintaan: {
                $not: { $eq: false },
              },
              tanggal: {
                $gte: req.body.startDate
                  ? req.body.startDate
                  : moment()
                      .subtract(3, "month")
                      .startOf("day")
                      .format("YYYY-MM-DD"),
                $lt: req.body.endDate
                  ? req.body.endDate
                  : moment().startOf("day").format("YYYY-MM-DD"),
              },
            },
          },
          {
            $sort: { _id: -1 },
          },
          { $unwind: "$mahasiswa" },
          { $unwind: "$dosen" },
          { $unwind: "$ruangan" },
          { $unwind: "$kompetensi" },
          { $unwind: "$jam" },
          {
            $project: {
              _id: 0,
              mahasiswa: "$mahasiswa.username",
              nim: "$mahasiswa.nim",
              dosen: "$dosen.nama_dosen",
              kompetensi: "$kompetensi.nama_kompetensi",
              ruangan: "$ruangan.nama_ruangan",
              jam_mulai: "$jam.jam_mulai",
              jam_selesai: "$jam.jam_selesai",
              tanggal: 1,
            },
          },
        ])
        .toArray();
      
      return res
        .status(200)
        .send(ApiResponse("Berhasil mendapatkan data", true, 200, result));
    } catch (error) {
      return res.status(500).json({ message: "Ada problem nih " + error });
    }
  },
  DataPermintaanSelfMahasiswaTrue: async (req, res) => {
    try {
      const db = await connectToDatabase();
      const collection = db.collection("kel_permintaan");

      const result = await collection
        .aggregate([
          {
            $lookup: {
              from: "user",
              localField: "_mhsID",
              foreignField: "_id",
              as: "mahasiswa",
            },
          },
          {
            $lookup: {
              from: "kel_dosen",
              localField: "_dosenID",
              foreignField: "_id",
              as: "dosen",
            },
          },
          {
            $lookup: {
              from: "kel_kompetensi",
              localField: "_kompetensiID",
              foreignField: "_id",
              as: "kompetensi",
            },
          },
          {
            $lookup: {
              from: "kel_ruang",
              localField: "_ruanganID",
              foreignField: "_id",
              as: "ruangan",
            },
          },
          {
            $lookup: {
              from: "kel_jam",
              localField: "_jamID",
              foreignField: "_id",
              as: "jam",
            },
          },
          {
            $match: {
              status_permintaan: {
                $not: { $eq: false },
           
              },
           _mhsID:{$eq:new ObjectId(req.user._id)},
              tanggal: {
                $gte: moment()
                      .subtract(3, "month")
                      .startOf("day")
                      .format("YYYY-MM-DD"),
              
              },
            },
          },
          {
            $sort: { _id: -1 },
          },
          { $unwind: "$mahasiswa" },
          { $unwind: "$dosen" },
          { $unwind: "$ruangan" },
          { $unwind: "$kompetensi" },
          { $unwind: "$jam" },
          {
            $project: {
              _id: 1,
              mahasiswa: "$mahasiswa.username",
              nim: "$mahasiswa.nim",
              dosen: "$dosen.nama_dosen",
              kompetensi: "$kompetensi.nama_kompetensi",
              ruangan: "$ruangan.nama_ruangan",
              jam_mulai: "$jam.jam_mulai",
              jam_selesai: "$jam.jam_selesai",
              tanggal: 1,
              status_permintaan:1
            },
          },
        ])
        .toArray();
 
      return res
        .status(200)
        .send(ApiResponse("Berhasil mendapatkan data", true, 200, result));
    } catch (error) {
      return res.status(500).json({ message: "Ada problem nih " + error });
    }
  },
  DataPermintaanSelfMahasiswaFalse: async (req, res) => {
    try {
      const db = await connectToDatabase();
      const collection = db.collection("kel_permintaan");

      const result = await collection
        .aggregate([
          {
            $lookup: {
              from: "user",
              localField: "_mhsID",
              foreignField: "_id",
              as: "mahasiswa",
            },
          },
          {
            $lookup: {
              from: "kel_dosen",
              localField: "_dosenID",
              foreignField: "_id",
              as: "dosen",
            },
          },
          {
            $lookup: {
              from: "kel_kompetensi",
              localField: "_kompetensiID",
              foreignField: "_id",
              as: "kompetensi",
            },
          },
          {
            $lookup: {
              from: "kel_ruang",
              localField: "_ruanganID",
              foreignField: "_id",
              as: "ruangan",
            },
          },
          {
            $lookup: {
              from: "kel_jam",
              localField: "_jamID",
              foreignField: "_id",
              as: "jam",
            },
          },
          {
            $match: {
              status_permintaan: {
                $not: { $eq: true },
             
              },
              _mhsID:{$eq:new ObjectId(req.user._id)},
              tanggal: {
                $gte: req.body.startDate
                  ? req.body.startDate
                  : moment()
                      .subtract(3, "month")
                      .startOf("day")
                      .format("YYYY-MM-DD"),
               },
            },
          },
          {
            $sort: { _id: -1 },
          },
          { $unwind: "$mahasiswa" },
          { $unwind: "$dosen" },
          { $unwind: "$ruangan" },
          { $unwind: "$kompetensi" },
          { $unwind: "$jam" },
          {
            $project: {
              _id: 1,
              mahasiswa: "$mahasiswa.username",
              nim: "$mahasiswa.nim",
              dosen: "$dosen.nama_dosen",
              kompetensi: "$kompetensi.nama_kompetensi",
              ruangan: "$ruangan.nama_ruangan",
              jam_mulai: "$jam.jam_mulai",
              jam_selesai: "$jam.jam_selesai",
              tanggal: 1,
              status_permintaan:1
            },
          },
        ])
        .toArray();
      
      return res
        .status(200)
        .send(ApiResponse("Berhasil mendapatkan data", true, 200, result));
    } catch (error) {
      return res.status(500).json({ message: "Ada problem nih " + error });
    }
  },
  DataPermintaanNotDis: async (req, res) => {
    try {
      const db = await connectToDatabase();
      const collection = db.collection("kel_permintaan");
      const result = await collection
        .aggregate([
          {
            $lookup: {
              from: "user",
              localField: "_mhsID",
              foreignField: "_id",
              as: "mahasiswa",
            },
          },
          {
            $lookup: {
              from: "kel_dosen",
              localField: "_dosenID",
              foreignField: "_id",
              as: "dosen",
            },
          },
          {
            $lookup: {
              from: "kel_kompetensi",
              localField: "_kompetensiID",
              foreignField: "_id",
              as: "kompetensi",
            },
          },
          {
            $lookup: {
              from: "kel_ruang",
              localField: "_ruanganID",
              foreignField: "_id",
              as: "ruangan",
            },
          },
          {
            $lookup: {
              from: "kel_jam",
              localField: "_jamID",
              foreignField: "_id",
              as: "jam",
            },
          },
          {
            $match: {
              status_permintaan: {
                $not: { $eq: true },
              },
              tanggal: {
                $gte: moment()
                  .subtract(1, "week")
                  .startOf("day")
                  .format("YYYY-MM-DD"),
              },
            },
          },
          {
            $sort: { _id: -1 },
          },
          { $unwind: "$mahasiswa" },
          { $unwind: "$dosen" },
          { $unwind: "$ruangan" },
          { $unwind: "$kompetensi" },
          { $unwind: "$jam" },
          {
            $project: {
              "mahasiswa.username": 1,
              "dosen.nama_dosen": 1,
              "kompetensi.nama_kompetensi": 1,

              ruangan: { nama_ruangan: 1, lantai: 1 },
              jam: { jam_mulai: 1, jam_selesai: 1 },
              tanggal: 1,
              status_permintaan: 1,
            },
          },
        ])
        .toArray();
      
      return res
        .status(200)
        .send(ApiResponse("Berhasil mendapatkan data", true, 200, result));
    } catch (error) {
      return res.status(500).json({ message: "Ada problem nih " + error });
    }
  },
  CreateDataPemrintaan: async (req, res) => {
    const data = {
      _mhsID: new ObjectId(req.body._mhsID),
      _dosenID: new ObjectId(req.body._dosenID),
      _kompetensiID: new ObjectId(req.body._kompetensiID),
      _ruanganID: new ObjectId(req.body._ruanganID),
      _jamID: new ObjectId(req.body._jamID),
      tanggal: req.body.tanggal,
      status_permintaan: false,
    };
    try {
      const db = await connectToDatabase();
      const collection = db.collection("kel_permintaan");
      const checkPermintaan = await collection.findOne({
        _mhsID: data._mhsID,
        _dosenID: data._dosenID,
        _kompetensiID: data._kompetensiID,
        _ruanganID: data._ruanganID,
        _jamID: data._jamID,
        tanggal: data.tanggal,
      });

      if (checkPermintaan) {
        return res
          .status(400)
          .send(ApiResponse("Mahasiswa ini sudah terdaftar", false, 400, []));
      }
      if (moment(data.tanggal).isBefore(moment(), "day")) {
        return res
          .status(400)
          .send(
            ApiResponse("Dilarang menggunakan hari kemarin", true, 400, [])
          );
      }
      collection.insertOne(data);
      return res
        .status(200)
        .send(ApiResponse("Berhasil membuat data", true, 200, []));
    } catch (error) {
      return res.status(500).json({ message: "Ada problem nih " + error });
    }
  },
  CreateDataPemrintaanMhs: async (req, res) => {
    const data = {
      _mhsID: new ObjectId(req.user._id),
      _dosenID: new ObjectId(req.body._dosenID),
      _kompetensiID: new ObjectId(req.body._kompetensiID),
      _ruanganID: new ObjectId(req.body._ruanganID),
      _jamID: new ObjectId(req.body._jamID),
      tanggal: req.body.tanggal,
      status_permintaan: false,
    };
    try {
      const db = await connectToDatabase();
      const collection = db.collection("kel_permintaan");
      const checkPermintaan = await collection.findOne({
        _mhsID: data._mhsID,
        _dosenID: data._dosenID,
        _kompetensiID: data._kompetensiID,
        _ruanganID: data._ruanganID,
        _jamID: data._jamID,
        tanggal: data.tanggal,
      });

      if (checkPermintaan) {
        return res
          .status(400)
          .send(ApiResponse("Mahasiswa ini sudah terdaftar", false, 400, []));
      }
      if (moment(data.tanggal).isBefore(moment(), "day")) {
        return res
          .status(400)
          .send(
            ApiResponse("Dilarang menggunakan hari kemarin", true, 400, [])
          );
      }
      collection.insertOne(data);
      return res
        .status(200)
        .send(ApiResponse("Berhasil membuat data", true, 200, []));
    } catch (error) {
      return res.status(500).json({ message: "Ada problem nih " + error });
    }
  },
  EditDataPemrintaan: async (req, res) => {
    const data = {
      _mhsID: new ObjectId(req.body._mhsID),
      _dosenID: new ObjectId(req.body._dosenID),
      _kompetensiID: new ObjectId(req.body._kompetensiID),
      _ruanganID: new ObjectId(req.body._ruanganID),
      _jamID: new ObjectId(req.body._jamID),
      tanggal: req.body.tanggal,
    };
    try {
      const db = await connectToDatabase();
      const collection = db.collection("kel_permintaan");

      await collection.updateOne(
        { _id: new ObjectId(req.params._id) },
        { $set: data }
      );
      return res
        .status(200)
        .send(ApiResponse("Berhasil mengubah data", true, 200, []));
    } catch (error) {
      return res.status(500).json({ message: "Ada problem nih " + error });
    }
  },
  AccDataPermintaan: async (req, res) => {
    const data = {
      status_permintaan: true,
    };

    try {
      const db = await connectToDatabase();
      const collection = db.collection("kel_permintaan");
      await collection.updateOne(
        { _id: new ObjectId(req.params._id) },
        { $set: data }
      );
      return res
        .status(200)
        .send(
          ApiResponse("Berhasil menerima permintaan mahasiswa", true, 200, [])
        );
    } catch (error) {
      return res.status(500).json({ message: "Ada problem nih " + error });
    }
  },
  DeleteDataPermintaan: async (req, res) => {
    try {
      const db = await connectToDatabase();
      const collection = db.collection("kel_permintaan");
   
      await collection.deleteOne({ _id: new ObjectId(req.params._id) });
      return res
        .status(200)
        .send(ApiResponse("Berhasil menghapus data", true, 200, []));
    } catch (error) {
      return res.status(500).json({ message: "Ada problem nih " + error });
    }
  },
};
