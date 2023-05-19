// class ObjetPaie {
//     constructor (AccountCode,
//         AccountingPeriod,
//         AnalysisCode2,
//         BaseAmount,
//         CurrencyCode,
//         DebitCredit,
//         Description,
//         DueDate,
//         JournalSource,
//         JournalType,
//         TransactionAmount,
//         TransactionDate,
//         TransactionReference) {
//         this.AccountCode = AccountCode;
//         this.AccountingPeriod = AccountingPeriod;
//         this.AnalysisCode2 = AnalysisCode2;
//         this.BaseAmount = BaseAmount;
//         this.CurrencyCode = CurrencyCode;
//         this.DebitCredit = DebitCredit;
//         this.Description = Description;
//         this.DueDate = DueDate;
//         this.JournalSource = JournalSource;
//         this.JournalType = JournalType;
//         this.TransactionAmount = TransactionAmount;
//         this.TransactionDate = TransactionDate;
//         this.TransactionReference = TransactionReference;
//     }

//     /**
//      * @param {string} period
//      */
//     set AccountingPeriod(period) {
//         let annee = 2000 + period.slice(5);
//         let mois = period.slice(2, 4);
//         this.AccountingPeriod = "0" + mois + annee; //EX : 0032023
//     }

//     /**
//      * @param {string} amount
//      */
//     set BaseAmount(amount) {
//         let montant = (100000000000000 + parseFloat(amount)).toFixed(3);
//         this.BaseAmount = montant.slice(1);
//     }

//     /**
//      * @param {string} amount
//      */
//     set TransactionAmount(amount) {
//         let montant = (100000000000000 + parseFloat(amount)).toFixed(3);
//         this.TransactionAmount = montant.slice(1);
//     }

//     /**
//      * @param {string} period
//      */
//     set DueDate(period) {
//         let annee = 2000 + period.slice(5);
//         this.DueDate = period.slice(0, 4) + annee;
//     }

//     /**
//      * @param {string} period
//      */
//     set TransactionDate(period) {
//         let annee = 2000 + period.slice(5);
//         this.TransactionDate = period.slice(0, 4) + annee;
//     }

//     /**
//      * @param {string} period
//      */
//     set TransactionReference(period){
//         let annee = 2000 + period.slice(5);
//         let mois = period.slice(2, 4);
//         this.TransactionReference = "PAIE"+mois+annee;
//     }
// }

// // export default ObjetPaie;
