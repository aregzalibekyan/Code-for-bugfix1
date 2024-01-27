//rrd imports
import { Outlet, useLoaderData } from "react-router-dom";

//assets 
import wave from "../assets/wave.svg";

// helpers
import { fetchData } from "../helpers";

//components
import Nav from "../components/Nav";

//loader
export function mainLoader() {
  const userName = fetchData("userName");
  return { userName };
}

const Main = () => {
  const { userName } = useLoaderData();

  return (
    <div className="layout">
      <Nav userName={userName} />
      <main>
        <Outlet />
      </main>
      <img src={wave} alt="wave" />
    </div>
  );
};

export default Main;
