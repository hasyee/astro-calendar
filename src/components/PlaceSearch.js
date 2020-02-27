import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { FormGroup, MenuItem } from '@blueprintjs/core';
import { Suggest } from '@blueprintjs/select';
import { useLocationName, useNominatim, useLocation, useDebounce } from '../hooks';
import './PlaceSearch.scss';

export default React.memo(function PlaceSearch({ onSelectLocation }) {
  const [locationName] = useLocationName();
  const setLocation = useLocation.set;
  const nominatim = useNominatim();

  const [items, setItems] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const [query, setQuery] = useDebounce(
    useCallback(
      async query => {
        if (!query) return setItems([]);

        const results = await nominatim.search(query);
        setIsSearching(false);
        setItems(results);
      },
      [nominatim, setIsSearching, setItems]
    ),
    locationName
  );

  useEffect(() => {
    setQuery(locationName, false);
  }, [locationName, setQuery]);

  const handleQueryChange = useCallback(
    query => {
      setIsSearching(true);
      setQuery(query);
    },
    [setIsSearching, setQuery]
  );

  const handleItemSelect = useCallback(
    item => {
      setQuery(item.display_name, false);
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
