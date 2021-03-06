const Modal = {
    // ver para utilizar toggle
    open() {
        document.getElementById('modal-overlay').classList.add('active');
    },
    close() {
        document.getElementById('modal-overlay').classList.remove('active');
    }
}

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("dev.finances:transactions"))  || [];
    },
    set(transactions) {
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions));
    },
    getLastId() {
        const transactions = Storage.get() || [];

        return transactions && transactions[transactions.length -1]?.id + 1 || 1;
    }
}

const Transaction = {
    all: Storage.get(),
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
        Transaction.all.forEach(({amount}) => {
            if(amount > 0) {
                incomes += amount;
            }
        })

        return incomes;
    },
    expenses() {
        let expenses = 0;
        Transaction.all.forEach(({amount}) => {
            if(amount < 0) expenses += amount;
        })
        return expenses;
    },
    total() {
        let total = 0;
        Transaction.all.forEach(({amount}) => { total += amount; })
        return total;
    }
}

const Utils = {
    formatAmount(amount) {
        amount = amount * 100;
        return Math.round(amount);
    },
    formatDate(date) {
        const splittedDate = date.split("-");
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
    },
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
        let id = transaction.id || 1

        tr.innerHTML = DOM.innerHTMLTransaction(transaction, id)

        DOM.transactionContainer.appendChild(tr)
    },
    innerHTMLTransaction({amount, date, description, id}, newId) {
        const CSSclass = amount > 0 ? "income" : "expense"

        id = id || newId;
        amount = Utils.formatCurrency(amount)

        return `
            <td class="description">${description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${date}</td>
            <td>
                <img onClick="Transaction.remove(${id})" src="./assets/minus.svg" alt="Imagem de remover dividendo">
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
    description: document.getElementById("description"),
    amount: document.getElementById("amount"),
    date: document.getElementById("date"),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },
    // Verifica se algum campo est?? vazio
    validadeFields() {
        const arrayOfData = Object.values(Form.getValues());
        const valuesLength = arrayOfData.filter(id => id).length;
        if(valuesLength < arrayOfData.length) {
            // throw new Error("Por favor, preencha todos os campos.");
            // alert("Por favor, preencha todos os campos.");
        }
    },
    formatValues() {
        let {description, amount, date } = Form.getValues();
        amount = Utils.formatAmount(amount);
        date = Utils.formatDate(date);

        return {
            description,
            amount,
            date
        }
    },
    saveTransaction(transaction) {
        Transaction.add(transaction);
    },
    clearFields() {
        Form.description.value = "";
        Form.amount.value = "";
        Form.date.value = "";
    },
    submit(event) {
        event.preventDefault();

        try {
            // Verificar se todas as informa????es foram preenchidas
            Form.validadeFields();
            // Formatar os dados para salvar;
            const transaction = Form.formatValues();
            // salvar;
            const id = Storage.getLastId();
            Form.saveTransaction(Object.assign(transaction, { id }));
            // Atualizar a aplica????o
            // Apagar os dados do formul??rio;
            Form.clearFields();
            //  fechar modal
            Modal.close();
        } catch (error) {
            
        }
    }    
}

const App = {
    init() {
        
        Transaction.all.forEach( DOM.addTransaction);
        Storage.set(Transaction.all);
        DOM.updateBalance();
    },
    reload() {
        DOM.clearTransactions();
        App.init();
    }
}

App.init();