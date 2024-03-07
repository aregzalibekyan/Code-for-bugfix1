import React, { useEffect, useState, useRef } from "react";
import { useFetcher, Link } from "react-router-dom";
import {
  calculateSpentByBudget,
  formatPercentage,
} from "../helpers";
import { BanknotesIcon, TrashIcon } from "@heroicons/react/24/solid";
const BudgetItem = ({ budget, showDelete = false }) => {
  const { id, name, amount, color,currency } = budget;
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";
  const formRef = useRef(null);
  useEffect(() => {
    if (!isSubmitting && formRef.current) {
      //clear form
      formRef.current.reset();
    }
  }, [isSubmitting]);

  const [totalSpent, setTotalSpent] = useState(calculateSpentByBudget(id));
  useEffect(() => {
    // Calculate total spent and update state
    setTotalSpent(calculateSpentByBudget(id));
  }, [budget]);

  return (
    <div
      className="budget"
      style={{
        "--accent": color,
      }}
    >
      <div className="progress-text">
        <h3>{name}</h3>
        <p>{`${amount} ${currency}`} budgeted</p>
      </div>
      <progress max={amount} value={totalSpent}>
        {formatPercentage(totalSpent / amount)}
      </progress>
      <div className="progress-text">
        <small>{`${totalSpent} ${currency}`} spent</small>
        <small>{`${amount - totalSpent} ${currency}`} remaining</small>
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
          <Link to={`/budget/${id}`} className="btn" disabled={isSubmitting}>
          {isSubmitting ? (
            <span>Loading...</span>
          ) : (
            <>
            <span>View Details</span>
            
            </>
          )           
          
          }
          <BanknotesIcon width={20} />
           
          </Link>
        </div>
      )}
    </div>
  );
};

export default BudgetItem;
