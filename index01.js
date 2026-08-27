let totalIncome = 0;
let totalExpense = 0;
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let incomes = JSON.parse(localStorage.getItem("incomes")) || [];
let editIndex = null;
let editIncomeIndex = null;

function renderExpenses() {
    const expenseList = document.getElementById("expenseList");
    const totalExpenseElement = document.getElementById("totalExpense");

    expenseList.innerHTML = "";

    totalExpense = 0;

    expenses.forEach(function (expense, index) {
        totalExpense += Number(expense.amount);

        expenseList.innerHTML += `
            <div>
                ${expense.name} - ₹${expense.amount} - ${expense.category} - ${expense.date}
                <button onclick="editExpense(${index})">Edit</button>
                <button onclick="deleteExpense(${index})">Delete</button>
            </div>
        `;
    });

    totalExpenseElement.innerHTML = totalExpense;
    document.getElementById("summaryExpense").innerHTML = totalExpense;
}

function addExpense() {
    const expenseName = document.getElementById("expenseName").value;
    const amount = document.getElementById("amount").value;
    const category = document.getElementById("category").value;
    const date = document.getElementById("date").value;
    /*  if (
            expenseName === "" || 
            amount === "" || Number(amount) <= 0) {
         alert("Please enter a valid expense name and amount");
         return;
     }*/
    if (
        expenseName === "" ||
        amount === "" ||
        category === "" ||
        date === "" ||
        Number(amount) <= 0
    ) {
        alert("Please fill all fields");
        return;
    }

    const expense = {
        type: "expense",
        name: expenseName,
        amount: Number(amount),
        category: category,
        date: date
    };
    if (editIndex === null) {
        expenses.push(expense);
    } else {
        expenses[editIndex] = expense;
        editIndex = null;
    }

    localStorage.setItem("expenses", JSON.stringify(expenses));

    document.getElementById("expenseName").value = "";
    document.getElementById("amount").value = "";

    renderExpenses();
    renderIncomes();
    renderRecentTransactions();
    renderCategorySummary();
    renderMonthlySummary();
    renderExpenseOverview();
    renderExpenseChart();
}

function clearAllExpenses() {
    const confirmClear = confirm("Are you sure you want to delete all expenses?");
    if (confirmClear === false) {
        return;
    }
    expenses = [];
    localStorage.setItem("expenses", JSON.stringify(expenses));
    renderExpenses();
    renderIncomes();
    renderRecentTransactions();
    renderCategorySummary();
    renderMonthlySummary();
    renderExpenseChart();
}

function editExpense(index) {
    const expenseToEdit = expenses[index];


    editIndex = index;

    document.getElementById("expenseName").value = expenseToEdit.name;
    document.getElementById("amount").value = expenseToEdit.amount;
    document.getElementById("category").value = expenseToEdit.category;
    document.getElementById("date").value = expenseToEdit.date;

    document.getElementById("expenseButton").innerHTML = "Update Expense";
}
function filterExpenses() {

    const selectedCategory =
        document.getElementById("filterCategory").value;

    const filteredExpenses = expenses.filter(function (expense) {
        return selectedCategory === "All" ||
            expense.category === selectedCategory;
    });

    const expenseList =
        document.getElementById("expenseList");

    expenseList.innerHTML = "";

    filteredExpenses.forEach(function (expense, index) {

        expenseList.innerHTML += `
            <div class="expense-item">
                ${expense.name} - ₹${expense.amount} - ${expense.category} - ${expense.date}
            </div>
        `;

    });
}
function searchExpenses() {
    const searchText =
        document.getElementById("searchExpense").value.toLowerCase();

    const filteredExpenses = expenses.filter(function (expense) {
        return expense.name.toLowerCase().includes(searchText);
    });

    const expenseList =
        document.getElementById("expenseList");

    expenseList.innerHTML = "";

    filteredExpenses.forEach(function (expense) {
        expenseList.innerHTML += `
            <div class="expense-item">
                ${expense.name} - ₹${expense.amount} - ${expense.category} - ${expense.date}
            </div>
        `;
    });
}
function addIncome() {
    const incomeName = document.getElementById("incomeName").value;
    const incomeAmount = document.getElementById("incomeAmount").value;
    const incomeDate = document.getElementById("incomeDate").value;

    if (
        incomeName === "" ||
        incomeAmount === "" ||
        incomeDate === "" ||
        Number(incomeAmount) <= 0
    ) {
        alert("Please enter a valid income");
        return;
    }

    const income = {
        type: "income",
        name: incomeName,
        amount: Number(incomeAmount),
        date: incomeDate
    };

    if (editIncomeIndex === null) {
        incomes.push(income);
    } else {
        incomes[editIncomeIndex] = income;
        editIncomeIndex = null;
    }

    localStorage.setItem("incomes", JSON.stringify(incomes));

    document.getElementById("incomeName").value = "";
    document.getElementById("incomeAmount").value = "";

    renderIncomes();
    renderExpenses();
    renderRecentTransactions();
    renderExpenseOverview();
}

