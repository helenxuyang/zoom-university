import React, { useState } from 'react';
import './App.css';
import TextField, { TextFieldProps } from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { matchSorter } from 'match-sorter';
import { DateTime } from 'luxon';

type DateOption = {
  date: DateTime,
  name: string
}
const dateSeparator = ' due ';

const today = DateTime.local();
const tomorrow = today.plus({ days: 1 });
let dateOptions: DateOption[] = [
  { date: today, name: 'today' },
  { date: tomorrow, name: 'tomorrow' },
];
for (let i = 2; i <= 7; i++) {
  const date = today.plus({ days: i });
  dateOptions.push({ date: date, name: date.toFormat('ccc') });
}
dateOptions.forEach((dateOption) => { dateOption.name = `${dateOption.name} (${dateOption.date.toFormat('LLL L')})` });

function QuickBar() {
  const [input, setInput] = useState('');
  const [dueDate, setDueDate] = useState<DateTime | null>(null);

  const handleInput = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setInput(event.target.value);
  }

  const handleSelection = (event: React.ChangeEvent<{}>, value: string | null) => {
    setInput(taskInput);
    setDueDate(dateOptions.filter((dateOption) => dateOption.name === value)[0].date);
  }

  let taskInput = input;
  let dateInput = '';

  if (input.includes(dateSeparator)) {
    const inputs = input.split(dateSeparator);
    taskInput = inputs[0];
    dateInput = inputs[1];
  }

  let dateNames = matchSorter(dateOptions.map(option => option.name), dateInput);
  const filterOptions = () =>
    dateInput === '' ? [] : dateNames;

  return (
    <Autocomplete
      style={{ margin: 24 }}
      freeSolo
      filterOptions={filterOptions}
      options={dateNames}
      inputValue={input}
      renderInput={(params: TextFieldProps) => <TextField {...params} label="Create new task" variant="outlined" onChange={handleInput} />}
      onChange={handleSelection}
    />
  );
}

export default QuickBar;
