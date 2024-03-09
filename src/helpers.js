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
      return [existingBudgets[i], i];
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

export const checkIfExisting = (
  category,
  name,
  except = false,
  budgetId = false
) => {
  const budgets = fetchData(category) ?? [];
  const elem1 = budgets.some((elem) => {
    return (
      elem.name === name &&
      (budgetId ? elem.budgetId === budgetId : true) &&
      (except
        ? category === "expenses"
          ? elem.id != except
          : elem.id != except
        : true)
    );
  });
  return elem1;
};
//create budget
export const createBudget = async ({ name, amount }) => {
  const [trimmedName, trimmedAmount, checkIf] = [
    name.trim(),
    amount.trim(),
    checkIfExisting("budgets", name),
  ];
  if (
    !check(
      {
        expense: trimmedName,
        amount: trimmedAmount,
      },
      false
    ) &&
    !checkIf
  ) {
    let curr = await getCurrency();
    const newItem = {
      id: crypto.randomUUID(),
      name: trimmedName,
      createdAt: Date.now(),
      amount: +amount,
      color: generateRandomColor(),
      currency: curr,
    };
    const existingBudgets = fetchData("budgets") ?? [];
    toast.success("Budget created!");
    return localStorage.setItem(
      "budgets",
      JSON.stringify([...existingBudgets, newItem])
    );
  } else if (checkIf) {
    return toast.error(
      "The budget can't have same budget name as other budget have!"
    );
  }
};

//create expense
export const createExpense = ({ name, amount, budgetId }) => {
  const checkIf = checkIfExisting("expenses", name, false, budgetId);

  if (!checkIf) {
    const curr = existingBudgets1("budgets", budgetId)[0].currency;
    const newItem = {
      id: crypto.randomUUID(),
      name: name,
      createdAt: Date.now(),
      amount: +amount,
      budgetId: budgetId,
      currency: curr,
    };
    toast.success("Expense created!");
    const existingExpenses = fetchData("expenses") ?? [];
    return localStorage.setItem(
      "expenses",
      JSON.stringify([...existingExpenses, newItem])
    );
  } else if (checkIf) {
    return toast.error(
      "Operation failed! The expense can't have same expense name as other expense have!"
    );
  }
};

// total spend by budget
export const calculateSpentByBudget = (budgetId) => {
  const expenses = fetchData("expenses") ?? [];
  const budgetSpent = expenses.reduce((acc, expense) => {
    // check if expense.budgetId === budgetId
    if (expense.budgetId === budgetId) {
      // add the current amount to my total
      acc += expense.amount;
    }
    return acc;
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

// export const formatCurrency = async(amt) => {
//   const curr = await getCurrency();
//   try {
//     return amt.toLocaleString(undefined, {
//       style: "currency",
//       currency: curr,
//     });
//   } catch (e) {
//     throw e;
//   }
// };
export const check = (expense, category) => {
  if (category) {
    const index = existingBudgets1("budgets", expense.budgetId)[0];
    if (
      index.amount - calculateSpentByBudget(expense.budgetId) - expense.amount <
      0
    ) {
      toast.error("Operation failed! The expense can't be over the budget.");
      return true;
    }
  }
  if (isNaN(Number.parseInt(expense.amount))) {
    toast.error("Operation failed! You can't type text or another symbols.");
    return true;
  }
  if (expense.expense === "" || expense.amount === "") {
    toast.error("Operation failed! Don't forget to give name or amount!");
    return true;
  }
  if (Number.parseFloat(expense.amount) < 0) {
    toast.error("Operation failed! Positive values only!");
    return true;
  }
  if (expense.expense.length > 20 || parseFloat(expense.amount) > 999999999) {
    toast.error(
      "Operation failed,only 20 sybmols are allowed and max number is 9999999999 !"
    );
    return true;
  }
  return false;
};
export const updateBudget = (update) => {
  const checkIfExisting1 = checkIfExisting(
    "budgets",
    update.name,
    update.budgetId
  );
  const checked = check(
    {
      expense: update.name.trim(),
      amount: update.amount.trim(),
    },
    false
  );
  if (update.amount - calculateSpentByBudget(update.budgetId) < 0) {
    return toast.error(
      "Operation failed! If you want to decrease budget , first update or delete expense/expenses!"
    );
  } else if (checked) {
    return null;
  } else if (checkIfExisting1) {
    return toast.error(
      "Operation failed! The budget can't have same budget name as other budgets have!"
    );
  }
  const index = existingBudgets1("budgets", update.budgetId)[1];
  const existingBudgets = fetchData("budgets") ?? [];
  existingBudgets[index].name = update.name;
  existingBudgets[index].amount = +update.amount;
  localStorage.setItem("budgets", JSON.stringify(existingBudgets));
  toast.success("Budget updated");
};

export const updateExpense = (expense) => {
  const [currObj, index] = existingBudgets1("expenses", expense.expenseId);
  const checkIfExisting1 = checkIfExisting(
    "expenses",
    expense.name,
    expense.expenseId,
    currObj.budgetId
  );
  const checked = check(
    {
      expense: expense.name.trim(),
      amount: expense.amount,
    },
    false
  );
  const existingBudget = existingBudgets1("budgets", currObj.budgetId)[0];
  const existingExpenses = fetchData("expenses" ?? []);
  if (
    existingBudget.amount -
      calculateSpentByBudget(currObj.budgetId) +
      currObj.amount -
      expense.amount >=
      0 &&
    !checked &&
    !checkIfExisting1
  ) {
    existingExpenses[index].name = expense.name;
    existingExpenses[index].amount = parseFloat(+expense.amount);
    localStorage.setItem("expenses", JSON.stringify(existingExpenses));
    return toast.success("Expense updated!");
  } else if (checked) {
    return null;  
  } else if (checkIfExisting1) {
    return toast.error(
      "Operation failed! The expense can't have same expense name as other expense have!"
    );
  }
  return toast.error(
    "Operation failed! Expense amount can't be more from remaining of the budget,first decrease other expenses or update budget values!"
  );
};

export const getLocation = (callback) => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const [latitude, longitude] = [
          position.coords.latitude,
          position.coords.longitude,
        ];
        callback([latitude, longitude]);
      },
      (error) => {
        callback(false);
      }
    );
  } else {
    callback(false);
  }
};
export const getCurrency = async () => {
  try {
    const location = await new Promise((resolve) => {
      getLocation((locationData) => {
        resolve(locationData);
      });
    });

    if (!location) {
      return "$";
    }
    const response = await fetch(
      `http://api.geonames.org/findNearbyJSON?lat=${location[0]}&lng=${location[1]}&username=aregzalibekyan1`
    );
    const som = await response.json();
    const countryName = som.geonames[0].countryName;
    if (countryName) {
      const response1 = await fetch(
        `https://restcountries.com/v3.1/name/${countryName}?fullText=true`
      );
      const countryInfo = await response1.json();
      const currency =
        countryInfo[0].currencies[Object.keys(countryInfo[0].currencies)[0]]
          .symbol;
      return currency ?? Object.keys(countryInfo[0].currencies)[0];
    }
  } catch (e) {
    return null;
  }
};
