import './App.css';
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

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
      Disability: "0",
      Gender_Id: "0",
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
    if (name === 'Id') {
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
      if (client.Income !== "") {
        filters.Income = Number(client.Income);
      }
      if (client.Gender_Id && client.Gender_Id !== "0") {
        filters.Gender_Id = Number(client.Gender_Id);
      }

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
          Disability: "0",
          Gender_Id: "0",
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
      Disability: "0",
      Gender_Id: "0",
    });
    setReturnedData([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    searchClient();
  };

  return (
    <div className="App">
      <div className="container">
        <div className="leftDiv">
          <form onSubmit={handleSubmit}>
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
            <div className="input-with-dollar">
              <input
                type="text"
                name="Income"
                value={
                  client.Income !== "" && client.Income !== null && client.Income !== undefined
                    ? `${client.Income}`
                    : ""
                }
                onChange={(e) => {
                  let value = e.target.value.replace(/[^0-9.]/g, "");
                  if (value === "" || /^\d*\.?\d*$/.test(value)) {
                    setInput({ target: { name: "Income", value } });
                  }
                }}
                placeholder="Income"
              />
            </div>
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
              <option value="0">-- Select --</option>
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
              <option value="0">-- Select --</option>
              <option value="1">Male</option>
              <option value="2">Female</option>
            </select>

            <button type="submit">Search</button>
            <button type="button" onClick={createClient}>Create</button>
            <button type="button" onClick={clearClient}>Clear</button>
          </form>
        </div>

        <div className="rightDiv">
          <div className="scrollSearch">
            {returnedData.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th colSpan="8" className="tableTitle">Search Results</th>
                  </tr>
                  <tr>
                    <th>Id</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>DOB</th>
                    <th>Income</th>
                    <th>Disabled</th>
                    <th>Disability</th>
                    <th>Gender</th>
                  </tr>
                </thead>
                <tbody>
                  {returnedData.map((c) => (
                    <tr key={c.Id}>
                      <td>{c.Id}</td>
                      <td>{c.First_Name}</td>
                      <td>{c.Last_Name}</td>
                      <td>
                        {c.DOB
                          ? (() => {
                            const [year, month, day] = c.DOB.split("T")[0].split("-");
                            return `${month}/${day}/${year}`;
                          })()
                          : ""}
                      </td>
                      <td>
                        {c.Income !== null && c.Income !== undefined && c.Income !== ""
                          ? `$${Number(c.Income).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}`
                          : "$0.00"}
                      </td>
                      <td>{c.Disabled ? "Yes" : "No"}</td>
                      <td>{c.Disability}</td>
                      <td>{c.Sex}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No results</p>
            )}
          </div>
        </div>
      </div >

    </div>
  );
}

export default App;
