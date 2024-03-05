import React,{ useEffect, useState,useRef } from "react";
import { useFetcher, Link } from "react-router-dom";
import {
  calculateSpentByBudget,
  formatCurrency,
  formatPercentage,
} from "../helpers";
import { BanknotesIcon, TrashIcon } from "@heroicons/react/24/solid";
const BudgetItem = ({ budget, showDelete = false }) => {
  const { id, name, amount, color } = budget;
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";
  const formRef = useRef(null);
  useEffect(() => {
    if (!isSubmitting && formRef.current) {
      //clear form
      formRef.current.reset();

    }
  },[isSubmitting]);
  // Add state variable to track the total amount spent within the budget
  const [totalSpent, setTotalSpent] = useState(calculateSpentByBudget(id));
  useEffect(() => {
    // Calculate total spent and update state
    setTotalSpent(calculateSpentByBudget(id));
  }, [budget]);
  // Function to handle adding a product

  return (
    <div
      className="budget"
      style={{
        "--accent": color,
      }}
    >
      <div className="progress-text">
        <h3>{name}</h3>
        <p>{formatCurrency(amount)} budgeted</p>
      </div>
      <progress max={amount} value={totalSpent}>
        {formatPercentage(totalSpent / amount)}
      </progress>
      <div className="progress-text">
        <small>{formatCurrency(totalSpent)} spent</small>
        <small>{formatCurrency(amount - totalSpent)} remaining</small>
      </div>

      {showDelete ? (
        <div className="flex-sm">
          <fetcher.Form
            method="post"
            action="delete"
            ref={formRef}
            onSubmit={(event) => {
              if (!confirm("Are you sure you want to delete this budget?")) {
                event.preventDefault();
              }
            }}
            
          >
            <button type="submit" className="btn" disabled={isSubmitting}>
            {isSubmitting ? (
            <span>Deleting Budget...</span>
          ) : (
            <>
               <span>Delete Budget</span>
              <TrashIcon width={20} />
            </>
          )}
             
            </button>
          </fetcher.Form>
        </div>
      ) : (
        <div className="flex-sm">
          <Link to={`/budget/${id}`} className="btn">
            <span>View Details</span>
            <BanknotesIcon width={20} />
          </Link>
        </div>
      )}
    </div>
  );
};

export default BudgetItem;
