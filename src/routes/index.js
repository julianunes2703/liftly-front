import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PaginaInicial from "../pages/PaginaInicial/paginaInicial";



const AppRoutes = () => {
    return (
     < Router >
        <Routes>
        <Route path="/" element={<PaginaInicial/>}/>
        
           
        </Routes>
     </Router>
    )
}

export default AppRoutes;