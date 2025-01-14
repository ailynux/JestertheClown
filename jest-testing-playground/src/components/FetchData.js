import React, { useState, useEffect } from "react";

const FetchData = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos/1")
      .then((response) => response.json())
      .then((json) => setData(json.title))
      .catch((error) => console.error("Fetch error:", error));
  }, []);

  return <div>{data ? data : "Loading..."}</div>;
};

export default FetchData; // ✅ Ensure this is a default export
