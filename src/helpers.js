import { toast } from "react-toastify";
export const wait = () =>
  new Promise((res) => setTimeout(res, Math.random() * 800));

// colors
const generateRandomColor = () => {
  const existingBudgetLength = fetchData("budgets")?.length ?? 0;
  return `${existingBudgetLength * 34} 65% 50%`;
};
function existingBudgets1(value, id) {
  const existingBudgets = fetchData(value) ?? [];
  for (let i = 0; i < existingBudgets.length; i++) {
    if (existingBudgets[i].id === id) {
      return i;
    }
  }
  return null;
}
// Local storage
export const fetchData = (key) => {
  return JSON.parse(localStorage.getItem(key));
};

// Get all items from local storage
export const getAllMatchingItems = ({ category, key, value }) => {
  const data = fetchData(category) ?? [];
  return data.filter((item) => item[key] === value);
};

// delete items
export const deleteItem = ({ key, id }) => {
  const existingData = fetchData(key);
  if (id) {
    const newData = existingData.filter((item) => item.id !== id);
    return localStorage.setItem(key, JSON.stringify(newData));
  }
  return localStorage.removeItem(key);
};

//create budget
export const createBudget = ({ name, amount }) => {
  if (
    (name.trim().length <= 20 || amount <= 9999999999) &&
    !isNaN(Number.parseInt(amount)) &&
    (name.trim() != "" || amount.trim() != "")
  ) {
    const newItem = {
      id: crypto.randomUUID(),
      name: name.trim(),
      createdAt: Date.now(),
      amount: Math.abs(+amount),
      color: generateRandomColor(),
    };
    toast.success("Budget created!");
    const existingBudgets = fetchData("budgets") ?? [];
    return localStorage.setItem(
      "budgets",
      JSON.stringify([...existingBudgets, newItem])
    );
  } else if (name.trim() != "" || amount.trim() != "") {
    return toast.error("Operation failed! Type amount and name!");
  } else if (isNaN(Number.parseInt(amount))) {
    return toast.error("Operation failed! Type only number!");
  }
  return toast.error(
    "Operation failed,only 20 sybmols are allowed and max number is 9999999999."
  );
};

//create expense
export const createExpense = ({ name, amount, budgetId }) => {
  if (name.length <= 20 || amount <= 10) {
    const newItem = {
      id: crypto.randomUUID(),
      name: name,
      createdAt: Date.now(),
      amount: +amount,
      budgetId: budgetId,
    };
    toast.success("Expense created!");
    const existingExpenses = fetchData("expenses") ?? [];
    return localStorage.setItem(
      "expenses",
      JSON.stringify([...existingExpenses, newItem])
    );
  }
  return toast.error("Operation failed,only 20 sybmols are allowed.");
};

// total spend by budget
export const calculateSpentByBudget = (budgetId) => {
  const expenses = fetchData("expenses") ?? [];
  const budgetSpent = expenses.reduce((acc, expense) => {
    // check if expense.id === budgetId
    if (expense.budgetId !== budgetId) return acc;
    // add the current amount to my total
    return (acc += expense.amount);
  }, 0);
  return budgetSpent;
};

//formatting
export const formatDateToLocaleString = (epoch) =>
  new Date(epoch).toLocaleDateString();

//formatting percentages
export const formatPercentage = (amt) => {
  return amt.toLocaleString(undefined, {
    style: "percent",
    minimumFractionDigits: 0,
  });
};

//Format currency
export const formatCurrency = (amt) => {
  return amt.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
  });
};
export const check = (expense) => {
  const index = existingBudgets1("budgets", expense.budgetId);
  const existingBudgets = fetchData("budgets") ?? [];
  const currObj = existingBudgets[index];
  if (isNaN(Number.parseInt(expense.amount))) {
    toast.error("Operation failed! You can't type text or another symbols.");
    return true;
  }
  if (
    currObj.amount - calculateSpentByBudget(expense.budgetId) - expense.amount <
    0
  ) {
    toast.error("Operation failed! The expense can't be over the budget.");
    return true;
  }
  return false;
};
export const updateBudget = (update) => {
  if (update.amount - calculateSpentByBudget(update.budgetId) < 0) {
    return toast.error(
      "Operation failed. If you want to decrease budget , first update or delete expense/expenses."
    );
  }
  const index = existingBudgets1("budgets", update.budgetId);
  const existingBudgets = fetchData("budgets") ?? [];
  existingBudgets[index].name = update.name;
  existingBudgets[index].amount = +update.amount;
  localStorage.setItem("budgets", JSON.stringify(existingBudgets));
  toast.success("Budget updated");
};
export const updateExpense = (expense) => {
  const index = existingBudgets1("expenses", expense.budgetId);
  const existingExpenses = fetchData("expenses") ?? [];
  const existingBudgets = fetchData("budgets") ?? [];
  if (
    existingBudgets[
      existingBudgets1("budgets", existingExpenses[index].budgetId)
    ].amount -
      calculateSpentByBudget(expense.budgetId) -
      expense.amount >=
    0
  ) {
    existingExpenses[index].name = expense.name;
    existingExpenses[index].amount = +expense.amount;
    localStorage.setItem("expenses", JSON.stringify(existingExpenses));
    return toast.success("Expense updated!");
  }
  return toast.error("Operation failed! Expense amount can't be more from remaining of the budget,first decrease other expenses or update budget values!");
  // }
};
export const check1 = (budget) => {
  if (isNaN(Number.parseInt(budget.amount))) {
    toast.error("Operation failed! You can't type text or another symbols.");
    return false;
  } else if (budget.amount < 0) {
    toast.error("Operation failed! Only positive numbers.");
    return false;
  }
  return true;
};