function renderIncomes() {
    const incomeList = document.getElementById("incomeList");
    let totalIncome = 0;

    incomeList.innerHTML = "";

    incomes.forEach(function (income, index) {

        totalIncome += Number(income.amount);

        incomeList.innerHTML += `
            <div>
                ${income.name} - ₹${income.amount}
                <button onclick="editIncome(${index})">Edit</button>
                <button onclick="deleteIncome(${index})">Delete</button>
            </div>
        `;
    });

    document.getElementById("totalIncome").innerHTML = totalIncome;
    document.getElementById("summaryIncome").innerHTML = totalIncome;
    document.getElementById("summaryExpense").innerHTML = totalExpense;
    document.getElementById("balance").innerHTML = totalIncome - totalExpense;
    document.getElementById("summaryBalance").innerHTML = totalIncome - totalExpense;
}
function deleteIncome(index) {
    incomes.splice(index, 1);

    localStorage.setItem("incomes", JSON.stringify(incomes));

    renderIncomes();
    renderExpenses();
    renderRecentTransactions();
}
function editIncome(index) {
    const income = incomes[index];
    document.getElementById("incomeName").value = income.name;
    document.getElementById("incomeAmount").value = income.amount;
    editIncomeIndex = index;
}
function clearAllData() {
    const confirmClear = confirm("Are you sure you want to delete all data?");

    if (!confirmClear) {
        return;
    }

    expenses = [];
    incomes = [];

    localStorage.removeItem("expenses");
    localStorage.removeItem("incomes");

    renderExpenses();
    renderIncomes();
    renderRecentTransactions();
    renderCategorySummary();
    renderMonthlySummary();
}
function renderRecentTransactions(searchText = "", selectedDate = "") {

    const recentTransactions =
        document.getElementById("recentTransactions");

    const transactions = [
        ...incomes.map(function (income) {
            return {
                ...income,
                type: "income"
            };
        }),

        ...expenses.map(function (expense) {
            return {
                ...expense,
                type: "expense"
            };
        })
    ];

    const filteredTransactions = transactions.filter(function (transaction) {

        const matchesSearch =
            transaction.name
                .toLowerCase()
                .includes(searchText.toLowerCase());

        const matchesDate =
            selectedDate === "" ||
            transaction.date === selectedDate;

        return matchesSearch && matchesDate;
    });

    recentTransactions.innerHTML = "";

    filteredTransactions.forEach(function (transaction) {

        const sign =
            transaction.type === "income" ? "+" : "-";

        recentTransactions.innerHTML += `
        <div class="transaction-item">
        <span>
            ${transaction.name}
            <small>${transaction.date}</small>
        </span>
    
        <span>
            ${sign} ₹${transaction.amount}
        </span>
    </div>
        `;
    });
}
function renderCategorySummary() {
    const categorySummary = document.getElementById("categorySummary");
    const categoryTotals = {};
    expenses.forEach(function (expense) {
        const category = expense.category;
        if (!categoryTotals[category]) {
            categoryTotals[category] = 0;
        }
        categoryTotals[category] += Number(expense.amount);

    });
    categorySummary.innerHTML = "";

    for (let category in categoryTotals) {
        categorySummary.innerHTML += `
        <div>
            ${category} - ₹${categoryTotals[category]}
        </div>
     `;
    }

}
function renderMonthlySummary() {
    const monthlySummary = document.getElementById("monthlySummary");
    const monthlyTotals = {};
    expenses.forEach(function (expense) {
        const month = expense.date.slice(0, 7);
        if (!monthlyTotals[month]) {
            monthlyTotals[month] = 0;
        }
        monthlyTotals[month] += Number(expense.amount);
    });
    monthlySummary.innerHTML = "";

    for (let month in monthlyTotals) {
        monthlySummary.innerHTML += `
        <div>
            ${month} - ₹${monthlyTotals[month]}
        </div>
    `;
    }
}

