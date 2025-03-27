import React, { useState, createContext } from 'react';

// Create the context
const SearchContext = createContext();

// Create the provider component
const SearchProvider = (props) => {
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);

    const value = {
        search,
        setSearch,
        showSearch,
        setShowSearch,
    };

    return (
        <SearchContext.Provider value={value}>
            {props.children}
        </SearchContext.Provider>
    );
};

export { SearchContext, SearchProvider };
