const { CheckValidationRegister, CheckInputRegexOnEmpty } = require('../config/Checker');
const { HandleUploadProfil } = require('../config/UploadConfig');
const {Dashboard, Profile, ProfileV2, EditProfile} = require('../controllers/Admin/Dashboard');
const { CreateDataDosen, DataDosen, EditDataDosen, DeleteDataDosen, DataDosenSearch } = require('../controllers/Admin/KelolaData/KelolaDosen');
const { DataJam, CreateDataJam, DeleteDataJam, EditDataJam, DataJamSearch } = require('../controllers/Admin/KelolaData/KelolaJam');
const { DataKompetensi, CreateDataKompetensi, EditDataKompetensi, DeleteDataKompetensi, DataKompetensiSearch } = require('../controllers/Admin/KelolaData/KelolaKompetensi');
const { DataMahasiswa, CreateDataMahasiswa, EditDataMahasiswa, DeleteDataMahasiswa, DataMahasiswaNotVerify, AccDataMahasiswa, DataMahasiswaSearch } = require('../controllers/Admin/KelolaData/KelolaMahasiswa');
const { DataRuangan, CreateDataRuangan, EditDataRuangan, DeleteDataRuangan, DataRuanganSearch } = require('../controllers/Admin/KelolaData/KelolaRuangan');
const { DataPermintaan, DataPermintaanNotDis, CreateDataPemrintaan, AccDataPermintaan, DeleteDataPermintaan, EditDataPemrintaan, DataPermintaanBulanan, DataPermintaanSelfMahasiswaFalse, DataPermintaanSelfMahasiswaTrue, CreateDataPemrintaanMhs, DataPermintaanSearch } = require('../controllers/Admin/Permintaan');
const { ValidRoleAdmin, VerifyToken, ValidRoleMhs } = require('../controllers/Auth');
const { TotalDocument } = require('../controllers/Totals');

const router = require('express').Router();

router.get("/totalsdata",TotalDocument)
router.get("/profile",VerifyToken,Profile)
router.get("/profilev2",VerifyToken,ProfileV2)
router.get("/admin/permintaan",VerifyToken,ValidRoleAdmin,DataPermintaan)
router.get("/admin/permintaan/n/acc",VerifyToken,ValidRoleAdmin,DataPermintaanNotDis)
router.get("/admin/dashboard",VerifyToken,ValidRoleAdmin,Dashboard)
router.get("/admin/ruangan",VerifyToken,ValidRoleAdmin,DataRuangan)
router.get("/admin/mahasiswa/n/verify",VerifyToken,ValidRoleAdmin,DataMahasiswaNotVerify)
router.get("/admin/mahasiswa",VerifyToken,ValidRoleAdmin,DataMahasiswa)
router.get("/admin/dosen",VerifyToken,ValidRoleAdmin,DataDosen)
router.get("/admin/jam",VerifyToken,ValidRoleAdmin,DataJam)
router.get("/admin/kompetensi",VerifyToken,ValidRoleAdmin,DataKompetensi)
// compare value e
router.get("/mahasiswa/permintaan/self/acc",VerifyToken,ValidRoleMhs,DataPermintaanSelfMahasiswaTrue)
router.get("/mahasiswa/permintaan/self/diss",VerifyToken,ValidRoleMhs,DataPermintaanSelfMahasiswaFalse)
router.get("/mahasiswa/ruangan",VerifyToken,ValidRoleMhs,DataRuangan)
router.get("/mahasiswa/dosen",VerifyToken,ValidRoleMhs,DataDosen)
router.get("/mahasiswa/jam",VerifyToken,ValidRoleMhs,DataJam)
router.get("/mahasiswa/kompetensi",VerifyToken,ValidRoleMhs,DataKompetensi)

