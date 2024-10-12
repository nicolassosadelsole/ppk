let LSL = 0.0055;
let USL = 0.0060;

function setFormat(format) {
    if (format === '12_16') {
        LSL = 0.0055;
        USL = 0.0060;
        document.getElementById('example').innerHTML =
            'Ejemplo:<br>Límite Inferior: 550<br>Límite Superior: 600<br>Para ingresar 0,00575, escriba: 575';
    } else if (format === '24') {
        LSL = 0.0059;
        USL = 0.0063;
        document.getElementById('example').innerHTML =
            'Ejemplo:<br>Límite Inferior: 590<br>Límite Superior: 630<br>Para ingresar 0,00595, escriba: 595';
    }
}

function calculateResults() {
    let ppks = [];
    for (let i = 1; i <= 4; i++) {
        let ppk = calculateControlResults(i);
        if (ppk !== null) {
            ppks.push(ppk);
        }
    }
    if (ppks.length > 0) {
        let generalPpk = calculateMean(ppks);
        document.getElementById('ppkGeneral').innerHTML = `PPK GENERAL: ${generalPpk.toFixed(2)}`;
    } else {
        document.getElementById('ppkGeneral').innerHTML = 'PPK GENERAL: N/A';
    }
}

function calculateControlResults(controlNumber) {
    let inputs = [];
    for (let i = 1; i <= 6; i++) {
        let input = document.getElementById(`c${controlNumber}p${i}`).value;
        if (input !== '') {
            inputs.push(parseInt(input) / 100000);  // Convertir a milésimas
        }
    }
    if (inputs.length === 6) {
        let mean = calculateMean(inputs);
        let stddev = calculateStdDev(inputs);
        let ppk = calculatePpk(mean, stddev);

        document.getElementById(`result${controlNumber}`).innerHTML =
            `Control ${controlNumber} - Media: ${mean.toFixed(5)}, PPK: ${ppk.toFixed(5)}`;
        return ppk;
    } else {
        document.getElementById(`result${controlNumber}`).innerHTML = `Control ${controlNumber} - Ingrese todos los valores.`;
        return null;
    }
}

function calculateMean(values) {
    let sum = values.reduce((a, b) => a + b, 0);
    return sum / values.length;
}

function calculateStdDev(values) {
    let mean = calculateMean(values);
    let variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (values.length - 1);
    return Math.sqrt(variance);
}

function calculatePpk(mean, stddev) {
    let Ppkl = (mean - LSL) / (3 * stddev);
    let Ppku = (USL - mean) / (3 * stddev);
    return Math.min(Ppkl, Ppku);
}
