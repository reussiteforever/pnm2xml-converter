function handleAccountingPeriod(period) {
    let annee = 2000 + parseInt(period.slice(5));
    let mois = period.slice(2, 4);
    this.AccountingPeriod = "0" + mois + annee.toString(); //EX : 0032023
}
function handleBaseAmount(amount) {
    let montant = (100000000000000 + parseFloat(amount)).toFixed(3);
    this.BaseAmount = montant.slice(1);
}

function handleTransactionAmount(amount) {
    let montant = (100000000000000 + parseFloat(amount)).toFixed(3);
    this.TransactionAmount = montant.slice(1);
}

function handleDueDate(period) {
    let annee = 2000 + parseInt(period.slice(5));
    this.DueDate = period.slice(0, 4) + annee.toString();
}

function handleTransactionDate(period) {
    let annee = 2000 + parseInt(period.slice(5));
    this.TransactionDate = period.slice(0, 4) + annee.toString();
}

function handleTransactionReference(period) {
    let annee = 2000 + parseInt(period.slice(5));
    let mois = period.slice(2, 4);
    this.TransactionReference = "PAIE" + mois + annee.toString();
}

function getInputFile(){
    var name=document.fileconverter.file.value;
    var filename = name.slice(name.lastIndexOf('\\')+1);
    console.log(filename);
    alert("Welcome: " + filename);
    return filename;
}

module.exports = getInputFile;