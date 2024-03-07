//rrd import
import { Link, useFetcher } from "react-router-dom";
import { useEffect, useRef,useState } from "react";
// helpers
import {
  // formatCurrency,
  formatDateToLocaleString,
  getAllMatchingItems,
} from "../helpers";

//library import
import { TrashIcon, CloudIcon } from "@heroicons/react/24/solid";

const ExpenseItem = ({ expense, showBudget }) => {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";
  const formRef = useRef();
  const formRef1 = useRef();
  // const [formatted,setFormatted] = useState(null);
  useEffect(() => {
    if (!isSubmitting) {
      //clear form
      formRef.current.reset();
    }
  }, [isSubmitting]);
  const budget = getAllMatchingItems({
    category: "budgets",
    key: "id",
    value: expense.budgetId,
  })[0];
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const result = await formatCurrency(expense.amount);
  //       setFormatted(result);
  //     } catch (e) {
  //       throw e;
  //     }
  //   };
  //   fetchData();
  // });
  return (
    <>
      <td>{expense.name}</td>
      <td>{`${expense.amount} ${expense.currency}`}</td>
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
          <fetcher.Form method="post" ref={formRef}>
            <input type="hidden" name="_action" value="deleteExpense" />
            <input type="hidden" name="expenseId" value={expense.id} />
            <button
              type="submit"
              className="btn btn--warning"
              aria-label={`Delete ${expense.name} expense`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span>Deleting expense...</span>
              ) : (
                <TrashIcon width={20} />
              )}
            </button>
          </fetcher.Form>

          <fetcher.Form method="post" ref={formRef1}>
            <input type="hidden" name="_action" value="updateExpense" />
            <input type="hidden" name="expenseId" value={expense.id} />
            <Link
              to={`/budget/${expense.budgetId}`}
              type="submit"
              className="btn--success btn1"
              aria-label={`Update ${expense.name} expense`}
              disabled={isSubmitting}
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
