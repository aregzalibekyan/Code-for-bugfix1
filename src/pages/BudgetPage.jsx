//rrd imports
import { useLoaderData } from "react-router-dom";
import React, { useRef } from "react";
//helpers
import {
  createExpense,
  deleteItem,
  getAllMatchingItems,
  check,
  updateBudget,
  updateExpense,
} from "../helpers";

//components
import BudgetItem from "../components/BudgetItem";
import AddExpenseForm from "../components/AddExpenseForm";
import AddExpenseUpdateForm from "../components/AddExpenseUpdateForm";
import Table from "../components/Table";

//library
import { toast } from "react-toastify";
import AddUpdateForm from "../components/AddUpdateForm";

//loader
export async function budgetLoader({ params }) {
  const budget = await getAllMatchingItems({
    category: "budgets",
    key: "id",
    value: params.id,
  })[0];

  const expenses = await getAllMatchingItems({
    category: "expenses",
    key: "budgetId",
    value: params.id,
  });

  if (!budget) {
    throw new Error("The budget you are trying to find does not exist");
  }
  return { budget, expenses };
}

//action

export async function budgetAction({ request }) {
  const data = await request.formData();
  const { _action, ...values } = Object.fromEntries(data);

  if (_action === "createExpense") {
    try {
     
        const checked = check({
          expense:values.newExpense.trim(),
          amount: values.newExpenseAmount.trim(),
          budgetId: values.newExpenseBudget,
        },true);
        if (!checked) {
          createExpense({
            name: values.newExpense.trim(),
            amount: parseFloat(values.newExpenseAmount),
            budgetId: values.newExpenseBudget,
          });
          // change the Value
          return null;
        }
        return null;
      
    

  } catch (e) {
      throw new Error("There was a problem creating your expense.");
    }
  }

  if (_action === "deleteExpense") {
    try {
      deleteItem({
        key: "expenses",
        id: values.expenseId,
      });
      return toast.success("Expense deleted!");
    } catch (e) {
      throw new Error("There was a problem deleting your expense.");
    }
  }
  if (_action === "updateBudget") {
    try {
        updateBudget({
          name: values.newBudgetName,
          amount: values.newBudgetAmount,
          budgetId: values.newExpenseBudget,
        });
        return null;
      
    } catch (e) {
      throw new Error("Oh no! Something is wrong!");
    }
  }
  if (_action === "updateExpense") {
    try {
        updateExpense({
          name: values.newExpense,
          amount: parseFloat(values.newExpenseAmount),
          expenseId: values.newExpenseId,
        });
        return null;
    
    } catch (e) {
      throw new Error("Oh no! Something is wrong!");
    }
  }
}

const BudgetPage = () => {
  const { budget, expenses } = useLoaderData();
  const bottomRef = useRef(null);
  return (
    <div
      className="grid-lg"
      style={{
        "--accent": budget.color,
      }}
    >
      <h1 className="h2">
        <span className="accent">{budget.name}</span> Overview
      </h1>
      <div className="flex-lg">
        <BudgetItem budget={budget} showDelete={true} />
        <AddExpenseForm budgets={[budget]} />
        <AddUpdateForm budgets={[budget]} />
        {expenses.length > 0 && <AddExpenseUpdateForm expenses={expenses} />}
        <button
        className="btn btn--dark ifrm--but"
          onClick={() => {
            bottomRef.current.scrollIntoView({ behavior: "smooth" });
          }}
        >
          Currency converter
        </button>
      </div>
      {expenses && expenses.length > 0 && (
        <div className="grid-md">
          <h2>
            <span className="accent">{budget.name}</span> Expenses
          </h2>
          <Table expenses={expenses} showBudget={false} />
        </div>
      )}
      <div ref={bottomRef} className="div--iframe">
        <iframe
          src="https://www.xe.com/currencyconverter/"
          className="iframe"
        ></iframe>
      </div>
    </div>
  );
};

export default BudgetPage;
