const config = {
    user: 'TCAClogin',
    password: 'Yum@1160',
    server: 'localhost\\SQLEXPRESS01',
    database: 'FJV_TCAC',
    options: {
        trustServerCertificate: true,
        enableArithAbort: true,
        instancename: 'SQLEXPRESS01'
    },
    port: 1433
}

module.exports = config;