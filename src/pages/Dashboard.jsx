//rrd imports
import { Link, useLoaderData } from "react-router-dom";
import { useState } from "react";
// helpers
import {
  createBudget,
  createExpense,
  deleteItem,
  fetchData,
  wait,
  check,
  updateBudget,

} from "../helpers";

//components
import Intro from "../components/Intro";
import AddBudgetForm from "../components/AddBudgetForm";
import AddExpenseForm from "../components/AddExpenseForm";
import BudgetItem from "../components/BudgetItem";
import Table from "../components/Table";

//library imports
import { toast } from "react-toastify";

//loader
export function dashboardLoader() {
  const userName = fetchData("userName");
  const budgets = fetchData("budgets");
  const expenses = fetchData("expenses");
  return { userName, budgets, expenses };
}

//action
export async function dashboardAction({ request }) {
  await wait();

  const data = await request.formData();
  const { _action, ...values } = Object.fromEntries(data);

  //new user submission
  if (_action === "newUser") {
    try {
      if(values.userName.trim().length != 0) {
        if (values.userName.trim().length <= 20 && values.userName.length >=3) {
          localStorage.setItem("userName", JSON.stringify(values.userName.trim()));
          return toast.success(`Welcome, ${values.userName}`);
        }
        return toast.error("Operation failed! Max user name length is 20 and min length is 3.");
      }
      return toast.error("Operation failed! Type user name!");
    } catch (e) {
      throw new Error("There was a problem creating your account.");
    }
  }

  if (_action === "createBudget") {
    try {
        createBudget({
          name: values.newBudget,
          amount: values.newBudgetAmount,
        });
        return null;
      }
     catch (e) {
      throw new Error("There was a problem creating your budget.");
      
    }
  }

  if (_action === "createExpense") {
    try {
      if (
        values.newExpenseAmount.trim() != "" &&
        values.newExpense.trim() != ""
      ) {
        if (values.newExpenseAmount >= 0) {
          const checked = check({
            amount: values.newExpenseAmount,
            budgetId: values.newExpenseBudget,
          });
          if (!checked) {
            createExpense({
              name: values.newExpense.trim(),
              amount: values.newExpenseAmount,
              budgetId: values.newExpenseBudget,
            });
            // change the Value
            return null;
          }
          return null;
        }
        return toast.error("Operation failed! Positive values only!");
      }

      return toast.error("Operation failed! Don't forget to give name or amount!");
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
        name: values.newBudgetName.trim(),
        amount: values.newBudgetAmount,
        budgetId: values.newExpenseBudget,
      });
      return null;
    } catch (e) {
      return null;
    }
  }
}

const Dashboard = () => {
  const { userName, budgets, expenses } = useLoaderData();

  return (
    <div>
      {userName ? (
        <div className="dashboard">
          <h1>
            Welcome back, <span className="accent">{userName}</span>
          </h1>
          <div className="grid-sm">
            {budgets && budgets.length > 0 ? (
              <div className="grid-lg">
                <div className="flex-lg">
                  <AddBudgetForm />
                  <AddExpenseForm budgets={budgets} />
                  
                </div>
                <h2>Existing Budgets</h2>
                <div className="budgets">
                  {budgets.map((budget) => (
                    <BudgetItem key={budget.id} budget={budget} /> //pass the prop here
                  ))}
                </div>
                {expenses && expenses.length > 0 && (
                  <div className="grid-md">
                    <h2>Recent Expenses</h2>
                    <Table
                      expenses={expenses
                        .sort((a, b) => b.createdAt - a.createdAt)
                        .slice(0, 8)}
                    />
                    {expenses.length > 8 && (
                      <Link to="expenses" className="btn btn--dark">
                        View all expenses
                      </Link>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="grid-sm">
                <p>Personal Budgeting is the secret to financial freedom.</p>
                <p>Create a budget to get started!</p>
                <AddBudgetForm />
              </div>
            )}
          </div>
        </div>
      ) : (
        <Intro />
      )}
    </div>
  );
};

export default Dashboard;
