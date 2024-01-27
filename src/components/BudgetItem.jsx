import { useState } from "react";
import { Form, Link } from "react-router-dom";
import {
  calculateSpentByBudget,
  formatCurrency,
  formatPercentage,
} from "../helpers";
import { BanknotesIcon, TrashIcon } from "@heroicons/react/24/solid";

const BudgetItem = ({ budget, showDelete = false }) => {
  const { id, name, amount, color } = budget;
  const spent = calculateSpentByBudget(id);

  // Add state variable to track the total amount spent within the budget
  const [totalSpent, setTotalSpent] = useState(spent);

  // Function to handle adding a product
  const handleAddProduct = () => {
    // Check if the new total spent after adding the product exceeds the budgeted amount
    if (totalSpent  > amount) {
      // Handle the case where the budget limit is exceeded (e.g., show an error message)
      alert("Budget limit exceeded for this budget! Cannot add more products.");
    } else {
      // Add product logic here (e.g., update the state, perform necessary actions)
      // Update the total spent
      setTotalSpent(totalSpent );
    }
  };

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
      <div className="flex-sm">
        <button
          type="button"
          className="btn"
          onClick={handleAddProduct}
          disabled={totalSpent >= amount} // Disable the button when the budget limit is reached
        >
          <span>Add Product</span>
          {/* Add your product icon here */}
        </button>
      </div>
      {showDelete ? (
        <div className="flex-sm">
          <Form
            method="post"
            action="delete"
            onSubmit={(event) => {
              if (!confirm("Are you sure you want to delete this budget?")) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit" className="btn">
              <span>Delete Budget</span>
              <TrashIcon width={20} />
            </button>
          </Form>
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
