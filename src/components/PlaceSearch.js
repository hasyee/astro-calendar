import React, { useCallback, useMemo } from 'react';
import { FormGroup, MenuItem } from '@blueprintjs/core';
import { Suggest } from '@blueprintjs/select';
import { useLocation, useSearch } from '../hooks';
import './PlaceSearch.scss';

export default React.memo(function PlaceSearch({ onSelectLocation }) {
  const setLocation = useLocation.set;
  const { query, handleQueryChange, items, isSearching } = useSearch();

  const handleItemSelect = useCallback(
    ({ display_name, lon, lat }) => {
      setLocation({ coords: { lng: Number(lon), lat: Number(lat) }, name: display_name });
      onSelectLocation();
    },
    [setLocation, onSelectLocation]
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
