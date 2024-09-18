const { ApiResponse } = require("./ApiResponse");

const Ngeregex = (param) => {
  if (!/^[a-zA-Z0-9\s:.,-]+$/.test(param)) {
    return true;
  }
};

module.exports = {
  CheckValidationAuth: async (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;
    if (username === "" || password === "") {
      return res
        .status(401)
        .send(
          ApiResponse(
            "Username dan password tidak boleh kosong.",
            false,
            401,
            []
          )
        );
    }

    if (Ngeregex(username) || Ngeregex(password)) {
      return res
        .status(401)
        .send(
          ApiResponse(
            "Username dan password hanya boleh mengandung huruf dan angka.",
            false,
            401,
            []
          )
        );
    }
    next();
  },
  CheckInputRegexOnEmpty: async (req, res, next) => {
    const check = req.body;
    let hasError = false;
    let hasRegex = false;
    const antiCheck = ["profilePath"];

    antiCheck.forEach((res) => {
      delete check[res];
    });

    Object.values(check).forEach((value, key) => {
 
      if (value === "" || value === null) {
        hasError = true;
      } else if (Ngeregex(value)) {
        hasRegex = true;
      }
    });

    if (hasError) {
      return res
        .status(400)
        .send(ApiResponse("Data tidak boleh kosong", false, 400, []));
    }
    if (hasRegex) {
      return res
        .status(400)
        .send(
          ApiResponse("Data tidak boleh mengandung karakter", false, 400, [])
        );
    }
    next();
  },

  CheckValidationRegister: async (req, res, next) => {
    const username = req.body.username;
    const mhs_name = req.body.mhs_name;
    const nim = parseInt(req.body.nim);
    const no_wa = parseInt(req.body.no_wa);
    const password = req.body.password;
    if (!nim || !no_wa || !username || !mhs_name || !password) {
      return res
        .status(400)
        .send(ApiResponse("Data tidak boleh kosong", false, 400, []));
    }
    if (!nim || !no_wa) {
      return res
        .status(400)
        .send(
          ApiResponse(
            "nim atau whatsapp harus menggunakan angka jangan 0 juga 🙉",
            false,
            400,
            []
          )
        );
    }
    if (!username || !password || !mhs_name) {
      return res
        .status(400)
        .send(ApiResponse("form input tidak boleh kosong.", false, 400, []));
    }
    if (
      Ngeregex(username) ||
      Ngeregex(password) ||
      Ngeregex(no_wa) ||
      Ngeregex(nim) ||
      Ngeregex(mhs_name)
    ) {
      return res
        .status(400)
        .send(
          ApiResponse(
            "Username dan password hanya boleh mengandung huruf dan angka.",
            false,
            400,
            []
          )
        );
    }
    next();
  },
};
