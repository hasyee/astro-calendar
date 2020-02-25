import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { FormGroup, MenuItem } from '@blueprintjs/core';
import { Suggest } from '@blueprintjs/select';
import { useSelector, useActions, getLocationName } from '../store';
import { useDebounce } from '../hooks/debounce';
import './PlaceSearch.scss';

export default React.memo(function PlaceSearch({ onSelectLocation }) {
  const locationName = useSelector(getLocationName);

  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery, triggerDebounce] = useDebounce(async q => {
    const results = await searchPlaces(q);
    setIsSearching(false);
    setItems(results);
  }, locationName);

  const [items, setItems] = useState([]);

  const { searchPlaces, setLocation } = useActions();

  const handleQueryChange = useCallback(
    nextValue => {
      setIsSearching(true);
      triggerDebounce(nextValue);
    },
    [setIsSearching, triggerDebounce]
  );

  const handleItemSelect = useCallback(
    item => {
      setQuery(item.display_name);
      setLocation([Number(item.lon), Number(item.lat)], item.display_name);
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
