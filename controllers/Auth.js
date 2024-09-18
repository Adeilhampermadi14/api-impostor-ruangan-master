const { connectToDatabase } = require("../config/database");
const { ApiResponse } = require("../config/ApiResponse.js");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
module.exports = {
  Login: async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
      const db = await connectToDatabase();
      const collection = db.collection("user");
      const result = await collection.findOne(
        {
          username: username,
          password: password,
        },
        {
          projection: { username: 1, _id: 1 },
        }
      );
      if (result) {
        const payload = {
          username: result.username,
          _id: await result._id.toString(),
        };
        const token = jwt.sign(payload, "vladimir-handsup", {
          expiresIn: "1d",
        });
        return res
          .status(200)
          .send(
            ApiResponse("Berhasil melakukan login", true, 200, { token: token })
          );
      }

      return res
        .status(401)
        .send(ApiResponse("Username atau password salah ", false, 401, []));
    } catch (error) {
      return res.status(500).json({ message: "Ada problem nih " + error });
    }
  },
  Register: async (req, res) => {
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
      const result = await collection.findOne({
        username: data.username,
        no_wa: data.no_wa,
      });
      if (result) {
        return res
          .status(400)
          .send(
            ApiResponse(
              "Data kamu sudah di gunakan, ga yakin? lapor ke admin 🙉",
              false,
              400,
              []
            )
          );
      }
      if (data.password.length < 8) {
        return res
        .status(400)
        .send(
          ApiResponse(
            "Password harus lebih dari 8 ",
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
            "Akun kamu sudah bisa di gunakan, balas verify ku dulu ",
            true,
            200,
            []
          )
        );
    } catch (error) {
      return res
        .status(500)
        .send(ApiResponse("Ada problem nih " + error, false, 500, []));
    }
  },
  VerifyToken: (req, res, next) => {
    const { authorization } = req.headers;
    const token = authorization ? authorization.split(" ")[1] : null;
    if (!token) {
      return res.status(401).json({ message: "ini saatnya login" });
    }
    jwt.verify(token, "vladimir-handsup", (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Sesi sudah habis saatnya login" });
      } else {
        req.user = decoded;
        next();
      }
    });
  },
  Logout: async (req, res) => {
    req.session = null;
    return res
      .status(200)
      .send(ApiResponse("Logout berhasil 🙊 ", false, 200, []));
  },
  VerifyUser: async (req, res, next) => {
    const username = req.body.username;
    try {
      const db = await connectToDatabase();
      const collection = db.collection("user");
      const result = await collection.findOne({
        username: username,
        verify: false,
      });
      if (result) {
        return res
          .status(403)
          .send(
            ApiResponse(
              "Verify dulu baru bisa login, lapor ke admin 🙈 ",
              false,
 401,
              []
            )
          );
      }
      next();
    } catch (error) {
      return res.status(500).json({ message: "Ada problem nih " + error });
    }
  },
  ValidRoleAdmin: async (req, res, next) => {
    const db = await connectToDatabase();
    const collection = db.collection("user");

    const role = await collection.findOne(
      {
        _id: new ObjectId(req.user._id),
      },
      {
        projection: { role: 1 },
      }
    );

    if (role === null) {
      return res
        .status(403)
        .send(ApiResponse("Ini siapa ya ? 🙈 ", false, 403, []));
    }
    if (role.role !== "_adminX69_") {
      return res
        .status(403)
        .send(ApiResponse("Dilarang ke sini admin punya 🙈 ", false, 403, []));
    }
    next();
  },
  ValidRoleMhs: async (req, res, next) => {
    const db = await connectToDatabase();
    const collection = db.collection("user");
    const role = await collection.findOne(
      {
        _id: new ObjectId(req.user._id),
      },
      {
        projection: { role: 1 },
      }
    );
    if (role === null) {
      return res
        .status(403)
        .send(ApiResponse("Ini siapa ya ? 🙈 ", false, 403, []));
    }

    if (role.role !== "mahasiswa") {
      return res
        .status(403)
        .send(ApiResponse("Dilarang ke sini mahasiswa punya 🙈 ", false, 403, []));
    }
  
    next();
  },
  ValidUserSess: async (req, res, next) => {
    if (!req.session.isLogin) {
      return res
        .status(401)
        .send(
          ApiResponse("sesi akun kamu uzur,login lagi ya 🙊 ", false, 401, [])
        );
    }
    next();
  },
};