function deleteExpense(index) {
    expenses.splice(index, 1);

    localStorage.setItem("expenses", JSON.stringify(expenses));

    renderExpenses();
    renderCategorySummary();
    renderMonthlySummary();
    renderExpenseChart();
    renderRecentTransactions();
}

function clearDateFilter() {

    document.getElementById("filterDate").value = "";

    const searchText = document.getElementById("searchInput").value;

    renderRecentTransactions(searchText, "");
}
function renderExpenseOverview() {

    const expenseOverview =
        document.getElementById("expenseOverview");

    const totalExpense = expenses.reduce(function (total, expense) {
        return total + Number(expense.amount);
    }, 0);

    const totalIncome = incomes.reduce(function (total, income) {
        return total + Number(income.amount);
    }, 0);

    const balance = totalIncome - totalExpense;

    expenseOverview.innerHTML = `
        <div class="overview-row">
            <span>Total Income</span>
            <span>₹${totalIncome}</span>
        </div>

        <div class="overview-row">
            <span>Total Expense</span>
            <span>₹${totalExpense}</span>
        </div>

        <div class="overview-row">
            <span>Balance</span>
            <span>₹${balance}</span>
        </div>
    `;
}
function renderExpenseChart() {

    const expenseChart =
        document.getElementById("expenseChart");

    const categoryTotals = {};

    expenses.forEach(function (expense) {

        const category = expense.category;

        if (!categoryTotals[category]) {
            categoryTotals[category] = 0;
        }

        categoryTotals[category] += Number(expense.amount);
    });

    expenseChart.innerHTML = "";

    const amounts = Object.values(categoryTotals);

    const maxAmount = Math.max(...amounts, 1);

    for (let category in categoryTotals) {

        const amount = categoryTotals[category];

        const width = (amount / maxAmount) * 100;

        expenseChart.innerHTML += `
            <div class="chart-row">

                <div class="chart-label">
                    ${category}
                </div>

                <div class="chart-bar-container">
                    <div
                        class="chart-bar"
                        style="width: ${width}%"
                    ></div>
                </div>

                <div class="chart-amount">
                    ₹${amount}
                </div>

            </div>
        `;
    }
}
renderExpenses();
renderIncomes();
renderRecentTransactions();
renderCategorySummary();
renderMonthlySummary();
renderExpenseOverview();
renderExpenseChart();

document.getElementById("searchInput").addEventListener("input", function () {

    const searchText = this.value;
    const selectedDate = document.getElementById("filterDate").value;

    renderRecentTransactions(searchText, selectedDate);

});
document.getElementById("filterDate").addEventListener("change", function () {

    const selectedDate = this.value;
    const searchText = document.getElementById("searchInput").value;

    renderRecentTransactions(searchText, selectedDate);

});