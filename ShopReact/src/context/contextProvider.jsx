import { createContext, useContext, useState } from "react";

const StateContext = createContext({
    user: null,
    token: null,
    setUser: () => { },
    setToken: () => { },
    setUsersSearch: () => { },
    usersSearch: () => { },

    projectsSearch: () => { },
    setProjectsSearch: () => { },
}
)

export const ContextProvider = ({ children }) => {
    const [user, _setUser] = useState(JSON.parse(localStorage.getItem('USER')));
    const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));

    const [projectsSearch, _setProjectsSearch] = useState();
    const [usersSearch, _setUsersSearch] = useState();
    //const [token, _setToken] = useState(123);

    const setToken = (token) => {
        _setToken(token)
        if (token) {
            localStorage.setItem('ACCESS_TOKEN', token);
        } else {
            localStorage.removeItem('ACCESS_TOKEN');
        }
    }

    const setUser = (user) => {
        _setUser(user)
        if (user) {
            localStorage.setItem('USER', JSON.stringify(user));
        } else {
            localStorage.removeItem('USER');
        }
    }
    const setUsersSearch = (user) => {
        _setUsersSearch(user)

    }
    const setProjectsSearch = (user) => {
        _setProjectsSearch(user)

    }


    return (
        <StateContext.Provider value={{
            user,
            setUser,
            token,
            setToken,
            usersSearch,
            setUsersSearch,
            projectsSearch,
            setProjectsSearch,
        }}>
            {children}
        </StateContext.Provider>
    );
}

export const useStateContext = () => useContext(StateContext);