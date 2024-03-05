//rrd import

import React,{ useEffect, useRef } from "react";
import { NavLink, useFetcher } from "react-router-dom";
//assets
import logomark from "../assets/logomark.svg";

//library
import { TrashIcon } from "@heroicons/react/24/solid";

const Nav = ({ userName }) => {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";
  const formRef = useRef(null);
  useEffect(() => {
    if (!isSubmitting && formRef.current) {
      // clear form
      formRef.current.reset();
      // reset focus
   
    }
  },[isSubmitting]);
  return (
    <nav>
      <NavLink to="/" aria-label="Go to home">
        <img src={logomark} alt="" height={30} />
        <span>HomeBudget</span>
      </NavLink>
      {userName && (
        <fetcher.Form
          method="post"
          action="/logout"
          ref={formRef}
          onSubmit={(event) => {
            if (!confirm("Delete user and all data?")) {
              event.preventDefault();
            }
          }}
          
        >
          <button type="submit" className="btn btn--warning" disabled={isSubmitting}>
            {isSubmitting ? (
              <span>Creating account...</span>
            ) : (
              <>
                <span>Delete User</span>
                <TrashIcon width={20} />  
              </>
            )}
          </button>
        </fetcher.Form>
      )}
    </nav>
  );
};

export default Nav;
