"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { Fragment, useEffect, useState } from "react";
import axios from "axios";

const feature = {
  people: ["name", "gender", "height", "skin_color", "homeworld"],
  films: ["title", "director", "episode_id", "producer", "release_date"],
  starships: ["name", "passengers", "starship_class", "cargo_capacity","cost_in_credits"],
  vehicles: ["name", "passengers", "cargo_capacity", "cost_in_credits" ],
  species: ["name", "language", "homeworld","skin_colors", "designation"],
  planets: ["name", "climate", "gravity", "population"]

};

export default function Home() {
  const [resources, setResources] = useState([]);
  const [selectedResource, setSelectedResource] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [data, setData] = useState({});

  const [error, setError] = useState(false);

  const getResources = async () => {
    try {
      const response = await axios.get("https://swapi.dev/api/");
      const result = await response.data;
      //    console.log(result);
      const resourcesList = Object.keys(result);
      //    console.log(resourcesList);
      const resourcesOptions = resourcesList.map((item) => {
        return { label: item, url: result[item] };
      });
      //    console.log(resoursesOptions);
      setResources(resourcesOptions);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getResources();
  }, []);

  const handleSearchResource = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.get(`${selectedResource}${selectedId}`);
      const result = await response.data;
      result.resources = selectedResource.split("/").at(-2);
      if (result.resources === "people") {
        const planetResponse = await axios.get(result.homeworld);
        const planetResult = await planetResponse.data;
        result.homeworld = planetResult.name;
      }

      setData(result);
      setError(false);
    } catch (error) {
      console.log(error);
      setData({});
      setError(true);
    }
  };

  return (
    <main className={styles.main}>
      <div>
        <form onSubmit={handleSearchResource}>
          <label htmlFor="resourceInput">Buscar por: </label>
          <select
            name="resourceIpt"
            id="resourceInput"
            value={selectedResource}
            onChange={(e) => setSelectedResource(e.target.value)}
          >
            <option value="" disabled>
              Seleccionar
            </option>
            {resources.map((item, index) => {
              return (
                <option value={item.url} key={index}>
                  {item.label.toUpperCase()}
                </option>
              );
            })}
          </select>

          <label htmlFor="idInput" style={{ marginLeft: 10 }}>
            ID:{" "}
          </label>
          <input
            type="number"
            name="idIpt"
            id="idInut"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
          />
          <button type="submit" style={{ margin: 10 }}>
            Buscar
          </button>
        </form>
      </div>
      <hr />
      {Object.keys(data).length > 0
        ? feature[data.resources].map((item, index) => {
            return (
              <h1 key={index} style={{ margin: 10 }}>
                {item.toUpperCase()}: {data[item]}
              </h1>
            );
          })
        : null}
      {error && (
        <Fragment>
          <h1>Estos no son los droides que está buscando</h1>
          <img
            src="https://sm.ign.com/ign_es/news/o/obi-wan-ke/obi-wan-kenobi-was-originally-pitched-as-a-full-movie-trilog_rx8h.jpg"
            alt="obi"
          />
        </Fragment>
      )}
    </main>
  );
}
