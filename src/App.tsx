import React from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import Home from "./pages/Home";
import PageNotFound from "./pages/PageNotFound";
import OfficeList from "./pages/OfficeList";
import ActiviteList from "./pages/ActiviteList";
import Error from "./pages/Error";
import MembreList from './pages/MembreList';
import ActiviteNew from './pages/ActiviteNew';
import ActiviteModifier from './pages/ActiviteModifier';
import OfficeNew from './pages/OfficeNew';
import OfficeDetail from './pages/OfficeDetail';
import OfficeModifier from './pages/OfficeModifier';
import Autorisation from './pages/Autorisation';
import NewUser from "./pages/NewUser";
import ForgotPassword from "./pages/ForgotPassword";
import RequireAuth from "./components/RequireAuth";
import PlainteList from "./pages/PlainteList";
import ReservationList from "./pages/ReservationList";
import UserModif from "./pages/UserModif";
import UserDetail from "./pages/UserDetail";
import ReservationNew from "./pages/ReservationNew";
import ReservationCreer from "./pages/ReservationCreer";
import ReservationModifier from "./pages/ReservationModifier";
import InvitationNew from "./pages/InvitationNew";
import InvitationList from "./pages/InvitationList";
import ReservationDetail from "./pages/ReservationDetail";

function App() {
        return (
            <Routes>
            <Route path="/" element={<RequireAuth redirectTo="/Autorisation"><Home/></RequireAuth>}/>
            <Route path="*" element={<RequireAuth redirectTo="/Autorisation"><PageNotFound/></RequireAuth>}/>
            <Route path="/OfficeList" element={<RequireAuth redirectTo="/Autorisation"><OfficeList/></RequireAuth>}/>
            <Route path="/OfficeNew" element={<RequireAuth redirectTo="/Autorisation"><OfficeNew/></RequireAuth>}/>
            <Route path="/OfficeDetail/:id" element={<RequireAuth redirectTo="/Autorisation"><OfficeDetail/></RequireAuth>}/>
            <Route path="/OfficeModifier/:id" element={<RequireAuth redirectTo="/Autorisation"><OfficeModifier/></RequireAuth>}/>
            <Route path="/ActiviteList" element={<RequireAuth redirectTo="/Autorisation"><ActiviteList/></RequireAuth>}/>
            <Route path="/ActiviteNew" element={<RequireAuth redirectTo="/Autorisation"><ActiviteNew/></RequireAuth>}/>
            <Route path="/ActiviteModifier/:id" element={<RequireAuth redirectTo="/Autorisation"><ActiviteModifier/></RequireAuth>}/>
            <Route path="/MembreList" element={<RequireAuth admin redirectTo="/Autorisation"><MembreList/></RequireAuth>}/>
            <Route path="/UserModif" element={<RequireAuth redirectTo="/Autorisation"><UserModif/></RequireAuth>}/>
            <Route path="/UserDetail/:id" element={<RequireAuth redirectTo="/Autorisation"><UserDetail/></RequireAuth>}/>
            <Route path="/PlainteList" element={<RequireAuth redirectTo="/Autorisation"><PlainteList/></RequireAuth>}/>
            <Route path="/ReservationList" element={<RequireAuth redirectTo="/Autorisation"><ReservationList/></RequireAuth>}/>
            <Route path="/ReservationModifier/salle/:noSalle/reservation/:noReservation" element={<RequireAuth redirectTo="/Autorisation"><ReservationModifier/></RequireAuth>}/>
            <Route path="/ReservationDetail/salle/:noSalle/reservation/:noReservation" element={<RequireAuth redirectTo="/Autorisation"><ReservationDetail/></RequireAuth>}/>
            <Route path="/ReservationNew/:id" element={<RequireAuth redirectTo="/Autorisation"><ReservationNew/></RequireAuth>}/>
            <Route path="/ReservationNew" element={<RequireAuth redirectTo="/Autorisation"><ReservationCreer/></RequireAuth>}/>
            <Route path="/InvitationList" element={<RequireAuth redirectTo="/Autorisation"><InvitationList/></RequireAuth>}/>
            <Route path="/InvitationNew/reservation/:noReservation" element={<RequireAuth redirectTo="/Autorisation"><InvitationNew/></RequireAuth>}/>
            <Route path="/Error" element={<Error />} />
            <Route path="/Autorisation" element={<Autorisation />} />
            <Route path="/NewUser" element={<NewUser />} />
            <Route path="/PageNotFound" element={<PageNotFound/>} />
            <Route path="/ForgotPassword" element={<ForgotPassword />} />
        </Routes>
    );
}

export default App;