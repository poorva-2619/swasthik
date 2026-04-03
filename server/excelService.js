const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

const EXCEL_FILE_PATH = path.join(__dirname, 'logs', 'diagnoses.xlsx');

const initializeExcel = async () => {
    // Ensure logs directory exists
    const dir = path.dirname(EXCEL_FILE_PATH);
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }

    if (!fs.existsSync(EXCEL_FILE_PATH)) {
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Diagnoses');
        
        sheet.columns = [
            { header: 'Contact No', key: 'contact_no', width: 15 },
            { header: 'Patient Name', key: 'patient_name', width: 20 },
            { header: 'Age', key: 'age', width: 10 },
            { header: 'Gender', key: 'gender', width: 10 },
            { header: 'Locality', key: 'locality', width: 20 },
            { header: 'Symptoms', key: 'symptoms', width: 30 },
            { header: 'Result', key: 'result', width: 20 },
            { header: 'Date', key: 'date', width: 25 },
        ];
        
        await workbook.xlsx.writeFile(EXCEL_FILE_PATH);
        console.log('✅ Created new Excel log file at', EXCEL_FILE_PATH);
    }
};

const appendRecordToExcel = async (recordData) => {
    try {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(EXCEL_FILE_PATH);
        const sheet = workbook.getWorksheet('Diagnoses');
        
        sheet.addRow({
            contact_no: recordData.contact_no,
            patient_name: recordData.patient_name,
            age: recordData.age,
            gender: recordData.gender,
            locality: recordData.locality,
            symptoms: recordData.symptoms.join(', '),
            result: recordData.diagnosis_result,
            date: new Date().toLocaleString()
        });

        await workbook.xlsx.writeFile(EXCEL_FILE_PATH);
        console.log('📝 Appended new record to Excel log.', recordData.patient_name);
    } catch (err) {
        console.error('❌ Failed to append to Excel:', err);
    }
};

module.exports = { initializeExcel, appendRecordToExcel };
