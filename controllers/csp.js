const { request, response } = require("express");
const { generateJWT } = require("../helpers/generateJWT");



const getCsp = async (req = request, res= response) => {
    const { body } = req;
    res.json({
        body: body,
        msg: 'CSP'
    });
}

const cspReports = async (req = request, res= response) => {
    console.log('CSP Report');
    console.log({
        req
    })
   
    let body;

    if (req.is('application/csp-report')) body = req.body['csp-report'];
    if (req.is('application/reports+json')) body = req.body['csp-report'];

    console.log({
        body
    })
    // res.json({
    //     body: body,
    //     msg: 'reporte recibido'
    // }); 
}

const generateToken = async (req = request, res= response) => {
   
   
    const body = req.body;

 
    const jwt = generateJWT(body);
   
    res.json({
        jwt: jwt,
        msg: 'Generated Token'
    }).status(200); 
}

module.exports = {
    getCsp,
    cspReports,
    generateToken
}