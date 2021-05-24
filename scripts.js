const Modal = {
    // ver para utilizar toggle
    open() {
        document.getElementById('modal-overlay').classList.add('active');
    },
    close() {
        document.getElementById('modal-overlay').classList.remove('active');
    }
}

const transactions = [
    {
        id: 1,
        description: 'Luz',
        amount: -50000,
        date: '23/01/2021'
    },
    {
        id: 2,
        description: 'Criação website',
        amount: 500000,
        date: '23/01/2021'
    },
    {
        id: 3,
        description: 'Internet',
        amount: -20000,
        date: '23/01/2021'
    }
]

const Transaction = {
    incomes() {

    },
    expenses() {

    },
    total() {

    }
}

const Utils = {
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : "";

        value = String(value).replace(/\D/g, "");

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

        return signal + value;
    }
}

const DOM = {
    transactionContainer: document.getElementById('table-transactions'),

    addTransaction(transaction) {
        const tr = document.createElement('tr');
        tr.innerHTML = DOM.innerHTMLTransaction(transaction)
        console.log(tr.innerHTML);

        DOM.transactionContainer.appendChild(tr)
    },
    innerHTMLTransaction({amount, date, description}) {
        const CSSclass = amount > 0 ? "income" : "expense"

        amount = Utils.formatCurrency(amount)

        return `
            <td class="description">${description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${date}</td>
            <td>
                <img src="./assets/minus.svg" alt="Imagem de remover dividendo">
            </td>
        `;
    }
}

transactions.forEach((transaction) => (DOM.addTransaction(transaction)));