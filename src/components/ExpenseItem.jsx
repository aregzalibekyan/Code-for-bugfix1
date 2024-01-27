//rrd import
import { Link, useFetcher } from "react-router-dom";

// helpers
import {
  formatCurrency,
  formatDateToLocaleString,
  getAllMatchingItems,
} from "../helpers";

//library import
import { TrashIcon, CloudIcon } from "@heroicons/react/24/solid";

const ExpenseItem = ({ expense, showBudget }) => {
  const fetcher = useFetcher();

  const budget = getAllMatchingItems({
    category: "budgets",
    key: "id",
    value: expense.budgetId,
  })[0];

  return (
    <>
      <td>{expense.name}</td>
      <td>{formatCurrency(expense.amount)}</td>
      <td>{formatDateToLocaleString(expense.createdAt)}</td>
      {showBudget && (
        <td>
          <Link
            to={`/budget/${budget.id}`}
            style={{
              "--accent": budget.color,
            }}
          >
            {budget.name}
          </Link>
        </td>
      )}
      <td>
        <div className="flex">
          <fetcher.Form method="post">
            <input type="hidden" name="_action" value="deleteExpense" />
            <input type="hidden" name="expenseId" value={expense.id} />
            <button
              type="submit"
              className="btn btn--warning"
              aria-label={`Delete ${expense.name} expense`}
            >
              <TrashIcon width={20} />
            </button>
          </fetcher.Form>

          <fetcher.Form method="post">
            <input type="hidden" name="_action" value="updateExpense" />
            <input type="hidden" name="expenseId" value={expense.id} />
            <Link
              to={`/budget/${expense.budgetId}`}
              type="submit"
              className="btn--success btn1"
              aria-label={`Update ${expense.name} expense`}
            >
              <CloudIcon width={20} />
            </Link>
          </fetcher.Form>
        </div>
      </td>
    </>
  );
};
export default ExpenseItem;
