import { useState, useEffect } from "react";
import phones from "./services/phones";
import { v4 as uuidv4 } from "uuid";

const Notification = ({ message, type }) => {
  const className = type === "error" ? "error" : "add";
  return <div className={className}>{message}</div>;
};

const PersonForm = ({
  addNote,
  newName,
  newNumber,
  addCostumerName,
  addCostumerNumber,
  showAlert,
}) => {
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

const Persons = ({ persons, deletePerson }) => {
  return (
    <>
      {persons.map((person) => (
        <p key={person.id}>
          {person.name} {person.number}{" "}
          <button
            onClick={() => {
              deletePerson(person.id);
            }}
          >
            Delete
          </button>
        </p>
      ))}
    </>
  );
};

const Phone = () => {
  const [persons, setPersons] = useState([]);
  const [filtering, setFiltering] = useState("");
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [addNotification, setAddNotification] = useState("");
  const [errorNotification, setErrorNotfication] = useState("");
  const [userAdded, setUserAdded] = useState(false);
  const [userDeleted, setUserDeleted] = useState(false);
  useEffect(() => {
    phones.getAll().then((response) => {
      setPersons(response.data);
    });
  }, []);

  const addNote = (e) => {
    e.preventDefault();
    const numberExists = persons.some((p) => p.number === newNumber);
    const nameExists = persons.some((p) => p.name === newName);

    if (!numberExists) {
      const newPerson = {
        name: newName,
        id: uuidv4(),
        number: newNumber,
      };
      phones.create(newPerson).then((response) => {
        setPersons([...persons, response.data]);
        setNewName("");
        setNewNumber("");
        setShowAlert(false);
        setAddNotification(`Added ${newPerson.name}`);
        setUserAdded(true);
        setTimeout(() => {
          setUserAdded(false);
        }, 3000);
      });
    } else {
      setShowAlert(true);
    }
    if (nameExists) {
      const existingPerson = persons.find((p) => p.name === newName);
      console.log(existingPerson.id);
      if (existingPerson) {
        const updatedPerson = {
          ...existingPerson,
          number: newNumber,
        };
        phones
          .update(existingPerson.id, updatedPerson)
          .then((response) => {
            console.log(`user changed ${response.data}`);
            const updatePerson = persons.map((p) =>
              p.id === response.data.id ? response.data : p
            );
            setPersons(updatePerson);
            setNewNumber("");
            setNewName("");
          })
          .catch((error) => {
            console.error("Delete request failed:", error);
            setErrorNotfication(`${existingPerson.name} is already deleted`);
            setUserDeleted(true);
            setTimeout(() => {
              setUserDeleted(false);
            }, 3000);
          });
        setShowAlert(false);
      }
    }
  };

  const deletePerson = (id) => {
    const personToDelete = persons.find((p) => p.id === id);
    if (personToDelete) {
      phones.delete(id).then((response) => {
        console.log("Delete successful:", response.data);
        const updatedPersons = persons.filter((person) => person.id !== id);
        setPersons(updatedPersons);
      });
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

  const filteredPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(filtering.toLowerCase())
  );

  return (
    <div>
      <h1>Phonebook</h1>
      {userAdded && <Notification message={addNotification} type="add" />}
      {userDeleted && <Notification message={errorNotification} type="error" />}
      <form>
        filter shown with{" "}
        <input
          type="text"
          onChange={(e) => {
            setFiltering(e.target.value);
          }}
          value={filtering}
        />
      </form>
      <h2>add a new</h2>
      <PersonForm
        addNote={addNote}
        newName={newName}
        newNumber={newNumber}
        addCostumerName={addCostumerName}
        addCostumerNumber={addCostumerNumber}
        showAlert={showAlert}
      />
      <h2>Numbers</h2>
      <Persons persons={filteredPersons} deletePerson={deletePerson} />
    </div>
  );
};

export default Phone;
