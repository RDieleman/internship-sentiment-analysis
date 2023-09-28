import { Outlet } from "react-router-dom";
import DisclaimerModal from "../components/modal/custom/disclaimer/DisclaimerModal.jsx";
import Header from "../components/header/Header";
import { useState } from "react";
import AlertContainer from "../components/alerts/AlertContainer.jsx";
import SideMenuOverlay from "../components/overlay/implementations/SideMenuOverlay/SideMenuOverlay.jsx";

function BaseLayout() {
  const [modalIsOpen, setModalIsOpen] = useState(true);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  return (
    <>
      <DisclaimerModal
        isOpen={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
      />
      <AlertContainer />
      <SideMenuOverlay
        isOpen={menuIsOpen}
        onClose={() => setMenuIsOpen(false)}
      />
      <div className="App">
        <Header
          onOpenMenu={() => {
            setMenuIsOpen(true);
          }}
        />
        <Outlet />
      </div>
    </>
  );
}

export default BaseLayout;
