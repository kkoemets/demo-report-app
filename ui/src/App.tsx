import React from "react";
import Report from "components/Report/Report";

import {enable as enableDarkMode} from "darkreader";
import {BrowserRouter, Route, Routes} from "react-router-dom";

enableDarkMode({
    brightness: 100,
    contrast: 90,
    sepia: 10
});

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Report />}></Route>
                <Route path="/:id" element={<Report />}></Route>
            </Routes>
        </BrowserRouter>
    );
};

export default App;
