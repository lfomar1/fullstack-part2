import { useState } from "react";

const Phone = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", id: 1, number: "040-1234567" },
    { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
    { name: "Dan Abramov", number: "12-43-234345", id: 3 },
    { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
  ]);

  const [filtering, setNewFiltering] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const getFilteredPersons = () => {
    return persons.filter((person) =>
      filtering === ""
        ? true
        : person.name.toLowerCase().includes(filtering.toLowerCase())
    );
  };

  const PersonForm = () => {
    const [newName, setNewName] = useState("");
    const [newNumber, setNewNumber] = useState("");
    const addNote = (e) => {
      e.preventDefault();
      const nameExists = persons.some(
        (p) => p.name === newName || p.number === newNumber
      );
      if (!nameExists) {
        const newPerson = {
          name: newName,
          id: persons.length + 1,
          number: newNumber,
        };
        setPersons([...persons, newPerson]);
        setNewName("");
        setNewNumber("");
        setShowAlert(false);
      } else {
        setShowAlert(true);
      }
    };
    const addCostumerName = (e) => {
      setShowAlert(false);
      setNewName(e.target.value);
    };
    const addCostumerNumber = (e) => {
      setShowAlert(false);
      setNewNumber(e.target.value);
    };
    return (
      <>
        <form onSubmit={addNote}>
          <div>
            name: <input onChange={addCostumerName} value={newName} />
          </div>
          <div>
            number: <input onChange={addCostumerNumber} value={newNumber} />
          </div>
          <div>
            <button type="submit">add</button>
          </div>
        </form>
        {showAlert && alert(`${newName} already exists`)}
      </>
    );
  };
  const Persons = () => {
    return (
      <>
        {getFilteredPersons().map((person) => (
          <p key={person.id}>
            {person.name} {person.number}
          </p>
        ))}
      </>
    );
  };
  return (
    <div>
      <h1>Phonebook</h1>
      <form>
        filter shown with{" "}
        <input
          type="text"
          onChange={(e) => {
            setNewFiltering(e.target.value);
          }}
          value={filtering}
        />
      </form>
      <h2>add a new</h2>
      <PersonForm />
      <h2>Numbers</h2>
      <Persons />
    </div>
  );
};

export default Phone;
