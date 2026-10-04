import { useCallback, useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';
import type { NominatimPlace } from './location.types';
import { useLocationSetter, useSearch } from './location.hooks';

export default function PlaceSearch({ onSelectLocation }: { onSelectLocation: () => void }) {
  const setLocation = useLocationSetter();
  const { query, handleQueryChange, items, isSearching, hasSearched } = useSearch();
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = useCallback(
    (_: unknown, place: NominatimPlace | null) => {
      if (!place) return;
      setLocation({ coords: { lng: Number(place.lon), lat: Number(place.lat) }, name: place.display_name });
      onSelectLocation();
    },
    [setLocation, onSelectLocation]
  );

  // `reason` is only 'input' for what the user types; 'reset' and 'clear' would blank the prefilled query
  const handleInputChange = useCallback(
    (_: unknown, value: string, reason: string) => {
      if (reason === 'input') handleQueryChange(value);
    },
    [handleQueryChange]
  );

  const hasContent = items.length > 0 || isSearching || (!!query && hasSearched);

  return (
    <Autocomplete<NominatimPlace>
      fullWidth
      value={null}
      options={items}
      inputValue={query}
      onInputChange={handleInputChange}
      onChange={handleChange}
      open={isFocused && hasContent}
      onOpen={() => setIsFocused(true)}
      onClose={() => setIsFocused(false)}
      loading={isSearching}
      loadingText="Searching…"
      noOptionsText="No results."
      filterOptions={options => options}
      getOptionLabel={place => place.display_name}
      isOptionEqualToValue={(option, value) => option.place_id === value.place_id}
      getOptionKey={place => place.place_id}
      renderInput={params => <TextField {...params} label="Search" />}
      slotProps={{ listbox: { style: { maxHeight: 200 } } }}
    />
  );
}
