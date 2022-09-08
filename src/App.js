import "./App.css";
import React, { useState, useEffect } from "react";

const App = () => {
  const API_URL = "http://localhost:8081";
  const [apiToken, setApiToken] = useState(null);
  const [data, setData] = useState(null);

  const [validSubmit, setValidSubmit] = useState(false);
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    address: "",
    ssn: "",
  });

  const auth = () => {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    var requestOptions = {
      method: "POST",
      headers: headers,
      body: JSON.stringify({ username: "sarah", password: "connor" }),
    };
    fetch(API_URL + "/auth", requestOptions)
      .then((response) => response.json())
      .then((d) => setApiToken(d.token))
      .catch((err) => console.log(err));
  };

  const getData = () => {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append("Authorization", "Bearer " + apiToken);
    var requestOptions = {
      method: "GET",
      headers: headers,
      redirect: "follow",
    };
    fetch(API_URL + "/api/members", requestOptions)
      .then((response) => response.json())
      .then((d) => setData(d))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    auth();
    if (apiToken) {
      getData();
    }
  }, [apiToken]);

  const resetForm = () => {
    document.getElementById("form").reset();
  };

  const formatSsn = (value) => {
    if (!value) return value;
    const ssn = value.replace(/[^\d]/g, "");
    const ssnLength = ssn.length;
    if (ssnLength < 4) return ssn;
    if (ssnLength < 6) {
      return `${ssn.slice(0, 3)}-${ssn.slice(3)}`;
    }
    return `${ssn.slice(0, 3)}-${ssn.slice(3, 5)}-${ssn.slice(5, 9)}`;
  };

  const validateForm = (values) => {
    setValidSubmit(true);
    if (!values.firstName || values.firstName.length < 2) {
      setValidSubmit(false);
    }
    if (!values.lastName || values.lastName.length < 2) {
      setValidSubmit(false);
    }
    if (!values.address || values.address.length < 2) {
      setValidSubmit(false);
    }
    if (!values.ssn || values.address.length > 9) {
      setValidSubmit(false);
    }
    if (data && data.find(({ ssn }) => ssn === values.ssn)) {
      setValidSubmit(false);
    }
  };

  useEffect(() => {
    validateForm(formValues);
  }, [formValues]);

  const handleChange = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let headers = new Headers();
    headers.append("Authorization", "Bearer " + apiToken);
    headers.append("Content-Type", "application/json");
    //alert(apiToken);
    var requestOptions = {
      method: "POST",
      headers: headers,
      body: JSON.stringify(formValues),
    };

    fetch(API_URL + "/api/members", requestOptions)
      .then((response) => response.json())
      .then((d) => setData((data) => [...data, d]))
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="row">
      <div className="column">
        <form id="form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="firstName"
            value={formValues.firstName}
            onChange={(e) => handleChange(e)}
            placeholder="First Name"
          />

          <input
            type="text"
            name="lastName"
            onChange={(e) => handleChange(e)}
            value={formValues.lastName}
            placeholder="Last Name"
          />

          <input
            type="text"
            name="address"
            onChange={(e) => handleChange(e)}
            value={formValues.address}
            placeholder="Address"
          />

          <input
            type="text"
            name="ssn"
            onChange={(e) => handleChange(e)}
            value={formatSsn(formValues.ssn)}
            placeholder="SSN"
          />
          <input type="button" value="Reset" onClick={() => resetForm()} />
          <input type="submit" value="Submit" disabled={!validSubmit} />
        </form>
      </div>
      <div className="column">
        <table className="table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Address</th>
              <th>SSN</th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.map((data, index) => {
                return (
                  <tr key={index}>
                    <td>{data.firstName}</td>
                    <td>{data.lastName}</td>
                    <td>{data.address}</td>
                    <td>{data.ssn}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
