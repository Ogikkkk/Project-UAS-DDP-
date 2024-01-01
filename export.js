let siswa = {
    nama: "Ogagik Bersatu",
    nilai: 90,
    status: true
}

let siswa_string = JSON.stringify(siswa)

console.log("Text string siswa:", siswa_string)


let ogagik_json = '{"nama":"Ogagik Bersatu","nilai":90,"status":true}';

let data_siswa = '[{"nama":"Ogagik","nilai":90,"status":false},{"nama":"Yoga","nilai":85,"status":true}]'


let daftar_siswa = JSON.parse(data_siswa)

console.log("Array daftar_siswa: ", daftar_siswa)

let nama = "Yoga"
let bilangan = 10
console.log(JSON.stringify(bilangan))