
import { Routes, Route } from "react-router-dom";

import NavBar from "./components/NavBar";
import ListOfOrchids from "./components/ListOfOrchids";
import EditOrchid from "./components/EditOrchid";
import OrchidDetail from "./components/OrchidDetail";

export default function App() {
  return (
      <>
        <NavBar />

        <div className="container py-4">
          <Routes>
            <Route
                path="/"
                element={<ListOfOrchids />}
            />

            <Route
                path="/orchids/new"
                element={<EditOrchid />}
            />

            <Route
                path="/orchids/:id/edit"
                element={<EditOrchid />}
            />

            <Route
                path="/orchids/:id"
                element={<OrchidDetail />}
            />
          </Routes>
        </div>
      </>
  );
}
