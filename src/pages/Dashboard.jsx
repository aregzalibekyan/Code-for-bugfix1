//rrd imports
import { Link, useLoaderData } from "react-router-dom";
import React, { useRef } from "react";
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
      let len = values.userName.trim();
      if (len.length != 0) {
        if (len.length <= 20 && len.length >= 3) {
          localStorage.setItem("userName", JSON.stringify(len));
          return toast.success(`Welcome, ${len}`);
        }
        return toast.error(
          "Operation failed! Max user name length is 20 and min length is 3."
        );
      }
      return toast.error("Operation failed! Type user name!");
    } catch (e) {
      throw new Error("There was a problem creating your account.");
    }
  }

  if (_action === "createBudget") {
    try {
      toast.warning('Please wait some time...')
      await createBudget({
        name: values.newBudget,
        amount: values.newBudgetAmount,
      });
      return null;
    } catch (e) {
      console.error(e)
      throw new Error("There was a problem creating your budget.");
    }
  }

  if (_action === "createExpense") {
    try {
          const checked = check({
            expense:values.newExpense.trim(),
            amount: values.newExpenseAmount.trim(),
            budgetId: values.newExpenseBudget,
          },"expense");
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
      console.error(e);
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
  const bottomRef = useRef(null);

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
                  <button 
                  className="btn btn--dark ifrm--but"
                  onClick={() => {
                        bottomRef.current.scrollIntoView({ behavior: "smooth" });
                  }}>Currency converter</button>
                </div>
                <h2>Existing Budgets</h2>

                <div className="budgets">
                  {budgets.map((budget) => (
                    <BudgetItem key={budget.id} budget={budget} /> // pass the prop here
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
            <div ref={bottomRef} className="div--iframe" >
                  <iframe
                    src="https://www.xe.com/currencyconverter/"
                    className="iframe"
                    
                  ></iframe>
                </div>
          </div>
        </div>
      ) : (
        <Intro />
      )}
    </div>
  );
};

export default Dashboard;
