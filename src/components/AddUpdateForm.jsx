//react imports
import { useEffect, useRef } from "react";

//rrd imports
import { useFetcher } from "react-router-dom";

//library imports
import { CloudIcon } from "@heroicons/react/24/solid";

const AddUpdateForm = ({ budgets }) => {
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
          {budgets.length === 1 && `${budgets.map((budg) => budg.name)}`}
        </span>{" "}
        Values
      </h2>
      <fetcher.Form method="post" className="grid-sm" ref={formRef}>
        <div className="expense-inputs">
          <div className="grid-xs">
            <label htmlFor="newExpense">Budget Name</label>
            <input
              type="text"
              name="newBudgetName"
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
              name="newBudgetAmount"
              id="newExpenseAmount"
              placeholder="e.g., 3.50, positive val."
              required
              max="9999999999"
            />
          </div>
        </div>
        <div className="grid-xs" hidden={budgets.length === 1}>
          <label htmlFor="newExpenseBudget">Budget Category</label>
          <select name="newExpenseBudget" id="newExpenseBudget" required>
            {budgets
              .sort((a, b) => a.createdAt - b.createdAt)
              .map((budget) => {
                return (
                  <option key={budget.id} value={budget.id}>
                    {budget.name}
                  </option>
                );
              })}
          </select>
        </div>
        <input type="hidden" name="_action" value="updateBudget" />
        <button type="submit" className="btn btn--dark">
          {isSubmitting ? (
            <span>Submitting budget...</span>
          ) : (
            <>
              <span>Update</span>
              <CloudIcon width={20} />
            </>
          )}
        </button>
      </fetcher.Form>
    </div>
  );
};

export default AddUpdateForm;
