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
    all: transactions,
    add(transaction) {
        Transaction.all.push(transaction);
        App.reload();
    },
    remove(remove) {
        const data = Transaction.all;
        Transaction.all = data.filter(({ id }) => id !== remove);

        App.reload();
    },
    incomes() {
        let incomes = 0;
        transactions.forEach(({amount}) => {
            if(amount > 0) incomes += amount;
        })
        return incomes;
    },
    expenses() {
        let expenses = 0;
        transactions.forEach(({amount}) => {
            if(amount < 0) expenses += amount;
        })
        return expenses;
    },
    total() {
        let total = 0;
        transactions.forEach(({amount}) => { total += amount; })
        return total;
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
    },
    updateBalance() {
        document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(Transaction.incomes());
        document.getElementById('expensesDisplay').innerHTML = Utils.formatCurrency(Transaction.expenses());
        document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(Transaction.total());
    },
    clearTransactions() {
        DOM.transactionContainer.innerHTML = "";
    }
}

const Form = {
    submit(event) {
        event.preventDefault();
        // Verificar se todas as informações foram preenchidas
        // Formatar os dados para salvar;
        // salvar;
        // Apagar os dados do formulário;
    }    
}

const App = {
    init() {
        
        Transaction.all.forEach( transaction => (DOM.addTransaction(transaction)));
        DOM.updateBalance();

    },
    reload() {
        DOM.clearTransactions();
        App.init();
    }
}

App.init();
