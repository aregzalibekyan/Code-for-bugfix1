//react imports
import { useEffect, useRef } from "react";

//rrd imports
import { useFetcher } from "react-router-dom";

//library imports
import { PlusCircleIcon } from "@heroicons/react/24/solid";

const AddExpenseUpdateForm = ({ expenses }) => {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";
  const formRef = useRef();
  const focusRef = useRef();

  useEffect(() => {
    if (!isSubmitting) {
      //clear form
      formRef.current.reset();
      // reset focus
      focusRef.current.focus();
    }
  });
  return (
    <div className="form-wrapper">
      <h2 className="h3">
        Update{" "}
        <span className="accent">
          {expenses && expenses.length == 1 && expenses[0].name}
        </span>{" "}
        Expense
      </h2>
      <fetcher.Form method="post" className="grid-sm" ref={formRef}>
        <div className="expense-inputs">
          <div className="grid-xs">
            <label htmlFor="newExpense">Expense Name</label>
            <input
              type="text"
              name="newExpense"
              id="newExpense"
              placeholder="e.g., Coffee"
              ref={focusRef}
              required
            />
          </div>
          <div className="grid-xs">
            <label htmlFor="newExpenseAmount">Amount</label>
            <input
              type="number"
              step="0.01"
              min="1"
              inputMode="decimal"
              name="newExpenseAmount"
              id="newExpenseAmount"
              placeholder="e.g., 3.50, positive val."
              max="9999999999"
              required
            />
          </div>
        </div>
        <div
          className="grid-xs"
          hidden={expenses.length === 1 || expenses.length === 0}
        >
          <label htmlFor="newExpenseBudget">Budget Category</label>
          <select name="newExpenseId" id="newExpenseBudget" required>
            {expenses &&
              expenses.length != 0 &&
              expenses
                .sort((a, b) => a.createdAt - b.createdAt)
                .map((expense) => (
                  <option key={expense.id} value={expense.id}>
                    {expense.name}
                  </option>
                ))}
          </select>
        </div>
        <input type="hidden" name="_action" value="updateExpense" />
        <button type="submit" className="btn btn--dark" disabled={isSubmitting}>
          {isSubmitting ? (
            <span>Submitting budget...</span>
          ) : (
            <>
              <span>Update Expense</span>
              <PlusCircleIcon width={20} />
            </>
          )}
        </button>
      </fetcher.Form>
    </div>
  );
};

export default AddExpenseUpdateForm;