router.post("/admin/ruangan/add",VerifyToken,ValidRoleAdmin,CheckInputRegexOnEmpty,CreateDataRuangan)
router.post("/admin/ruangan/search",VerifyToken,ValidRoleAdmin,DataRuanganSearch)
router.post("/admin/jam/add",VerifyToken,ValidRoleAdmin,CheckInputRegexOnEmpty,CreateDataJam)
router.post("/admin/jam/search",VerifyToken,ValidRoleAdmin,DataJamSearch)
router.post("/admin/mahasiswa/add",VerifyToken,ValidRoleAdmin,CheckValidationRegister,CreateDataMahasiswa)
router.post("/admin/mahasiswa/search",VerifyToken,ValidRoleAdmin,DataMahasiswaSearch)
router.post("/admin/dosen/add",VerifyToken,ValidRoleAdmin,CheckInputRegexOnEmpty,CreateDataDosen)
router.post("/admin/dosen/search",VerifyToken,ValidRoleAdmin,DataDosenSearch)
router.post("/admin/kompetensi/add",VerifyToken,ValidRoleAdmin,CheckInputRegexOnEmpty,CreateDataKompetensi)
router.post("/admin/kompetensi/search",VerifyToken,ValidRoleAdmin,DataKompetensiSearch)
router.post("/admin/permintaan/add",VerifyToken,ValidRoleAdmin,CheckInputRegexOnEmpty,CreateDataPemrintaan)
router.post("/admin/permintaan/search",VerifyToken,ValidRoleAdmin,DataPermintaanSearch)
router.post("/admin/permintaan",VerifyToken,ValidRoleAdmin,DataPermintaanBulanan)

router.post("/mahasiswa/permintaan/add",VerifyToken,ValidRoleMhs,CheckInputRegexOnEmpty,CreateDataPemrintaanMhs)
router.post("/mahasiswa/permintaan",VerifyToken,ValidRoleMhs,DataPermintaanBulanan)

router.put("/profile/edit",VerifyToken,CheckInputRegexOnEmpty,EditProfile)
router.put("/admin/ruangan/edit/:_id",VerifyToken,ValidRoleAdmin,EditDataRuangan)
router.put("/admin/mahasiswa/edit/:_id",VerifyToken,ValidRoleAdmin,CheckValidationRegister, EditDataMahasiswa)
router.put("/admin/mahasiswa/acc/:_id",VerifyToken,ValidRoleAdmin, AccDataMahasiswa)
router.put("/admin/dosen/edit/:_id",VerifyToken,ValidRoleAdmin,EditDataDosen)
router.put("/admin/jam/edit/:_id",VerifyToken,ValidRoleAdmin,EditDataJam)
router.put("/admin/kompetensi/edit/:_id",EditDataKompetensi)
router.put("/admin/profile/edit/:_id",VerifyToken,ValidRoleAdmin,HandleUploadProfil,EditDataKompetensi)
router.put("/admin/permintaan/acc/:_id",VerifyToken,ValidRoleAdmin,AccDataPermintaan)
router.put("/admin/permintaan/edit/:_id",VerifyToken,ValidRoleAdmin,EditDataPemrintaan)

router.delete("/admin/ruangan/delete/:_id",VerifyToken,ValidRoleAdmin,DeleteDataRuangan)
router.delete("/admin/jam/delete/:_id",VerifyToken,ValidRoleAdmin,DeleteDataJam)
router.delete("/admin/mahasiswa/delete/:_id",VerifyToken,ValidRoleAdmin,DeleteDataMahasiswa)
router.delete("/admin/dosen/delete/:_id",VerifyToken,ValidRoleAdmin,DeleteDataDosen)
router.delete("/admin/kompetensi/delete/:_id",VerifyToken,ValidRoleAdmin,DeleteDataKompetensi)
router.delete("/admin/permintaan/delete/:_id",VerifyToken,ValidRoleAdmin,DeleteDataPermintaan)
router.delete("/mahasiswa/permintaan/delete/:_id",VerifyToken,ValidRoleMhs,DeleteDataPermintaan)

module.exports = router

