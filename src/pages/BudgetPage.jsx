//rrd imports
import { useLoaderData } from "react-router-dom";

//helpers
import {
  createExpense,
  deleteItem,
  getAllMatchingItems,
  check,
  updateBudget,
  check1,
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
            return null;
          }
          return null;
        }
        return toast.error("Operation failed! Positive values only!");
      }

      return toast.error(
        "Operation failed! Don't forget to give name or amount!"
      );
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
      if (
        values.newBudgetAmount.trim() != "" &&
        values.newBudgetName.trim() != "" &&
        check1({
          name: values.newBudgetName.trim(),
          amount: values.newBudgetAmount,
        }) &&
        values.newBudgetAmount <= 9999999999
      ) {
        updateBudget({
          name: values.newBudgetName.trim(),
          amount: values.newBudgetAmount,
          budgetId: values.newExpenseBudget,
        });
        return null;
      } else if (
        values.newBudgetAmount.trim() == "" ||
        values.newBudgetName.trim() == ""
      ) {
        toast.error("Operation failed! Type name and amount!");
      } else if (values.newBudgetAmount > 9999999999) {
        toast.error("Operation failed! Max number is 9999999999!");
      }
      return null;
    } catch (e) {
      return null;
    }
  }
  if (_action === "updateExpense") {
    try {
      if (
        values.newExpenseAmount.trim() != "" &&
        values.newExpense.trim() != "" &&
        check1({
          name: values.newExpense.trim(),
          amount: values.newExpenseAmount,
        }) &&
        values.newExpenseAmount <= 9999999999
      ) {
        updateExpense({
          name: values.newExpense,
          amount: values.newExpenseAmount,
          budgetId: values.newExpenseId,
        });
        return null;
      } else if (
        values.newExpenseAmount.trim() == "" ||
        values.newExpense.trim() == ""
      ) {
        toast.error("Operation failed! Type name and amount!");
      } else if (values.newExpenseAmount > 9999999999) {
        toast.error("Operation failed! Max number is 9999999999!");
      }
      return null;
    } catch (e) {
      console.error(e);
      throw new Error("Oh no! Something is wrong!");
    }
  }
}

const BudgetPage = () => {
  const { budget, expenses } = useLoaderData();

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
        <AddExpenseUpdateForm expenses={expenses} />
      </div>
      {expenses && expenses.length > 0 && (
        <div className="grid-md">
          <h2>
            <span className="accent">{budget.name}</span> Expenses
          </h2>
          <Table expenses={expenses} showBudget={false} />
        </div>
      )}
    </div>
  );
};

export default BudgetPage;
