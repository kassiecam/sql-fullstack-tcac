import './App.css';
import React, { useState } from 'react';

function App() {
  const [returnedData, setReturnedData] = useState([]);

  const [client, setClient] = useState
    ({
      Id: "",
      First_Name: "",
      Last_Name: "",
      DOB: "",
      Income: "",
      Disabled: false,
      Disability: "n/a",
      Gender_Id: "1",
    });

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return dateStr;
  };

  const setInput = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setClient((prevState) => ({
        ...prevState,
        [name]: checked,
      }));
      return;
    }
    if (name === 'Id' || name === 'Income') {
      setClient(prevState => ({
        ...prevState,
        [name]: value ? parseInt(value) : "",
      }));
      return;
    }
    setClient(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const searchClient = async () => {
    try {
      const filters = {};
      if (client.Id) filters.Id = client.Id;
      if (client.First_Name) filters.First_Name = client.First_Name;
      if (client.Last_Name) filters.Last_Name = client.Last_Name;
      if (client.DOB) filters.DOB = formatDate(client.DOB);

      const response = await fetch("http://localhost:5000/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filters),
      });

      const data = await response.json();
      setReturnedData(data);
    } catch (err) {
      console.error("Error searching client:", err);
    }
  };

  const createClient = async () => {
    const newClient = { ...client };
    delete newClient.Id;

    if (newClient.DOB) {
      newClient.DOB = formatDate(newClient.DOB);
    }

    try {
      const response = await fetch("http://localhost:5000/client", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newClient),
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message);
        setClient({
          Id: "",
          First_Name: "",
          Last_Name: "",
          DOB: "",
          Income: "",
          Disabled: false,
          Disability: "n/a",
          Gender_Id: "1",
        });
      } else {
        alert(data.message || "Error creating client");
      }
    } catch (err) {
      console.error("Error creating client:", err);
      alert("Error creating client");
    }
  };

  const clearClient = () => {
    setClient({
      Id: "",
      First_Name: "",
      Last_Name: "",
      DOB: "",
      Income: "",
      Disabled: false,
      Disability: "n/a",
      Gender_Id: "1",
    });

    setReturnedData([]);
  };


  return (
    <div className="App">
      <input
        type="number"
        name="Id"
        value={client.Id}
        onChange={setInput}
        placeholder="Id"
      />
      <input
        type="text"
        name="First_Name"
        value={client.First_Name}
        onChange={setInput}
        placeholder="First Name"
      />
      <input
        type="text"
        name="Last_Name"
        value={client.Last_Name}
        onChange={setInput}
        placeholder="Last Name"
      />
      <input
        type="date"
        name="DOB"
        value={client.DOB}
        onChange={setInput}
      />
      <input
        type="number"
        name="Income"
        value={client.Income}
        onChange={setInput}
        placeholder="Income"
      />

      <label>
        Disabled:
      </label>
      <select
        name="Disabled"
        value={client.Disabled ? "Yes" : "No"}
        onChange={(e) =>
          setClient((prev) => ({
            ...prev,
            Disabled: e.target.value === "Yes",
          }))
        }
      >
        <option value="No">No</option>
        <option value="Yes">Yes</option>
      </select>

      <label>
        Disability:
      </label>
      <select
        name="Disability"
        value={client.Disability}
        onChange={setInput}
      >
        <option value="n/a">n/a</option>
        <option value="Blind">Blind</option>
        <option value="Deaf">Deaf</option>
        <option value="Handicapped">Handicapped</option>
      </select>

      <label>
        Gender:
      </label>
      <select
        name="Gender_Id"
        value={client.Gender_Id}
        onChange={setInput}
      >
        <option value="1">Male</option>
        <option value="2">Female</option>
      </select>

      <button onClick={searchClient}>Search</button>
      <button onClick={createClient}>Create</button>
      <button onClick={clearClient}>Clear</button>


      <div>
        <h3>Search Results</h3>
        {returnedData.length > 0 ? (
          <table border="1" cellPadding="5">
            <thead>
              <tr>
                <th>Id</th>
                <th>First_Name</th>
                <th>Last_Name</th>
                <th>DOB</th>
                <th>Income</th>
                <th>Disabled</th>
                <th>Disability</th>
                <th>Gender_Id</th>
              </tr>
            </thead>
            <tbody>
              {returnedData.map((c) => (
                <tr key={c.Id}>
                  <td>{c.Id}</td>
                  <td>{c.First_Name}</td>
                  <td>{c.Last_Name}</td>
                  <td>{c.DOB ? c.DOB.split("T")[0] : ""}</td>
                  <td>{c.Income}</td>
                  <td>{c.Disabled ? "Yes" : "No"}</td>
                  <td>{c.Disability}</td>
                  <td>{c.Gender_Id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No results</p>
        )}
      </div>
    </div >
  );
}

export default App;
