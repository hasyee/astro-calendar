import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { FormGroup, MenuItem } from '@blueprintjs/core';
import { Suggest } from '@blueprintjs/select';
import { useLocationName, useNominatim, useLocation, useDebounce } from '../hooks';
import './PlaceSearch.scss';

export default React.memo(function PlaceSearch({ onSelectLocation }) {
  const [locationName] = useLocationName();
  const setLocation = useLocation.set;
  const nominatim = useNominatim();

  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery, search, abortSearch] = useDebounce(async query => {
    const results = await nominatim.search(query);
    setIsSearching(false);
    setItems(results);
  }, locationName);

  const [items, setItems] = useState([]);

  const handleQueryChange = useCallback(
    query => {
      setIsSearching(true);
      search(query);
    },
    [setIsSearching, search]
  );

  const handleItemSelect = useCallback(
    item => {
      setQuery(item.display_name);
      setLocation({ coords: [Number(item.lon), Number(item.lat)], name: item.display_name });
      onSelectLocation();
    },
    [setQuery, setLocation, onSelectLocation]
  );

  const itemRenderer = useCallback(
    (item, { handleClick, modifiers }) => (
      <MenuItem
        key={item.place_id}
        text={item.display_name}
        active={modifiers.active}
        disabled={modifiers.disabled}
        onClick={handleClick}
        multiline
      />
    ),
    []
  );

  const inputValueRenderer = useCallback(item => item.display_name, []);

  const noResults = useMemo(() => (!!query && !isSearching ? <MenuItem disabled text="No results." /> : null), [
    query,
    isSearching
  ]);

  useEffect(() => {
    setQuery(locationName);
  }, [locationName, setQuery]);

  useEffect(() => abortSearch, [abortSearch]);

  return (
    <FormGroup label="Search">
      <Suggest
        fill
        popoverProps={{ minimal: true, popoverClassName: 'suggest-dropdown-popover' }}
        inputProps={{ large: true }}
        query={query}
        onQueryChange={handleQueryChange}
        items={items}
        itemRenderer={itemRenderer}
        inputValueRenderer={inputValueRenderer}
        onItemSelect={handleItemSelect}
        noResults={noResults}
      />
    </FormGroup>
  );
});
