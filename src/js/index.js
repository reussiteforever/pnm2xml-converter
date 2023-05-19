// appel du gestionnaire de fichiers de nodejs
const fs = require("fs");

//instanciation de la librairie n-readlines
const lineByLine = require('n-readlines');

//librairie pour le fichier xml
var convert = require('xml-js');

var base = require('../../modules/functions.js');


//function principale
function converter(_name){
    // Déclarations des propriétés
    let _AccountingPeriod;
    let _BaseAmount;
    let _TransactionAmount;
    let _DueDate;
    let _TransactionDate;
    let _TransactionReference;
    let _AccountCode;
    let _AnalysisCode2;
    let _AnalysisCode3;
    let _CurrencyCode;
    let _DebitCredit;
    let _Description;
    let _JournalSource;
    let _JournalType;

    function handleAccountingPeriod(period) {
        let annee = 2000 + parseInt(period.slice(4));
        let mois = period.slice(2, 4);
        return "0" + mois + annee.toString(); //EX : 0032023
    }
    function handleBaseAmount(amount) {
        let montant = (100000000000000 + parseFloat(amount)).toFixed(3);
        return montant.slice(1);
    }

    function handleTransactionAmount(amount) {
        let montant = (100000000000000 + parseFloat(amount)).toFixed(3);
        return montant.slice(1);
    }

    function handleDueDate(period) {
        let annee = 2000 + parseInt(period.slice(4));
        return period.slice(0, 4) + annee.toString();
    }

    function handleTransactionDate(period) {
        let annee = 2000 + parseInt(period.slice(4));
        return period.slice(0, 4) + annee.toString();
    }

    function handleTransactionReference(period) {
        let annee = 2000 + parseInt(period.slice(4));
        let mois = period.slice(2, 4);
        return "PAIE" + mois + annee.toString();
    }

    // Lecture du fichier en entrée.
    // const liner = new lineByLine('PAIECIMTOGO1-04.PNM');
    const liner = new lineByLine(_name);

    //variable de lecture d'une ligne lue
    var line;

    //le numéro de ligne
    var lineNumber = 0;

    //tableau de toutes les ligne de paie
    var tableauPaie = [];

    var objetPaie;

    var lineASCII;

    var balance= 0, totalDebit=0, totalCredit=0;

    while (line = liner.next()) {
        //convertion de la ligne en mode ASCII
        lineASCII = line.toString('ascii');

        _AccountCode = lineASCII.slice(11, 24).trim();
        _AccountingPeriod = handleAccountingPeriod(lineASCII.slice(3, 9).trim());
        _AnalysisCode2 = lineASCII.slice(25, 38).trim();
        _AnalysisCode3 = "A-AUTRES";
        _BaseAmount = handleBaseAmount(lineASCII.slice(84, 104).trim());
        _CurrencyCode = lineASCII.slice(138, 141).trim();
        _DebitCredit = lineASCII.at(83);
        _Description = lineASCII.slice(51, 76).trim();
        _DueDate = handleDueDate(lineASCII.slice(3, 9).trim());
        _JournalSource = "PAYE";
        _JournalType = "MPY";
        _TransactionAmount = handleTransactionAmount(lineASCII.slice(84, 104).trim());
        _TransactionDate = handleTransactionDate(lineASCII.slice(3, 9).trim());
        _TransactionReference = handleTransactionReference(lineASCII.slice(3, 9).trim());

        //Si le numéro de compte commence par 6 et AnalysisCode est vide
        // if(_AccountCode.startsWith("6") && _AnalysisCode2.length==0) {
        if((_AccountCode.startsWith("6") || _AccountCode.startsWith("7")) && _AnalysisCode2.length==0) {
            //aller à la ligne suivante
            lineNumber++;
        } else {
            if(!isNaN(_TransactionAmount)){
                if(_DebitCredit==="D") totalDebit += parseInt(_TransactionAmount);
                if(_DebitCredit==="C") totalCredit += parseInt(_TransactionAmount);
                balance = totalDebit - totalCredit;
                // balance = _DebitCredit==="D" ? balance-parseInt(_TransactionAmount) : balance+parseInt(_TransactionAmount);
            }
        
            //les controles sur accountcode commencant par E421
            if(_AccountCode.startsWith('E421')){
                _AccountCode = _AccountCode.slice(0,_AccountCode.length-4).concat('',_AnalysisCode2.slice(_AnalysisCode2.length-4));
            } 

            //Remplacement des O par 0
            _AccountCode = _AccountCode.replaceAll('O','0');
        

            if(_AccountCode.startsWith("7")){
                objetPaie = {_AccountCode, _AccountingPeriod, _AnalysisCode2, _AnalysisCode3, _BaseAmount,
                    _CurrencyCode, _DebitCredit, _Description, _DueDate, _JournalSource, _JournalType, _TransactionAmount,
                    _TransactionDate, _TransactionReference};
            }else{
                objetPaie = {_AccountCode, _AccountingPeriod, _AnalysisCode2, _BaseAmount,
                    _CurrencyCode, _DebitCredit, _Description, _DueDate, _JournalSource, _JournalType, _TransactionAmount,
                    _TransactionDate, _TransactionReference};
            }
            
        
            // Conversion de l'objet Paie En JSON et insertion dans le tableau des paies
            // tableauPaie.push(JSON.stringify(objetPaie));
            // tableauPaie.push(Object.assign({}, objetPaie));
            tableauPaie.push(objetPaie);
        
            //aller à la ligne suivante
            lineNumber++;
        }
        
    }

    console.log("Total Crédit est de : "+ totalCredit);
    console.log("Total Débit est de : "+ totalDebit);
    console.log("la balance est de : "+ balance);


    //supprimer le premier élément du tableau de Paies.
    tableauPaie.shift();


    var options = {compact: true, ignoreComment: true, spaces: 4};
    var result = convert.json2xml(tableauPaie, options);
    // console.log(result);

    /**
     * CREATION DE FICHIERS XML
     */

    fs.open('results.xml', 'w', function (err) {
        if (err) throw err;
    });

    //ajout code xml de début
    fs.appendFile('results.xml',
        `<?xml version='1.0' encoding='UTF-8' ?>
        <SSC>
        <Payload>
        <Ledger>\n` , function (err) {
        if (err) throw err;
    });

    // substitution de balise
    const bo = /<[0-9]*>/gi;
    const bf = /<\/[0-9]*>/gi;
    const borph = /<AnalysisCode2\/>/gi;

    var a = result.toString().replaceAll(bo,'<Line>');
    var b = a.toString().replaceAll(bf,'</Line>');
    var c = b.toString().replaceAll(borph,'<AnalysisCode2></AnalysisCode2>');

    //ajout du contenu du fichier résultat
    setTimeout(() => {
        fs.appendFile('results.xml', c+"\n" , function (err) {
            if (err) throw err ;
        });
    }, 200);
    // fs.appendFile('results.xml', c+"\n" , function (err) {
    //     if (err){throw err}else{d=true;} ;
    // });

    //ajout code xml de la fin
    setTimeout(() => {
        fs.appendFile('results.xml',
            `</Ledger>
            </Payload>
            </SSC>` , function (err) {
            if (err) throw err;
            console.log("ca a marché");
        });
    }, 400);
}

module.exports = converter;

